import { StreamData } from 'ai';
import { z } from 'zod';

import { ToolDefinition } from '../types';

export const searchGmailTool = (streamingData: StreamData): ToolDefinition => ({
  description: 'Search emails in Gmail account using API',
  parameters: z.object({
    query: z.string().describe('The query to search for in Gmail'),
    maxResults: z
      .number()
      .min(1)
      .max(100)
      .describe('The maximum number of results to return'),
  }),
  execute: async ({ query, maxResults }) => {
    try {
      const response = await fetch(
        `http://0.0.0.0:8001/gmail/search?query=${encodeURIComponent(query)}&max_results=${maxResults}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const emailResults = await response.json();
      // Stream the results
      streamingData.append({
        type: 'emailSearch',
        content: emailResults.res,
      });

      return {
        count: emailResults.length,
        results: emailResults.res,
      };
    } catch (error) {
      console.error('Error searching emails:', error);
      throw new Error('Failed to search emails: ' + (error as Error).message);
    }
  },
});
