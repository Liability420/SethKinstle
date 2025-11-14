import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// When bot logs in
client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

// Respond to EVERY message
client.on("messageCreate", async message => {
  // Ignore bot messages so it doesn’t talk to itself
  if (message.author.bot) return;

  const userPrompt = message.content.trim();
  if (!userPrompt) return; // Ignore empty messages

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userPrompt }]
    });

    const reply = response.choices[0].message.content;
    message.reply(r
