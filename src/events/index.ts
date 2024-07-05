import { Client } from 'discord.js';

import {
    event as clientReadyEvent,
    handler as clientReadyHandler,
} from './clientReady';
import {
    event as messageCreateEvent,
    handler as messageCreateHandler,
} from './messageCreate';
import { event as rawEvent, handler as rawHandler } from './raw';

const registerEvents = (client: Client) => {
    client.on(clientReadyEvent, clientReadyHandler);
    client.on(messageCreateEvent, messageCreateHandler);
    client.on(rawEvent, rawHandler);
};

export { registerEvents };
