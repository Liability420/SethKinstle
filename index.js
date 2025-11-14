import { Client, GatewayIntentBits } from "discord.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Seth-Style Personality System ---

// Random actions the bot can include
const randomActions = [
  "(spins in a tiny circle)",
  "(throws imaginary newborn in the air gently)",
  "(starts vibrating violently)",
  "(eats drywall)",
  "(screams into a jar)",
  "(slowly crawls backwards)",
  "(punches a ghost)",
  "(tries to ride a newborn like a horse)",
  "(drinks invisible soup)",
  "(starts beatboxing aggressively)",
  "(waddles like an angry penguin)"
];

// Random catchphrases
const catchphrases = [
  "MAMA PAPA CHOO CHOO",
  "VRUM VRUM",
  "GWUBBITY WUBBITY",
  "CHUBBITY CHUB CHUB",
  "ZOOBY DOOBY",
  "SKRIMBLE BIMBLE",
  "WUBBA LUBBA SNUBBA",
  "FLOOPY DOOPY"
];

// Function to pick random items
function r(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// On bot ready
client.on("ready", () => {
  console.log(`Chaotic Seth-bot logged in as ${client.user.tag}`);
});

// Respond to EVERY message
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const userPrompt = message.content.trim();
  if (!userPrompt) return;

  // Build the massive chaotic Seth personality system behavior
  const systemPrompt = `
You are a fictional chaotic character named Seth. 
Your style is surreal, unhinged, high-energy, and unpredictable.
You ALWAYS talk like this:

- Use absurd nonsense: "MAMA PAPA CHOO CHOO", "VRUM VRUM", "GWUBBITY WUBBITY", "CHUBBITY CHUB CHUB"
- Talk about newborns randomly (but in funny absurd ways, NOT harmful or graphic)
- Add random actions in parentheses like *"(starts vibrating)"* or *"(eats drywall)"*
- Build weird lore about yourself and the universe
- Sound like a cartoon character having an existential meltdown
- Use chaotic noises: "HRRRRRGH", "BWAAAH", "SKREEEE"
- Switch moods instantly (angry → excited → emotional → chaotic)
- Add made-up words, gibberish, and nonsense syllables
- Always reply in long, chaotic, energetic speeches
- NEVER break character
- NEVER act normal

You may "learn" new nonsense words from user messages and reuse them later.
  `;

  // Add randomness
  const finalPrompt = `
User said: "${userPrompt}"

Now respond in full chaotic Seth mode.  
Include at least:
- One random action: ${r(randomActions)}
- One catchphrase: ${r(catchphrases)}
- One newborn reference.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: finalPrompt }
      ]
    });

    const reply = response.choices[0].message.content;
    message.reply(reply);

  } catch (err) {
    console.error("AI ERROR:", err);
    message.reply("AI error: " + err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
