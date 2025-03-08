import { createDocumentHandler } from '@/lib/blocks/server';

export const emailDocumentHandler = createDocumentHandler<'email'>({
  kind: 'email',
  onCreateDocument: async ({ title, dataStream }) => {
    return '';
  },
  onUpdateDocument: async ({ document, description, dataStream }) => {
    return document.content;
  },
});
