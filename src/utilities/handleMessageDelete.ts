import { eq } from 'drizzle-orm';
import { database } from '@/database';
import { type SelectMessage, messagesTable } from '@/database/schema';
import { selectScalar } from '@/database/utilities';
import { client } from '@';

/**
 * Handle a message deletion event.
 *
 * @param messageId - The ID of the deleted message.
 */
const handleMessageDelete = async (messageId: bigint) => {
    const messageInDatabase = await selectScalar<SelectMessage>(
        database
            .select()
            .from(messagesTable)
            .where(eq(messagesTable.messageId, messageId)),
    );

    if (!messageInDatabase) {
        return;
    }

    const channel = client.channels.cache.get(
        messageInDatabase.channelId.toString(),
    );

    if (!channel || !channel.isTextBased()) {
        return;
    }

    /* Try to fetch the user from the cache first as it is faster */
    let messageAuthor = client.users.cache.get(
        messageInDatabase.authorId.toString(),
    );
    if (!messageAuthor) {
        messageAuthor = await client.users.fetch(
            messageInDatabase.authorId.toString(),
        );
    }

    const newMessage = await channel.send(
        `Message with ID ${messageInDatabase.originalMessageId} sent by ${messageAuthor.tag} was deleted. Message content: ${messageInDatabase.content}`,
    );

    if (!newMessage) {
        return;
    }

    await database
        .update(messagesTable)
        .set({
            messageId: BigInt(newMessage.id),
        })
        .where(eq(messagesTable.messageId, messageId));
};

export { handleMessageDelete };
