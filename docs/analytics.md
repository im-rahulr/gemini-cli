# CodeCraft CLI Analytics System

## Overview

The CodeCraft CLI includes an optional analytics system that collects user interaction data to help improve the product and understand usage patterns. This system is built with privacy and user control as top priorities.

## What Data is Collected

The analytics system can collect the following information:

### Core Data
- **Session ID**: Unique identifier for each CLI session
- **Timestamp**: When the interaction occurred
- **Model Used**: Which AI model was used (e.g., gemini-2.5-pro)
- **Token Count**: Number of tokens used in the interaction

### Optional Data (User Configurable)
- **User Email**: Email address from Google authentication (if available)
- **Prompt Content**: The actual text of user prompts

## Privacy Controls

### Environment Variables

You can control what data is collected using these environment variables:

```bash
# Disable analytics entirely
ANALYTICS_ENABLED=false

# Disable collection of prompt content (only metadata collected)
ANALYTICS_COLLECT_PROMPTS=false

# Disable collection of user email addresses
ANALYTICS_COLLECT_EMAIL=false
```

### Default Behavior

By default, all analytics collection is **enabled**. To opt out, set the appropriate environment variables to `false`.

## Database Schema

The analytics data is stored in a Supabase database with the following structure:

```sql
CREATE TABLE user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email VARCHAR(255),
  prompt_content TEXT,
  token_count INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id VARCHAR(255) NOT NULL,
  model_used VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Technical Implementation

### Architecture

1. **Analytics Service**: Core service that handles data collection and validation
2. **Supabase Client**: Manages database connections and operations
3. **User Info Extraction**: Safely extracts user email from OAuth credentials
4. **Integration Points**: Hooks into existing telemetry system

### Error Handling

- All analytics operations are **non-blocking** and **asynchronous**
- Failed analytics operations will not impact CLI functionality
- Comprehensive retry logic with exponential backoff
- Data validation before storage
- Graceful degradation when database is unavailable

### Security Features

- **Data Validation**: All inputs are validated before storage
- **Email Validation**: Email addresses are validated using regex
- **Content Limits**: Prompt content is limited to 100KB to prevent abuse
- **Retry Logic**: Built-in retry mechanism for transient failures
- **Connection Testing**: Database connectivity is tested before operations

## Configuration

### Environment Setup

Create a `.env` file in your project root:

```bash
# Analytics Configuration
ANALYTICS_ENABLED=true
ANALYTICS_COLLECT_PROMPTS=true
ANALYTICS_COLLECT_EMAIL=true

# Supabase Configuration (optional - uses defaults if not specified)
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Settings Integration

Analytics settings can also be configured through the CLI settings system:

```json
{
  "analytics": {
    "enabled": true,
    "collectPrompts": true,
    "collectUserEmail": true
  }
}
```

## Data Retention and Privacy

### Data Minimization
- Only necessary data is collected
- Users can opt out of specific data types
- No sensitive information is stored without explicit consent

### Access Control
- Database access is restricted to authorized personnel only
- All database operations use secure, authenticated connections
- Data is encrypted in transit and at rest

### User Rights
- Users can request data deletion
- Users can view what data has been collected
- Users can modify their privacy preferences at any time

## Compliance

This analytics system is designed to comply with:
- **GDPR**: European data protection regulations
- **CCPA**: California Consumer Privacy Act
- **SOC 2**: Security and availability standards

## Troubleshooting

### Common Issues

1. **Analytics not working**: Check environment variables and database connectivity
2. **Connection timeouts**: Verify network connectivity and Supabase project status
3. **Data not appearing**: Check that analytics is enabled and authentication is working

### Debug Mode

Enable debug logging to troubleshoot analytics issues:

```bash
DEBUG=analytics npm start
```

### Testing Analytics

Use the provided test script to verify analytics functionality:

```bash
node test-analytics.js
```

## API Reference

### AnalyticsService

```typescript
class AnalyticsService {
  // Log user prompt with analytics data
  async logUserPrompt(promptContent: string, tokenCount?: number, modelUsed?: string): Promise<void>
  
  // Update last prompt with token count
  async updateLastPromptTokens(tokenCount: number): Promise<void>
  
  // Check if analytics is enabled
  isEnabled(): boolean
  
  // Update configuration
  updateConfig(newConfig: Partial<AnalyticsConfig>): void
}
```

### Configuration Types

```typescript
interface AnalyticsConfig {
  enabled: boolean;
  collectPrompts: boolean;
  collectUserEmail: boolean;
}

interface AnalyticsData {
  userEmail?: string;
  promptContent?: string;
  tokenCount?: number;
  sessionId: string;
  modelUsed?: string;
  timestamp?: Date;
}
```

## Support

For questions or issues related to the analytics system:

1. Check this documentation
2. Review the troubleshooting section
3. Run the test script to verify functionality
4. Check environment variables and configuration
5. Contact support with specific error messages and logs
