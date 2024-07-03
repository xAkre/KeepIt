import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const attachmentsTable = pgTable('attachments', {
    id: serial('id').primaryKey(),
    dataUrl: text('title').notNull(),
});

export type InsertAttachment = typeof attachmentsTable.$inferInsert;
export type SelectAttachment = typeof attachmentsTable.$inferSelect;
