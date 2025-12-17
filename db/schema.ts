import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  short_code: varchar('short_code', { length: 8 }).notNull().unique(),
  long_url: text('long_url').notNull(),
  clicks: integer('clicks').default(0).notNull(),
  last_clicked: timestamp('last_clicked'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});


export type LinkData = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
