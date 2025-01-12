import { StreamData } from 'ai';
import { z } from 'zod';

import { customModel } from '@/ai';
import { saveDocument, getDocumentById } from '@/db/queries';
import { generateUUID } from '@/lib/utils';

import { ToolDefinition } from '../types';

export const createDocumentTool = (
  streamingData: StreamData,
  model: any,
  session: any
): ToolDefinition => ({
  description: 'Create a document for a writing activity',
  parameters: z.object({
    title: z.string(),
  }),
  execute: async ({ title }) => {
    const id = generateUUID();
    let draftText: string = '';

    // Append initial data to streaming
    streamingData.append({
      type: 'id',
      content: id,
    });

    streamingData.append({
      type: 'title',
      content: title,
    });

    streamingData.append({
      type: 'clear',
      content: '',
    });

    const { fullStream } = await streamText({
      model: customModel(model.apiIdentifier),
      system:
        'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
      prompt: title,
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'text-delta') {
        const { textDelta } = delta;

        draftText += textDelta;
        streamingData.append({
          type: 'text-delta',
          content: textDelta,
        });
      }
    }

    streamingData.append({ type: 'finish', content: '' });

    if (session.user && session.user.id) {
      await saveDocument({
        id,
        title,
        content: draftText,
        userId: session.user.id,
      });
    }

    return {
      id,
      title,
      content: `A document was created and is now visible to the user.`,
    };
  },
});

export const updateDocumentTool = (
  streamingData: StreamData,
  model: any,
  session: any
): ToolDefinition => ({
  description: 'Update a document with the given description',
  parameters: z.object({
    id: z.string().describe('The ID of the document to update'),
    description: z
      .string()
      .describe('The description of changes that need to be made'),
  }),
  execute: async ({ id, description }) => {
    const document = await getDocumentById({ id });

    if (!document) {
      return {
        error: 'Document not found',
      };
    }

    const { content: currentContent } = document;
    let draftText: string = '';

    streamingData.append({
      type: 'clear',
      content: document.title,
    });

    const { fullStream } = await streamText({
      model: customModel(model.apiIdentifier),
      system:
        'You are a helpful writing assistant. Based on the description, please update the piece of writing.',
      messages: [
        {
          role: 'user',
          content: description,
        },
        { role: 'user', content: currentContent },
      ],
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === 'text-delta') {
        const { textDelta } = delta;

        draftText += textDelta;
        streamingData.append({
          type: 'text-delta',
          content: textDelta,
        });
      }
    }

    streamingData.append({ type: 'finish', content: '' });

    if (session.user && session.user.id) {
      await saveDocument({
        id,
        title: document.title,
        content: draftText,
        userId: session.user.id,
      });
    }

    return {
      id,
      title: document.title,
      content: 'The document has been updated successfully.',
    };
  },
});
