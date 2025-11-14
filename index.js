import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!ai")) return;

  const userPrompt = message.content.replace("!ai", "").trim();
  if (!userPrompt) return message.reply("Ask me something after !ai");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: userPrompt }]
    });

    const reply = response.choices[0].message.content;
    message.reply(reply);

  } catch (err) {
    console.error(err);
    message.reply("AI error.");
  }
});

client.login(process.env.DISCORD_TOKEN);
