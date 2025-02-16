import { z } from 'zod';
import { zodToJsonSchema } from "zod-to-json-schema";

export const DraftSchema = z.object({
  id: z.string(),
  recipients: z.object({
    to: z.array(z.string()),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
  }),
  subject: z.string(),
  content: z.string(),
  attachments: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ).optional(),
});

export type DraftData = z.infer<typeof DraftSchema>;

const DraftJsonSchema = zodToJsonSchema(DraftSchema, {name: 'DraftSchema', removeAdditionalStrategy:"strict"});

export function getJsonSchema() {
  return DraftJsonSchema.definitions?.DraftSchema;
}
