import { z } from 'zod';
import type { Messages } from '@/database';

type Record = Messages;
const schema = z.object({
  id: z.coerce.number().int().positive(),
  userId: z.number().int().positive({
    message: 'cannot be negative number',
  }),
  sprintId: z.number().int().positive(),
  templateId: z.number().int().positive(),
});

const insertable = schema.omit({
  id: true,
});

const updateable = insertable
  .omit({
    completedSprintId: true,
    userId: true,
    sprintId: true,
    templateId: true,
  })
  .partial();

export const parseId = (id: unknown) => schema.shape.id.parse(id);
export const parse = (record: unknown) => schema.parse(record);
export const parseInsertable = (record: unknown) => insertable.parse(record);
export const parseUpdateable = (record: unknown) => updateable.parse(record);

export const keys: (keyof Record)[] = Object.keys(
  schema.shape
) as (keyof z.infer<typeof schema>)[];
