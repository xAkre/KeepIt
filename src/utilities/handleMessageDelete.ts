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

    channel.send(
        `Message with ID ${messageId} was deleted. Message content ${messageInDatabase.content}. :(`,
    );
};

export { handleMessageDelete };
