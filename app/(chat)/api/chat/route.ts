import { convertToCoreMessages, Message, StreamData, streamText } from 'ai';

import { customModel } from '@/ai';
import { models } from '@/ai/models';
import { regularPrompt } from '@/ai/prompts';
import { auth } from '@/app/(auth)/auth';
import { deleteChatById, getChatById, saveChat } from '@/db/queries';
import { sanitizeResponseMessages } from '@/lib/utils';
import { loadTools } from '@/toolbox';

export const maxDuration = 60;

// POST request handler
export async function POST(request: Request) {
  // Extract data from request
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  // Authenticate the session
  const session = await auth();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Find the model by ID
  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  // Convert messages to core format
  const coreMessages = convertToCoreMessages(messages);
  const streamingData = new StreamData();

  const toolSet = await loadTools(streamingData);

  // Stream text using the selected model
  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: regularPrompt,
    messages: coreMessages,
    maxSteps: 5,
    // experimental_activeTools: [
    //   ...draftTools,
    //   ...dataTransformTools,
    //   ...emailTools,
    // ],
    // tools: initializeTools(streamingData, model, session),
    tools: toolSet.tools,
    onFinish: async ({ responseMessages }) => {
      console.log('onFinish called');
      if (session.user && session.user.id) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);
          await saveChat({
            id,
            messages: [
              ...coreMessages,
              ...responseMessagesWithoutIncompleteToolCalls,
            ],
            userId: session.user.id,
          });
        } catch (error) {
          console.error('Failed to save chat');
        }
      }
      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
