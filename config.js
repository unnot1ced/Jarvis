export const config = {
  ollama: {
    host: '[your ip]',
    port: 11434,
    model: 'llama3.2:latest'
  },

  server: {
    port: 3001,
    cors: true
  },

  frontend: {
    port: 5173,
    title: 'JARVIS - AI Assistant'
  },

  personality: {
    name: 'JARVIS',
    voice: 'warm and intelligent',
    responseStyle: 'conversational',
    useEmojis: true
  },

  tools: {
    openApp: true,
    searchYouTube: true,
    webSearch: true,
    getWeather: true,
    remindUser: true,
    playMusic: true,
    setTimer: true
  },

  features: {
    voiceInput: true,
    voiceOutput: false, 
    webSocketSupport: true,
    toolExecution: true
  }
};

export default config;
