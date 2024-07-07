import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { discordSnowflake } from './customTypes';
import { messagesTable } from './messagesTable';

export const attachmentsTable = pgTable('attachments', {
    id: serial('id').primaryKey(),
    fileUrl: text('file_url').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    messageId: discordSnowflake('message_id')
        .notNull()
        .references(() => messagesTable.messageId),
});

export type InsertAttachment = typeof attachmentsTable.$inferInsert;
export type SelectAttachment = typeof attachmentsTable.$inferSelect;
