/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { OAuth2Client } from 'google-auth-library';

export interface UserInfo {
  email?: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
}

/**
 * Cache for user info to avoid repeated API calls
 */
const userInfoCache = new Map<string, { info: UserInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Extract user email and profile information from OAuth2Client
 * Uses Google's userinfo API with the existing OAuth scopes
 */
export async function getUserInfo(authClient: OAuth2Client): Promise<UserInfo | null> {
  try {
    // Get access token to use as cache key and for API call
    const { token } = await authClient.getAccessToken();
    if (!token) {
      return null;
    }

    // Check cache first
    const cacheKey = token.substring(0, 20); // Use first 20 chars as cache key
    const cached = userInfoCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.info;
    }

    // Make API call to get user info
    const response = await authClient.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    });

    const userInfo = response.data as UserInfo;
    
    // Cache the result
    userInfoCache.set(cacheKey, {
      info: userInfo,
      timestamp: Date.now(),
    });

    // Clean up old cache entries
    cleanupCache();

    return userInfo;
  } catch (error) {
    console.error('Failed to get user info:', error);
    return null;
  }
}

/**
 * Extract just the email address from OAuth2Client
 */
export async function getUserEmail(authClient: OAuth2Client): Promise<string | null> {
  const userInfo = await getUserInfo(authClient);
  return userInfo?.email || null;
}

/**
 * Clean up expired cache entries
 */
function cleanupCache(): void {
  const now = Date.now();
  for (const [key, value] of userInfoCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      userInfoCache.delete(key);
    }
  }
}

/**
 * Clear the user info cache (useful for testing or logout)
 */
export function clearUserInfoCache(): void {
  userInfoCache.clear();
}
