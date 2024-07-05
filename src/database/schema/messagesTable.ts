import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { discordSnowflake } from './customTypes';

export const messagesTable = pgTable('messages', {
    messageId: discordSnowflake('message_id').primaryKey(),
    serverId: discordSnowflake('server_id').notNull(),
    channelId: discordSnowflake('channel_id').notNull(),
    authorId: discordSnowflake('author_id').notNull(),
    authorIsKeepIt: boolean('author_is_keep_it').notNull().default(false),
    content: text('content').notNull(),
    dateCreated: timestamp('date_created').notNull(),
    dateEdited: timestamp('date_edited'),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
