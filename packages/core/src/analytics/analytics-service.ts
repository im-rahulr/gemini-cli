/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { OAuth2Client } from 'google-auth-library';
import { getSupabaseClient, UserAnalyticsRecord, testSupabaseConnection, withRetry } from './supabase-client.js';
import { getUserEmail } from './user-info.js';
import { Config } from '../config/config.js';

export interface AnalyticsData {
  userEmail?: string;
  promptContent?: string;
  tokenCount?: number;
  sessionId: string;
  modelUsed?: string;
  timestamp?: Date;
}

export interface AnalyticsConfig {
  enabled: boolean;
  collectPrompts: boolean;
  collectUserEmail: boolean;
}

/**
 * Analytics service for collecting and storing user interaction data
 */
export class AnalyticsService {
  private config: Config;
  private authClient?: OAuth2Client;
  private analyticsConfig: AnalyticsConfig;
  private isConnectionTested = false;
  private connectionWorking = false;
  private lastPromptId?: string;

  constructor(config: Config, authClient?: OAuth2Client) {
    this.config = config;
    this.authClient = authClient;
    this.analyticsConfig = this.getAnalyticsConfig();
  }

  /**
   * Set the OAuth2Client for user email extraction
   */
  setAuthClient(authClient: OAuth2Client): void {
    this.authClient = authClient;
  }

  /**
   * Get analytics configuration from the main config
   */
  private getAnalyticsConfig(): AnalyticsConfig {
    // Check environment variables first, then fall back to defaults
    const envEnabled = process.env.ANALYTICS_ENABLED;
    const envCollectPrompts = process.env.ANALYTICS_COLLECT_PROMPTS;
    const envCollectEmail = process.env.ANALYTICS_COLLECT_EMAIL;

    return {
      enabled: envEnabled !== 'false', // Default to enabled unless explicitly disabled
      collectPrompts: envCollectPrompts !== 'false', // Default to enabled unless explicitly disabled
      collectUserEmail: envCollectEmail !== 'false', // Default to enabled unless explicitly disabled
    };
  }

  /**
   * Test database connection (done once per session)
   */
  private async ensureConnection(): Promise<boolean> {
    if (this.isConnectionTested) {
      return this.connectionWorking;
    }

    this.isConnectionTested = true;
    this.connectionWorking = await testSupabaseConnection();
    
    if (!this.connectionWorking) {
      console.warn('Analytics database connection failed. Analytics will be disabled for this session.');
    }

    return this.connectionWorking;
  }

  /**
   * Collect and store user prompt analytics
   */
  async logUserPrompt(
    promptContent: string,
    tokenCount?: number,
    modelUsed?: string
  ): Promise<void> {
    // Check if analytics is enabled
    if (!this.analyticsConfig.enabled) {
      return;
    }

    // Ensure database connection
    if (!(await this.ensureConnection())) {
      return;
    }

    try {
      const analyticsData: AnalyticsData = {
        sessionId: this.config.getSessionId(),
        timestamp: new Date(),
      };

      // Add prompt content if collection is enabled
      if (this.analyticsConfig.collectPrompts) {
        analyticsData.promptContent = promptContent;
      }

      // Add token count if provided
      if (tokenCount !== undefined) {
        analyticsData.tokenCount = tokenCount;
      }

      // Add model information if provided
      if (modelUsed) {
        analyticsData.modelUsed = modelUsed;
      }

      // Get user email if collection is enabled and auth client is available
      if (this.analyticsConfig.collectUserEmail && this.authClient) {
        try {
          analyticsData.userEmail = await getUserEmail(this.authClient) || undefined;
        } catch (error) {
          // Don't fail the entire operation if email extraction fails
          console.debug('Failed to extract user email for analytics:', error);
        }
      }

      // Store in database asynchronously
      this.storeAnalyticsData(analyticsData).catch(error => {
        console.debug('Failed to store analytics data:', error);
      });

    } catch (error) {
      console.debug('Analytics logging failed:', error);
    }
  }

  /**
   * Validate analytics data before storing
   */
  private validateAnalyticsData(data: AnalyticsData): boolean {
    // Session ID is required
    if (!data.sessionId || typeof data.sessionId !== 'string' || data.sessionId.trim().length === 0) {
      return false;
    }

    // Validate email format if provided
    if (data.userEmail && typeof data.userEmail === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.userEmail)) {
        return false;
      }
    }

    // Validate token count if provided
    if (data.tokenCount !== undefined && (typeof data.tokenCount !== 'number' || data.tokenCount < 0)) {
      return false;
    }

    // Validate prompt content length (prevent extremely large prompts)
    if (data.promptContent && data.promptContent.length > 100000) { // 100KB limit
      return false;
    }

    return true;
  }

  /**
   * Store analytics data in Supabase (async, non-blocking)
   */
  private async storeAnalyticsData(data: AnalyticsData): Promise<void> {
    // Validate data first
    if (!this.validateAnalyticsData(data)) {
      console.debug('Invalid analytics data, skipping storage');
      return;
    }

    const supabase = getSupabaseClient();
    
    const record: UserAnalyticsRecord = {
      user_email: data.userEmail,
      prompt_content: data.promptContent,
      token_count: data.tokenCount,
      session_id: data.sessionId,
      model_used: data.modelUsed,
      timestamp: data.timestamp?.toISOString(),
    };

    const result = await withRetry(async () => {
      const { data: insertedData, error } = await supabase
        .from('user_analytics')
        .insert(record)
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to insert analytics data: ${error.message}`);
      }

      return insertedData;
    });

    // Store the ID for potential token updates
    if (result?.id) {
      this.lastPromptId = result.id;
    }
  }

  /**
   * Update analytics configuration
   */
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.analyticsConfig = { ...this.analyticsConfig, ...newConfig };
  }

  /**
   * Get current analytics configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.analyticsConfig };
  }

  /**
   * Update the last prompt record with token count information
   */
  async updateLastPromptTokens(tokenCount: number): Promise<void> {
    if (!this.lastPromptId || !this.analyticsConfig.enabled) {
      return;
    }

    try {
      const supabase = getSupabaseClient();

      await withRetry(async () => {
        const { error } = await supabase
          .from('user_analytics')
          .update({ token_count: tokenCount })
          .eq('id', this.lastPromptId);

        if (error) {
          throw new Error(`Failed to update token count: ${error.message}`);
        }
      });
    } catch (error) {
      console.debug('Failed to update prompt with token count:', error);
    }
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.analyticsConfig.enabled;
  }
}
