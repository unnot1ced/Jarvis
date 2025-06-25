# JARVIS – Local AI Assistant

A fully local JARVIS-inspired AI assistant built with React, Node.js, and Ollama.

## Features

- Warm and human: conversations inspired by JARVIS/Sesame
- Local AI using Ollama on your own network
- Voice input using the Web Speech API
- Tools via `#DO:` commands (launch apps, play music, reminders, etc.)
- Modern, responsive UI

## Installation

### Requirements

- Ollama running at `http://[your-ip]:11434` with the model `llama3.2:latest`
- Node.js v18 or higher
- npm or yarn

## Important note 
Please change all the [your ip] to your actual own ip where the server of ollama is hosted. Please read and look carefully through all files.

### Setup

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Backend runs at `http://localhost:3001`  
Frontend runs at `http://localhost:5173`

## Example Commands

```txt
#DO: openApp("Spotify")
#DO: remindUser("Stretch in 10 minutes")
#DO: getWeather("Amsterdam")
#DO: searchYouTube("lofi beats")
```

## Architecture

```
React (UI)      ⇄     Node.js (API)     ⇄     Ollama (LLM)
localhost:5173         localhost:3001          [your-ip]:11434
```

## JARVIS Personality

- Emotionally intelligent and people-focused
- Proactive and action-oriented
- Never generic “As an AI...” responses

## Future Features

- Text-to-speech
- System monitoring
- Local file access
- Web scraping

## Starting Ollama

```bash
ollama serve
ollama pull llama3.2:latest
```

**Note:** Replace `[your-ip]` in code and config with your actual IP address.
