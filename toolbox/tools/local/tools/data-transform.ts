import { StreamData } from 'ai';
import { z } from 'zod';

import { ToolDefinition } from '../types';

// type DataArray = Array<Record<string, any>>;

export const createJoinDataTool = (
  streamingData: StreamData
): ToolDefinition => ({
  description: 'Join two datasets based on a common key',
  parameters: z.object({
    leftData: z.array(z.object({})),
    rightData: z.array(z.object({})),
    key: z.string(),
  }),
  execute: async ({ leftData, rightData, key }) => {
    console.log('leftData', leftData);
    return leftData.map((leftRow) => ({
      ...leftRow,
      ...rightData.find((rightRow) => rightRow[key] === leftRow[key]),
    }));
  },
});

// Example of how other functions should be structured:
export const createFilterTool = (
  streamingData: StreamData
): ToolDefinition => ({
  description: 'Filter data based on a condition',
  parameters: z.object({
    data: z.array(z.object({})).describe('The dataset to filter.'),
    condition: z.string().describe('The condition to filter the data by.'),
  }),
  execute: async ({ data, condition }) => {
    console.log('filtering data', data);
    return { data: 'data.filter(condition)' };
  },
});

export const createReplaceTool = (): ToolDefinition => ({
  description:
    'Replace all values for a specific field/key across all records in a dataset. For example, to change all status values from "active" to "inactive".',
  parameters: z.object({
    data: z.array(z.object({})).describe('The dataset to replace values in.'),
    key: z.string().describe('The key to replace values for.'),
    value: z.string().describe('The value to replace the key with.'),
  }),
  execute: async ({ data, key, value }) => {
    console.log('replacing value', data, key, value);
    return data.map((item) => ({
      ...item,
      [key]: value,
    }));
  },
});

// You can export all tools together like this:
// export const createDataTransformTools = (streamingData: StreamData) => ({
//   joinData: createJoinDataTool(streamingData),
//   filter: createFilterTool(streamingData),
//   replaceDataset: createReplaceTool(),
// });
