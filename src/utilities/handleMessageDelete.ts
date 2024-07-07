import { MessageCreateOptions, AttachmentPayload } from 'discord.js';
import { eq } from 'drizzle-orm';
import { database } from '@/database';
import { type SelectMessage, messagesTable } from '@/database/schema';
import { selectScalar, getMessageAttachments } from '@/database/utilities';
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

    const messageAttachmentsInDatabase = await getMessageAttachments(
        messageInDatabase.messageId,
    );
    const messageAttachments: AttachmentPayload[] | undefined =
        messageAttachmentsInDatabase.length > 0
            ? messageAttachmentsInDatabase.map((attachment) => {
                  return {
                      attachment: attachment.fileUrl,
                      name: attachment.fileUrl.split('_', 2)[2],
                  };
              })
            : undefined;

    const messageCreateOptions: MessageCreateOptions = {
        content: `Message sent by ${messageAuthor.tag} was deleted. Message content: \n\n${messageInDatabase.content}`,
        files: messageAttachments,
    };

    const newMessage = await channel.send(messageCreateOptions);

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
