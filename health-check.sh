
echo "🏥 JARVIS System Health Check"
echo "=============================="

echo "🧠 Checking Ollama server..."
if curl -s "http://[your ip]:11434/api/tags" > /dev/null; then
    echo "✅ Ollama server: ONLINE"
    
    if curl -s "http://[your ip]:11434/api/tags" | grep -q "llama3.2:latest"; then
        echo "✅ llama3.2:latest model: AVAILABLE"
    else
        echo "❌ llama3.2:latest model: NOT FOUND"
        echo "   Run: ollama pull llama3.2:latest"
    fi
else
    echo "❌ Ollama server: OFFLINE"
    echo "   Please start Ollama on [your ip]:11434"
fi

echo ""
echo "🔧 Checking backend server..."
if curl -s "http://localhost:3001/api/health" > /dev/null; then
    echo "✅ Backend server: ONLINE"
else
    echo "❌ Backend server: OFFLINE"
    echo "   Run: cd backend && npm run dev"
fi

# Check frontend
echo ""
echo "🎨 Checking frontend server..."
if curl -s "http://localhost:5173" > /dev/null; then
    echo "✅ Frontend server: ONLINE"
else
    echo "❌ Frontend server: OFFLINE"
    echo "   Run: cd frontend && npm run dev"
fi

echo ""
echo "📦 Checking dependencies..."
if [ -d "node_modules" ] && [ -d "backend/node_modules" ] && [ -d "frontend/node_modules" ]; then
    echo "✅ Dependencies: INSTALLED"
else
    echo "❌ Dependencies: MISSING"
    echo "   Run: npm run install-all"
fi

echo ""
echo "=============================="
if curl -s "http://[your ip]:11434/api/tags" > /dev/null && \
   curl -s "http://localhost:3001/api/health" > /dev/null && \
   curl -s "http://localhost:5173" > /dev/null; then
    echo "🎉 JARVIS is FULLY OPERATIONAL!"
    echo "🚀 Open http://localhost:5173 to start chatting"
else
    echo "⚠️  Some services are not running"
    echo "📋 Follow the instructions above to fix issues"
fi
