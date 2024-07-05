import { Events, ClientEvents } from 'discord.js';

const event = Events.MessageCreate;
const handler = (...[message]: ClientEvents[typeof event]) => {
    console.log(`Message created: ${message.content}`);
};

export { event, handler };
