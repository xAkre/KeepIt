import { Events, ClientEvents } from 'discord.js';
import { InsertMessage } from '@/database/schema';
import { insertMessage } from '@/database/utilities';

const event = Events.MessageCreate;
const handler = (...[message]: ClientEvents[typeof event]) => {
    if (!message.guild) {
        return;
    }

    const messageMetadata: InsertMessage = {
        messageId: BigInt(message.id),
        serverId: BigInt(message.guild.id),
        channelId: BigInt(message.channel.id),
        authorId: BigInt(message.author.id),
        content: message.content,
        dateCreated: message.createdAt,
        dateEdited: message.editedAt,
    };

    insertMessage(messageMetadata);
};

export { event, handler };
