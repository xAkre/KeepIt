import { Events, ClientEvents } from 'discord.js';

const event = Events.MessageDelete;
const handler = (...[message]: ClientEvents[typeof event]) => {
    console.log(`Message deleted: ${message.content}`);
};

export { event, handler };
