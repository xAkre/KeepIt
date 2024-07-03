import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const messagesTable = pgTable('messages', {
    messageId: integer('message_id').primaryKey(),
    serverId: integer('server_id').notNull(),
    channelId: integer('channel_id').notNull(),
    authorId: integer('author_id').notNull(),
    content: text('content').notNull(),
    dateCreated: timestamp('date_created').notNull(),
    dateEdited: timestamp('date_edited'),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
