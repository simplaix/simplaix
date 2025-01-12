import { StreamData } from 'ai';
import { z } from 'zod';

import { getAllPaths, getAllIterations } from '@/lib/devops/get_teams';
import { generateUUID } from '@/lib/utils';

import { ToolDefinition } from '../../types';

export const createDevOpsTicketsTool = (
  streamingData: StreamData
): ToolDefinition => ({
  description: 'Create a Jira ticket for a document',
  parameters: z.object({
    title: z.string(),
    type: z.enum(['TASK', 'BUG', 'FEATURE', 'STORY']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    assignee: z.string().optional(),
    complete: z.number().optional(),
    area: z.string().optional(),
    iteration: z.string().optional(),
  }),
  execute: async ({
    title,
    type,
    priority,
    assignee,
    complete,
    area,
    iteration,
  }) => {
    const ticketId = generateUUID();
    const ticketData = {
      id: `PROJ-${ticketId.slice(0, 4)}`,
      title,
      type: type || 'TASK',
      priority: priority || 'MEDIUM',
      status: 'TODO',
      assignee,
      complete: complete,
      area,
      iteration,
    };

    streamingData.append({
      type: 'jiraTickets',
      content: ticketData,
    });

    return ticketData;
  },
});

export const getAreaPathsTool = (
  streamingData: StreamData
): ToolDefinition => ({
  description: 'Get all area paths',
  parameters: z.object({
    projectId: z.string().optional(),
  }),
  execute: async ({ projectId }) => {
    try {
      console.log('Executing getAreaPathsTool with projectId:', projectId);
      const teams = await getAllPaths();

      streamingData.append({
        type: 'areaPaths',
        content: JSON.parse(JSON.stringify(teams)),
      });
      return teams;
    } catch (error) {
      console.error('Error executing getAreaPathsTool:', error);
      return [];
    }
  },
});

export const getIterationPathsTool = (
  streamingData: StreamData
): ToolDefinition => ({
  description: 'Get all iteration paths',
  parameters: z.object({
    projectId: z.string().optional(),
  }),
  execute: async ({ projectId }) => {
    try {
      console.log('Executing getIterationPathsTool with projectId:', projectId);
      const teams = await getAllIterations();

      streamingData.append({
        type: 'iterationPaths',
        content: JSON.parse(JSON.stringify(teams)),
      });
      return teams;
    } catch (error) {
      console.error('Error executing getIterationPathsTool:', error);
      return [];
    }
  },
});
