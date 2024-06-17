import dotenv from 'dotenv';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerEvents } from '@/events';

dotenv.config();

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
];

const client = new Client({
    intents,
});

registerEvents(client);

client.login(process.env.DISCORD_BOT_TOKEN);
