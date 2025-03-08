import {
  Message,
  createDataStreamResponse,
  formatDataStreamPart,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';
import { myProvider } from '@/lib/ai/models';
import { systemPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import { ToolManager } from '@/toolbox';
export const maxDuration = 60;


export async function POST(request: Request) {
  const {
    id,
    messages,
    selectedChatModel,
  }: { id: string; messages: Array<Message>; selectedChatModel: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userMessage = getMostRecentUserMessage(messages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  try {
    await saveMessages({
      messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
    });
  } catch (error) {
    console.error('Failed to save messages', error);
  }

  return createDataStreamResponse({
    execute: async (dataStream): Promise<void> => {
      // Load mcp tools
      const toolManager = new ToolManager();
      await toolManager.loadTools(dataStream);

      const tools = toolManager.getTools();
      console.log('tools', Object.keys(tools));


      // pull out last message
      const lastMessage = messages[messages.length - 1];

      // console.log('lastMessage', lastMessage);
      console.log('lastMessage', lastMessage);
      const toolInvocation = lastMessage.toolInvocations?.[0];

      if (toolInvocation) {
        // return if tool isn't weather tool or in a result state
        if (
          toolManager.isClientTool(toolInvocation.toolName) && toolInvocation.state === 'result'
        ) {
          // switch through tool result states (set on the frontend)
          switch (toolInvocation.result.status) {
            case 'User has confirmed the draft, continue.': {              // TODO: Make this dynamic match each tool's specific confirmation message for AI to follow
              // Use the updated email_message from the result if available
              const args = toolInvocation.result.modified_args
                ? { ...toolInvocation.args, ...toolInvocation.result.modified_args }
                : toolInvocation.args;

              console.log('args', args);
              const result = await tools[toolInvocation.toolName].callTool(args);

              dataStream.write(
                formatDataStreamPart('tool_result', {
                  toolCallId: toolInvocation.toolCallId,
                  result,
                }),
              );
              // update the message part:
              const updatedMessage = { ...lastMessage, toolInvocation: { ...toolInvocation, result } };
              // Process the updated message if needed
              break;
            }
            case 'No, denied.': {
              console.log('No, denied.');
              // update the message part:
              const updatedMessage = { ...lastMessage, toolInvocation: { ...toolInvocation, result: "No, denied." } };
              // Process the updated message if needed
              break;
            }
            default:
              const updatedMessage = lastMessage;
              // Process the updated message if needed
              break;
          }
          return;
        }
      }




      const result = streamText({
        model: myProvider.languageModel(selectedChatModel),
        system: systemPrompt({ selectedChatModel }),
        messages,
        maxSteps: 10,
        temperature: 0,
        // experimental_activeTools: Allow all tools
        experimental_transform: smoothStream({ chunking: 'word' }),
        experimental_generateMessageId: generateUUID,
        tools: {
          getWeather,
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
          }),
          ...tools,
        },
        onFinish: async ({ response, reasoning }) => {
          if (session.user?.id) {
            try {
              const sanitizedResponseMessages = sanitizeResponseMessages({
                messages: response.messages,
                reasoning,
              });

              console.log('sanitizedResponseMessages', sanitizedResponseMessages);
              if (sanitizedResponseMessages.length > 0) {
                await saveMessages({
                  messages: sanitizedResponseMessages.map((message) => {
                    return {
                    id: message.id,
                    chatId: id,
                    role: message.role,
                    content: message.content,
                    createdAt: new Date(),
                  };
                  }),
                });
              }
            } catch (error) {
              console.error('Failed to save chat');
            }
          }
        },
        experimental_telemetry: {
          isEnabled: true,
          functionId: 'stream-text',
        },
      });

      result.mergeIntoDataStream(dataStream, {
        sendReasoning: true,
      });
    },
    onError: () => {
      return 'Oops, an error occured!';
    },
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
