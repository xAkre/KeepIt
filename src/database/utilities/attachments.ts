import { eq, inArray } from 'drizzle-orm';
import { Config } from '@/core/config';
import { database } from '..';
import { attachmentsTable, SelectMessage, InsertAttachment } from '../schema';
import { getMessageIdsInServer } from './messages';

/**
 * Get attachments in a server.
 *
 * @param serverId - The server ID to get the attachments for.
 * @returns The attachments in the server.
 */
const getAttachmentsInServer = async (serverId: bigint) => {
    const messageIdsInServer = await getMessageIdsInServer(serverId);

    const attachmentsInServer = await database
        .select()
        .from(attachmentsTable)
        .where(inArray(attachmentsTable.messageId, messageIdsInServer));

    return attachmentsInServer;
};

/**
 * Get the number of attachments in a server.
 *
 * @param serverId - The server ID to get the attachment count for.
 * @returns The number of attachments in the server.
 */
const getAttachmentCountInServer = async (serverId: bigint) => {
    const attachmentsInServer = await getAttachmentsInServer(serverId);

    return attachmentsInServer.length;
};

/**
 * Get the oldest attachment in a server.
 *
 * @param serverId - The server ID to get the oldest attachment for.
 * @returns The oldest attachment in the server, or null if the server has no attachments.
 */
const getOldestAttachmentInServer = async (serverId: bigint) => {
    const attachmentsInServer = await getAttachmentsInServer(serverId);

    const oldestAttachment = attachmentsInServer.reduce(
        (oldest, attachment) => {
            return attachment.createdAt < oldest.createdAt
                ? attachment
                : oldest;
        },
        attachmentsInServer[0],
    );

    return oldestAttachment;
};

/**
 * Insert an attachment into the database. If the server has more than {@link Config.MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER}
 * attachments, the oldest attachment will be deleted.
 *
 * @param message - The message the attachment belongs to.
 * @param attachmentMetadata - The metadata to insert.
 * @returns The inserted attachment and a boolean indicating whether an attachment was deleted.
 */
const insertAttachment = async (
    message: SelectMessage,
    attachmentMetadata: InsertAttachment,
) => {
    const attachmentCountInServer = await getAttachmentCountInServer(
        message.serverId,
    );

    if (
        attachmentCountInServer >= Config.MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER
    ) {
        const oldestAttachment = await getOldestAttachmentInServer(
            message.serverId,
        );

        if (!oldestAttachment) {
            throw new Error('Failed to select attachment to delete');
        }

        await database
            .delete(attachmentsTable)
            .where(eq(attachmentsTable.id, oldestAttachment.id));
    }

    const attachment = await database
        .insert(attachmentsTable)
        .values(attachmentMetadata);

    return {
        attachment,
        attachmentDeleted:
            attachmentCountInServer >=
            Config.MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER,
    };
};

export {
    getAttachmentsInServer,
    getAttachmentCountInServer,
    getOldestAttachmentInServer,
    insertAttachment,
};