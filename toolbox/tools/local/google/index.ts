import { StreamData } from 'ai';
import { z } from 'zod';

import { ToolDefinition } from '../types';


export const createGmailAuthTool = (streamingData: StreamData): ToolDefinition => ({
  description: 'Authenticate with Gmail using backend API',
  parameters: z.object({
    action: z.enum(['login', 'logout']),
  }),
  execute: async ({ action }) => {
    try {
      switch (action) {
        case 'login': {
          console.log('login...');
          const response = await fetch('http://0.0.0.0:8001/gmail', {
            method: 'GET'
          });

          if (!response.ok) {
            throw new Error('Failed to authenticate with Gmail');
          }

          const data = await response.json();

          return {
            status: 'success',
            action: 'login',
            message: 'Successfully authenticated with Gmail',
            data
          };
        }

        case 'logout': {
        console.log('logout...');

          return {
            status: 'success',
            action: 'logout',
            message: 'Successfully logged out from Gmail'
          };
        }
      }
    } catch (error) {
      console.error('Gmail authentication error:', error);
      return {
        status: 'error',
        action,
        message: error instanceof Error ? error.message : 'Failed to process Gmail authentication',
      };
    }
  },
});
