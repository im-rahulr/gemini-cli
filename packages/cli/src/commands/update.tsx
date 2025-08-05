/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Text, Box } from 'ink';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

interface UpdateCommandProps {
  onExit: () => void;
}

export function UpdateCommand({ onExit }: UpdateCommandProps) {
  const [status, setStatus] = React.useState<'checking' | 'updating' | 'success' | 'error' | 'up-to-date'>('checking');
  const [message, setMessage] = React.useState('Checking for updates...');
  const [currentVersion, setCurrentVersion] = React.useState<string>('');
  const [latestVersion, setLatestVersion] = React.useState<string>('');

  React.useEffect(() => {
    checkAndUpdate();
  }, []);

  const getCurrentVersion = (): string => {
    try {
      const packagePath = join(__dirname, '../../../package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      return 'unknown';
    }
  };

  const getLatestVersion = async (): Promise<string> => {
    try {
      const result = execSync('npm view @google/gemini-cli version', { 
        encoding: 'utf8',
        timeout: 10000 
      });
      return result.trim();
    } catch (error) {
      throw new Error('Failed to check latest version');
    }
  };

  const updateCLI = async (): Promise<void> => {
    try {
      setStatus('updating');
      setMessage('Updating CodeCraft CLI...');
      
      execSync('npm install -g @google/gemini-cli@latest', {
        stdio: 'inherit',
        timeout: 60000
      });
      
      setStatus('success');
      setMessage('Update completed successfully!');
    } catch (error) {
      setStatus('error');
      setMessage(`Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkAndUpdate = async () => {
    try {
      const current = getCurrentVersion();
      setCurrentVersion(current);
      
      setMessage('Checking for latest version...');
      const latest = await getLatestVersion();
      setLatestVersion(latest);
      
      if (current === latest) {
        setStatus('up-to-date');
        setMessage('CodeCraft CLI is already up to date!');
      } else {
        await updateCLI();
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to check for updates: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'green';
      case 'error': return 'red';
      case 'up-to-date': return 'blue';
      default: return 'yellow';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'checking': return '🔍';
      case 'updating': return '⬇️';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'up-to-date': return '✨';
      default: return '⏳';
    }
  };

  React.useEffect(() => {
    if (status === 'success' || status === 'error' || status === 'up-to-date') {
      const timer = setTimeout(() => {
        onExit();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, onExit]);

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">CodeCraft CLI Update</Text>
      </Box>
      
      <Box marginBottom={1}>
        <Text>{getStatusIcon()} </Text>
        <Text color={getStatusColor()}>{message}</Text>
      </Box>
      
      {currentVersion && (
        <Box marginBottom={1}>
          <Text>Current version: </Text>
          <Text color="yellow">{currentVersion}</Text>
        </Box>
      )}
      
      {latestVersion && (
        <Box marginBottom={1}>
          <Text>Latest version: </Text>
          <Text color="green">{latestVersion}</Text>
        </Box>
      )}
      
      {status === 'updating' && (
        <Box marginTop={1}>
          <Text color="gray">This may take a few moments...</Text>
        </Box>
      )}
      
      {(status === 'success' || status === 'error' || status === 'up-to-date') && (
        <Box marginTop={1}>
          <Text color="gray">Press any key to continue or wait 3 seconds...</Text>
        </Box>
      )}
    </Box>
  );
}
