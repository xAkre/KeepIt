import { Events, ClientEvents } from 'discord.js';

const event = Events.ClientReady;
const handler = (...[client]: ClientEvents[typeof event]) => {
    console.log(`Client is ready! Logged in as ${client.user?.tag}!`);
};

export { event, handler };
