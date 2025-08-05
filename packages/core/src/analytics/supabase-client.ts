/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = 'https://ycxceefjouwuzxxsdxmt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljeGNlZWZqb3V3dXp4eHNkeG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTcxODcsImV4cCI6MjA2OTk3MzE4N30.tDFC7NyKRvTf0J1qjIdFUpZiMpDcwPz35pxdZn3PcdI';

// Database types for TypeScript
export interface UserAnalyticsRecord {
  id?: string;
  user_email?: string;
  prompt_content?: string;
  token_count?: number;
  timestamp?: string;
  session_id: string;
  model_used?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      user_analytics: {
        Row: UserAnalyticsRecord;
        Insert: Omit<UserAnalyticsRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserAnalyticsRecord, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

let supabaseClient: SupabaseClient<Database> | null = null;

/**
 * Get or create the Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    // Allow environment variables to override default configuration
    const url = process.env.SUPABASE_URL || SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;
    
    supabaseClient = createClient<Database>(url, key, {
      auth: {
        persistSession: false, // We don't need user sessions for analytics
      },
      db: {
        schema: 'public',
      },
    });
  }
  
  return supabaseClient;
}

/**
 * Test the Supabase connection with retry logic
 */
export async function testSupabaseConnection(retries = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = getSupabaseClient();
      const { error } = await client.from('user_analytics').select('count').limit(1);

      if (!error) {
        return true;
      }

      console.debug(`Supabase connection test failed (attempt ${attempt}/${retries}):`, error);

      // If this is the last attempt, return false
      if (attempt === retries) {
        return false;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));

    } catch (error) {
      console.debug(`Supabase connection test error (attempt ${attempt}/${retries}):`, error);

      if (attempt === retries) {
        return false;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return false;
}

/**
 * Execute a database operation with retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retries + 1) {
        throw error;
      }

      console.debug(`Database operation failed (attempt ${attempt}/${retries + 1}), retrying...`);
      await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
    }
  }

  throw new Error('Retry logic failed unexpectedly');
}

/**
 * Reset the Supabase client (useful for testing)
 */
export function resetSupabaseClient(): void {
  supabaseClient = null;
}
