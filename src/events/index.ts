import { Client } from 'discord.js';

import {
    event as clientReadyEvent,
    handler as clientReadyHandler,
} from './clientReady';
import {
    event as messageCreateEvent,
    handler as messageCreateHandler,
} from './messageCreate';
import {
    event as messageDeleteEvent,
    handler as messageDeleteHandler,
} from './messageDelete';

const registerEvents = (client: Client) => {
    client.on(clientReadyEvent, clientReadyHandler);
    client.on(messageCreateEvent, messageCreateHandler);
    client.on(messageDeleteEvent, messageDeleteHandler);
};

export { registerEvents };
