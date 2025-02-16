import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const EmailResultSchema = z.object({
  id: z.string().optional(),
  threadId: z.string().optional(),
  subject: z.string(),
  from: z.string(),
  date: z.string().datetime(),
  snippet: z.string(),
  body: z.string(),
  htmlBody: z.string(),
});

export type EmailResult = z.infer<typeof EmailResultSchema>;

const EmailResultJsonSchema = zodToJsonSchema(EmailResultSchema, {name: 'EmailResultSchema', removeAdditionalStrategy:"strict"});

export function getJsonSchema() {
  return EmailResultJsonSchema.definitions?.EmailResultSchema;
}
