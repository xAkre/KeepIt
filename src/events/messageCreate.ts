import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { Events, ClientEvents } from 'discord.js';
import { Config } from '@/core/config';
import { InsertMessage } from '@/database/schema';
import { insertMessage, insertAttachment } from '@/database/utilities';
import {
    saveAttachmentFromUrl,
    deleteAttachmentFromUrl,
} from '@/gcloud/utilities';

dotenv.config();

const event = Events.MessageCreate;
const handler = async (...[message]: ClientEvents[typeof event]) => {
    if (
        !message.guild ||
        message.author.id === message.client.user.id ||
        message.system
    ) {
        return;
    }

    const messageMetadata: InsertMessage = {
        messageId: BigInt(message.id),
        originalMessageId: BigInt(message.id),
        serverId: BigInt(message.guild.id),
        channelId: BigInt(message.channel.id),
        authorId: BigInt(message.author.id),
        content: message.content,
        dateCreated: message.createdAt,
        dateEdited: message.editedAt,
    };

    const { message: insertedMessage } = await insertMessage(messageMetadata);

    if (message.attachments.size > 0) {
        message.attachments.forEach(async (attachment) => {
            try {
                const destinationFileName = `${attachment.id}_${v4()}_${attachment.name}`;
                saveAttachmentFromUrl(
                    Config.GOOGLE_CLOUD_STORAGE_BUCKET,
                    attachment.url,
                    destinationFileName,
                );
                const { attachmentWasDeleted, deletedAttachment } =
                    await insertAttachment(insertedMessage, {
                        fileUrl: `https://storage.googleapis.com/${Config.GOOGLE_CLOUD_STORAGE_BUCKET}/${destinationFileName}`,
                        messageId: insertedMessage.messageId,
                    });

                if (attachmentWasDeleted) {
                    deleteAttachmentFromUrl(
                        Config.GOOGLE_CLOUD_STORAGE_BUCKET,
                        deletedAttachment!.fileUrl,
                    );
                }
            } catch (error) {
                /* TODO: If there is an error saving the attachment, revert any additions to gcloud and the database */
                console.error(error);
            }
        });
    }
};

export { event, handler };
