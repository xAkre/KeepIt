import { pgTable } from 'drizzle-orm/pg-core';
import { discordSnowflake } from './customTypes';
import { messagesTable } from './messagesTable';
import { attachmentsTable } from './attachmentsTable';

export const messageAttachmentsTable = pgTable('message_attachments', {
    messageId: discordSnowflake('user_id')
        .notNull()
        .references(() => messagesTable.messageId, { onDelete: 'cascade' }),
    attachmentId: discordSnowflake('attachment_id')
        .notNull()
        .references(() => attachmentsTable.id, { onDelete: 'cascade' }),
});

export type InsertMessageAttachment =
    typeof messageAttachmentsTable.$inferInsert;
export type SelectMessageAttachment =
    typeof messageAttachmentsTable.$inferSelect;
