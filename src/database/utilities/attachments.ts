import { eq, inArray } from 'drizzle-orm';
import { Config } from '@/core/config';
import { database } from '..';
import {
    attachmentsTable,
    SelectMessage,
    SelectAttachment,
    InsertAttachment,
} from '../schema';
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
 * @returns The inserted attachment, whether an attachment was deleted, and the deleted attachment.
 */
const insertAttachment = async (
    message: SelectMessage,
    attachmentMetadata: InsertAttachment,
) => {
    const attachmentCountInServer = await getAttachmentCountInServer(
        message.serverId,
    );

    let oldestAttachment: SelectAttachment | undefined = undefined;
    if (
        attachmentCountInServer >= Config.MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER
    ) {
        oldestAttachment = await getOldestAttachmentInServer(message.serverId);

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
        attachmentWasDeleted:
            attachmentCountInServer >=
            Config.MAX_ATTACHMENTS_IN_DATABASE_PER_SERVER,
        deletedAttachment: oldestAttachment,
    };
};

/**
 * Get attachments belonging to a message.
 *
 * @param messageId - The message ID to get the attachments for.
 * @returns The attachments belonging to the message.
 */
const getMessageAttachments = async (messageId: bigint) => {
    const attachmentsInMessage = await database
        .select()
        .from(attachmentsTable)
        .where(eq(attachmentsTable.messageId, messageId));

    return attachmentsInMessage;
};

export {
    getAttachmentsInServer,
    getAttachmentCountInServer,
    getOldestAttachmentInServer,
    insertAttachment,
    getMessageAttachments,
};
