import { Events } from 'discord.js';
import { handleMessageDelete } from '@/utilities';

const event = Events.Raw;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const handler = async (packet: any) => {
    if (packet?.t === 'MESSAGE_DELETE') {
        handleMessageDelete(BigInt(packet.d.id));
    }
};

export { event, handler };
