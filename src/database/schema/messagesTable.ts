import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { discordSnowflake } from './customTypes';

export const messagesTable = pgTable('messages', {
    messageId: discordSnowflake('message_id').primaryKey(),
    originalMessageId: discordSnowflake('original_message_id').notNull(),
    serverId: discordSnowflake('server_id').notNull(),
    channelId: discordSnowflake('channel_id').notNull(),
    authorId: discordSnowflake('author_id').notNull(),
    content: text('content').notNull(),
    dateCreated: timestamp('date_created').notNull(),
    dateEdited: timestamp('date_edited'),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
