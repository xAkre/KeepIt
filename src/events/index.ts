import { Client } from 'discord.js';

import {
    event as clientReadyEvent,
    handler as clientReadyHandler,
} from './clientReady';

const registerEvents = (client: Client) => {
    client.on(clientReadyEvent, clientReadyHandler);
};

export { registerEvents };
