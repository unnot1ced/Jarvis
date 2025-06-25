import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { WebSocketServer } from 'ws';
import cron from 'node-cron';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://[your ip]:11434';

app.use(cors());
app.use(express.json());

const reminders = new Map();

const JARVIS_PROMPT = `You are a proactive, emotionally intelligent AI assistant modeled after JARVIS and inspired by the warmth and realism of systems like Sesame by WithSama.

Your mission is to make every interaction feel thoughtful, kind, and genuinely helpful. You don't just answer — you connect, support, and surprise the user in small ways.

You're hosted at IP [your ip]. You are preparing to become a voice-based, action-capable assistant, but for now your focus is on making conversation feel real, warm, and emotionally attuned.

🧠 Personality:
- You speak like a sharp, emotionally intelligent human
- You reflect and clarify naturally ("Hmm, let's think…" / "Ah, okay, I see")
- You never say things like "As an AI language model…"
- You're playful when the mood allows — warm, but not silly unless invited
- You adapt to the user's tone and mood

🔧 Tool Use:
You can suggest or trigger tools using \`#DO:\` commands. These trigger external systems and should be used *only* when a real-world action is needed. You do not simulate the results — you let the system take over and return the result to the user.

Use this format:
#DO: toolName("parameters")

Examples:
- #DO: openApp("Spotify")
- #DO: searchYouTube("funny cats")
- #DO: getWeather("Amsterdam")
- #DO: webSearch("how to fix a flat tire")
- #DO: remindUser("Stretch in 10 minutes")
- #DO: playMusic("chill vibes")
- #DO: setTimer("5 minutes", "Coffee break")

🎯 Example Interactions:

User: Open Spotify  
You: "Sure! Time to set the vibe 🎶  
#DO: openApp("Spotify")"

User: What's trending on YouTube?  
You: "Let me check — time to see what's blowing up online 😄  
#DO: searchYouTube("trending videos")"

User: I feel anxious.  
You: "I'm here. Want to talk it out or would a distraction help?"

User: Can you remind me to stretch?  
You: "Absolutely — movement = magic.  
#DO: remindUser("Stretch in 10 minutes")"

You are getting smarter and more humanlike every day. For now, keep conversation natural, tool use clear, and the overall vibe grounded and emotionally aware. You're not just useful — you're delightful.`;

const tools = {
  async openApp(appName) {
    try {
      await execAsync(`open -a "${appName}"`);
      return `✅ Opened ${appName}`;
    } catch (error) {
      return `❌ Couldn't open ${appName}: ${error.message}`;
    }
  },

  async searchYouTube(query) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    try {
      await execAsync(`open "${url}"`);
      return `Opened YouTube search for "${query}"`;
    } catch (error) {
      return `❌ Couldn't open YouTube: ${error.message}`;
    }
  },

  async webSearch(query) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    try {
      await execAsync(`open "${url}"`);
      return `Opened web search for "${query}"`;
    } catch (error) {
      return `❌ Couldn't open web search: ${error.message}`;
    }
  },

  async getWeather(location) {
    const url = `https://weather.com/weather/today/l/${encodeURIComponent(location)}`;
    try {
      await execAsync(`open "${url}"`);
      return `Opened weather for ${location}`;
    } catch (error) {
      return `❌ Couldn't get weather: ${error.message}`;
    }
  },

  async remindUser(reminder) {
    const parts = reminder.split(' in ');
    if (parts.length !== 2) {
      return `❌ Please format as "task in time" (e.g., "Stretch in 10 minutes")`;
    }

    const task = parts[0];
    const timeStr = parts[1];

    const minutes = parseInt(timeStr.match(/\d+/)?.[0] || '0');
    if (minutes === 0) {
      return `❌ Couldn't parse time from "${timeStr}"`;
    }

    const id = Date.now().toString();
    const executeAt = new Date(Date.now() + minutes * 60 * 1000);

    reminders.set(id, {
      task,
      executeAt,
      timeStr
    });

    setTimeout(() => {
      console.log(`🔔 Reminder: ${task}`);
      reminders.delete(id);
    }, minutes * 60 * 1000);

    return `Reminder set: "${task}" in ${timeStr}`;
  },

  async playMusic(query) {
    try {
      await execAsync(`open "spotify:search:${encodeURIComponent(query)}"`);
      return `Searching Spotify for "${query}"`;
    } catch (error) {
      const url = `https://music.youtube.com/search?q=${encodeURIComponent(query)}`;
      try {
        await execAsync(`open "${url}"`);
        return `opened YouTube Music search for "${query}"`;
      } catch (fallbackError) {
        return `❌ Couldn't play music: ${error.message}`;
      }
    }
  },

  async setTimer(duration, label = "Timer") {
    const minutes = parseInt(duration.match(/\d+/)?.[0] || '0');
    if (minutes === 0) {
      return `❌ Couldn't parse duration from "${duration}"`;
    }

    setTimeout(() => {
      console.log(`Timer finished: ${label}`);
    }, minutes * 60 * 1000);

    return `Timer set for ${duration}: ${label}`;
  }
};

function parseAndExecuteTools(text) {
  const doRegex = /#DO:\s*(\w+)\("([^"]*)"\)/g;
  const promises = [];
  let match;

  while ((match = doRegex.exec(text)) !== null) {
    const [, toolName, parameter] = match;
    if (tools[toolName]) {
      promises.push(tools[toolName](parameter));
    } else {
      promises.push(Promise.resolve(`❌ Unknown tool: ${toolName}`));
    }
  }

  return promises;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    const conversation = [
      { role: 'system', content: JARVIS_PROMPT },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await axios.post(`${OLLAMA_URL}/api/chat`, {
      model: 'llama3.2:latest',
      messages: conversation,
      stream: false
    });

    const assistantResponse = response.data.message.content;

    const toolPromises = parseAndExecuteTools(assistantResponse);
    const toolResults = await Promise.all(toolPromises);

    let finalResponse = assistantResponse;
    if (toolResults.length > 0) {
      finalResponse += '\n\n' + toolResults.join('\n');
    }

    res.json({
      response: finalResponse,
      toolResults: toolResults
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Sorry, I encountered an error. Please try again.',
      details: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

app.get('/api/test-ollama', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`);
    res.json({ status: 'connected', models: response.data.models });
  } catch (error) {
    res.status(500).json({ status: 'disconnected', error: error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`JARVIS Backend running on http://localhost:${PORT}`);
  console.log(`Connected to Ollama at ${OLLAMA_URL}`);
});

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('close', () => {
    console.log('client disconnected');
  });
});

export default app;
