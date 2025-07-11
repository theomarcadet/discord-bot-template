// If you need any help --> https://t.me/+kiN3qpxyMBJmYTBk

import {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ChannelType,
} from "discord.js";

import fetch from "node-fetch";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
});

client.once("ready", () => {
    console.log("Bot online !");
});

client.on("messageCreate", async (message) => {
    // Ignore any messages sent by bots
    if (message.author.bot) return;

    if (message.channel.type === ChannelType.DM) {
        try {
            const response = await fetch(
                process.env.WEBHOOK_URL,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        content: message.content,
                        username: message.author.username,
                        id: message.author.id,
                        timestamp: message.createdAt,
                        bot: message.author.bot,
                        channelType: message.channel.type,
                        channelId: message.channel.id,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log("DM forwarded to n8n webhook");
        } catch (error) {
            console.error("Error sending DM to n8n webhook:", error);
        }
    }
});

client.login(process.env.BOT_TOKEN);