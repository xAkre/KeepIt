import { count, eq, asc } from 'drizzle-orm';
import { database } from '..';
import {
    type InsertMessage,
    type SelectMessage,
    messagesTable,
} from '../schema';
import { selectScalar } from '.';

const MAX_MESSAGES_PER_SERVER = 100;

/**
 * Insert a message into the database. If the server has more than {@link MAX_MESSAGES_PER_SERVER}
 * messages, delete the oldest message.
 *
 * @param messageMetadata - The message metadata to insert.
 * @returns A promise containing a boolean indicating whether a message was
 * deleted to make room for the new message.
 */
const insertMessage = async (messageMetadata: InsertMessage) => {
    const result = await selectScalar<{
        messageCountInServer: number;
    }>(
        database
            .select({
                messageCountInServer: count(),
            })
            .from(messagesTable)
            .where(eq(messagesTable.serverId, messageMetadata.serverId)),
    );

    if (!result) {
        return false;
    }

    if (result.messageCountInServer >= MAX_MESSAGES_PER_SERVER) {
        const messageToDelete = await selectScalar<SelectMessage>(
            database
                .select()
                .from(messagesTable)
                .where(eq(messagesTable.serverId, messageMetadata.serverId))
                .orderBy(asc(messagesTable.dateCreated))
                .limit(1),
        );

        if (!messageToDelete) {
            return false;
        }

        await database
            .delete(messagesTable)
            .where(eq(messagesTable.messageId, messageToDelete.messageId));
    }

    await database.insert(messagesTable).values(messageMetadata);

    return result.messageCountInServer >= MAX_MESSAGES_PER_SERVER;
};

export { insertMessage };
