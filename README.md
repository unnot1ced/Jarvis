#  JARVIS - Local AI Assistant

A fully local JARVIS-inspired AI assistant built with React, Node.js, and Ollama integration.

## Features

- **Emotionally Intelligent**: Warm, human-like conversations inspired by JARVIS and Sesame
- **Tool Integration**: Execute real-world actions via `#DO:` commands
- **Voice Input**: Speech-to-text using Web Speech API
- **Local First**: Runs entirely on your local network using Ollama
- **Real-time**: WebSocket support for future real-time features
- **Beautiful UI**: Modern, responsive interface with JARVIS-inspired design


## Prerequisites

1. **Ollama** running on `[Your ip]:11434` with `llama3.2:latest` model
2. **Node.js** V18+ installed
3. **npm** or **yarn**

## Important note 
Please change all the [your ip] to your actual own ip where the server of ollama is hosted. Please read and look carefully through all files.


### Individual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend on `http://localhost:5173`

## Available Tools

JARVIS can execute the following actions:

- `#DO: openApp("AppName")` - Open applications (Spotify, Chrome, etc.)
- `#DO: searchYouTube("query")` - Search YouTube
- `#DO: webSearch("query")` - Google search
- `#DO: getWeather("location")` - Get weather info
- `#DO: remindUser("task in X minutes")` - Set reminders
- `#DO: playMusic("genre/artist")` - Play music
- `#DO: setTimer("X minutes", "label")` - Set timers

## Example Conversations

**User:** "Open Spotify"
**JARVIS:** "Sure! Time to set the vibe 🎶" + *opens Spotify*

**User:** "Remind me to stretch in 10 minutes"
**JARVIS:** "Absolutely — movement = magic." + *sets reminder*

**User:** "I feel anxious"
**JARVIS:** "I'm here. Want to talk it out or would a distraction help?"

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   Node.js API   │    │   Ollama LLM    │
│  (Frontend)     │◄──►│   (Backend)     │◄──►│ (145.118.6.53)  │
│  localhost:5173 │    │ localhost:3001  │    │    :11434       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │                       ▼
         │              ┌─────────────────┐
         │              │  Tool Executor  │
         │              │  (Apps, Web,    │
         │              │   Reminders)    │
         └──────────────┤                 │
                        └─────────────────┘
```

## JARVIS Personality

JARVIS is designed to be:
- **Emotionally intelligent** and warm
- **Proactive** and helpful
- **Human-like** in conversation
- **Action-capable** via tools
- **Never robotic** - no "As an AI..." responses

## Future Features

-  Text-to-speech responses
-  System monitoring
-  Privacy-focused file access
-  Web scraping capabilities

## Configuration

### Ollama Setup
Ensure your Ollama server is running:
```bash
ollama serve
ollama pull llama3.2:latest
```



