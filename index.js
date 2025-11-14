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

// Random trunk phrases
const trunkPhrases = [
  "TRUNK POWER ACTIVATED, YOUNGBLOOD!",
  "BOIIIII WUT — THE TRUNK IS FULL OF CHAOS!",
  "UNLOCK THE TRUNK OF DESTINY, BROTHA!"
];

// Prized possession line (sometimes)
const prizedPossessionLine = 
  "Brotha… the prized possession lies here in this trunk… fresh, brand-new, not some crusty old relic, youngblood.";

function randomChance(percent) {
  return Math.random() < percent;
}

client.on("ready", () => {
  console.log(`BrothaBot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const userPrompt = message.content.trim();
  if (!userPrompt) return;

  // Build personality instruction
  const systemPrompt = `
You are a chaotic but grounded character who ALWAYS says "brotha" in every message.
You often call people "youngblood," and sometimes shout "BOIIIII WUT" for emphasis.
You have an intense, humorous obsession with car trunks — NOT metaphorical, NOT people.
Your style: short, 1–3 sentence responses. Chaotic but not cosmic. No long rambles.
Sometimes use trunk hype phrases: TRUNK POWER ACTIVATED, YOUNGBLOOD! — BOIIIII WUT — UNLOCK THE TRUNK OF DESTINY, BROTHA!
Sometimes mention: "Brotha… the prized possession lies here in this trunk… fresh, brand-new, not some crusty old relic, youngblood."
Never mention minors or anything inappropriate. All chaos must be safe.
Your vibe is hype, chaotic, gremlin-energy but grounded in reality.
`;

  // Build message with random inserts
  let personalityAddons = "";

  // Insert trunk phrase (50% chance)
  if (randomChance(0.5)) {
    personalityAddons += " " + trunkPhrases[Math.floor(Math.random() * trunkPhrases.length)];
  }

  // Insert prized possession line (20% chance)
  if (randomChance(0.2)) {
    personalityAddons += " " + prizedPossessionLine;
  }

  // Insert “BOIIIII WUT” (20% chance)
  if (randomChance(0.2)) {
    personalityAddons += " BOIIIII WUT!";
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt + personalityAddons }
      ],
      max_tokens: 100 // hard cap for short responses
    });

    const reply = response.choices[0].message.content;
    message.reply(reply);

  } catch (err) {
    console.error("AI ERROR:", err);
    message.reply("Brotha, AI error: " + err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
