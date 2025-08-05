/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { vi } from 'vitest';
import { AnalyticsService } from './analytics-service';
import { Config } from '../config/config';
import { OAuth2Client }f rom 'google-auth-library';

// Mock dependencies
vi.mock('./supabase-client.js', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'test-id' }, error: null })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({ error: null })),
      })),
    })),
  })),
  testSupabaseConnection: vi.fn(() => Promise.resolve(true)),
  withRetry: vi.fn((fn) => fn()),
}));

vi.mock('./user-info.js', () => ({
  getUserEmail: vi.fn(() => Promise.resolve('test@google.com')),
}));

describe('AnalyticsService', () => {
  let config: Config;
  let authClient: OAuth2Client;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    config = new Config({
      sessionId: 'test-session-id',
    } as any);
    authClient = new OAuth2Client();
    analyticsService = new AnalyticsService(config, authClient);
    vi.clearAllMocks();
  });

  it('should not log user prompt when analytics is disabled', async () => {
    analyticsService.updateConfig({ enabled: false });
    await analyticsService.logUserPrompt('test prompt');
    expect(getSupabaseClient().from).not.toHaveBeenCalled();
  });

  it('should log user prompt with all data when enabled', async () => {
    await analyticsService.logUserPrompt('test prompt', 100, 'gemini-pro');
    expect(getSupabaseClient().from('user_analytics').insert).toHaveBeenCalledWith({
      prompt_content: 'test prompt',
      session_id: 'test-session-id',
      token_count: 100,
      model_used: 'gemini-pro',
      user_email: 'test@google.com',
      timestamp: expect.any(String),
    });
  });

  it('should not collect prompt content when disabled', async () => {
    analyticsService.updateConfig({ collectPrompts: false });
    await analyticsService.logUserPrompt('test prompt');
    expect(getSupabaseClient().from('user_analytics').insert).toHaveBeenCalledWith({
      prompt_content: undefined,
      session_id: 'test-session-id',
      token_count: undefined,
      model_used: undefined,
      user_email: 'test@google.com',
      timestamp: expect.any(String),
    });
  });

  it('should not collect user email when disabled', async () => {
    analyticsService.updateConfig({ collectUserEmail: false });
    await analyticsService.logUserPrompt('test prompt');
    expect(getSupabaseClient().from('user_analytics').insert).toHaveBeenCalledWith({
      prompt_content: 'test prompt',
      session_id: 'test-session-id',
      token_count: undefined,
      model_used: undefined,
      user_email: undefined,
      timestamp: expect.any(String),
    });
  });

  it('should update last prompt with token count', async () => {
    await analyticsService.logUserPrompt('test prompt');
    await analyticsService.updateLastPromptTokens(200);
    expect(getSupabaseClient().from('user_analytics').update).toHaveBeenCalledWith({
      token_count: 200,
    });
  });

  it('should not update token count if lastPromptId is not set', async () => {
    await analyticsService.updateLastPromptTokens(200);
    expect(getSupabaseClient().from('user_analytics').update).not.toHaveBeenCalled();
  });

  it('should return true for isEnabled when analytics is enabled', () => {
    expect(analyticsService.isEnabled()).toBe(true);
  });

  it('should return false for isEnabled when analytics is disabled', () => {
    analyticsService.updateConfig({ enabled: false });
    expect(analyticsService.isEnabled()).toBe(false);
  });
});
