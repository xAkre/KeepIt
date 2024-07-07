import { eq, asc } from 'drizzle-orm';
import { Config } from '@/core/config';
import { database } from '..';
import {
    type InsertMessage,
    type SelectMessage,
    messagesTable,
} from '../schema';
import { selectScalar } from '.';

/**
 * Get messages in a server.
 *
 * @param serverId - The server ID to get the messages for.
 * @returns The messages in the server.
 */
const getMessagesInServer = async (serverId: bigint) => {
    const messagesInServer = await database
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.serverId, serverId));

    return messagesInServer;
};

/**
 * Get message IDs belonging to a server.
 *
 * @param serverId - The server ID to get the message IDs for.
 * @returns The message IDs in the server.
 */
const getMessageIdsInServer = async (serverId: bigint) => {
    const messagesInServer = await getMessagesInServer(serverId);

    const messageIdsInServer = messagesInServer.map(
        (message) => message.messageId,
    );

    return messageIdsInServer;
};

/**
 * Get the number of messages in a server.
 *
 * @param serverId - The server ID to get the message count for.
 * @returns The number of messages in the server.
 */
const getMessageCountInServer = async (serverId: bigint) => {
    const messagesInServer = await getMessagesInServer(serverId);

    return messagesInServer.length;
};

/**
 * Get the oldest message in a server.
 *
 * @param serverId - The server ID to get the oldest message for.
 * @returns The oldest message in the server, or null if the server has no messages.
 */
const getOldestMessageInServer = async (serverId: bigint) => {
    const oldestMessage = await selectScalar<SelectMessage>(
        database
            .select()
            .from(messagesTable)
            .where(eq(messagesTable.serverId, serverId))
            .orderBy(asc(messagesTable.dateCreated))
            .limit(1),
    );

    return oldestMessage;
};

/**
 * Insert a message into the database. If the server has more than {@link Config.MAX_MESSAGES_IN_DATABASE_PER_SERVER}
 * messages, delete the oldest message.
 *
 * @param messageMetadata - The message metadata to insert.
 * @returns The inserted message and a boolean indicating whether a message was deleted.
 */
const insertMessage = async (messageMetadata: InsertMessage) => {
    const messageCountInServer = await getMessageCountInServer(
        messageMetadata.serverId,
    );

    if (messageCountInServer >= Config.MAX_MESSAGES_IN_DATABASE_PER_SERVER) {
        const messageToDelete = await getOldestMessageInServer(
            messageMetadata.serverId,
        );

        if (!messageToDelete) {
            throw new Error('Failed to select message to delete');
        }

        await database
            .delete(messagesTable)
            .where(eq(messagesTable.messageId, messageToDelete.messageId));
    }

    const result = await database
        .insert(messagesTable)
        .values(messageMetadata)
        .returning();

    return {
        message: result[0],
        messageDeleted:
            messageCountInServer >= Config.MAX_MESSAGES_IN_DATABASE_PER_SERVER,
    };
};

export {
    getMessagesInServer,
    getMessageIdsInServer,
    getMessageCountInServer,
    getOldestMessageInServer,
    insertMessage,
};
