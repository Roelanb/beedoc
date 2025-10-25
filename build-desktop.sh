#!/bin/bash

# BeeDoc Desktop Build Script
# This script builds the desktop application by:
# 1. Building the web version to dist/
# 2. Starting a local server
# 3. Running Pake to package from the server
# 4. Stopping the server

set -e

echo "🐝 Building BeeDoc Desktop Application..."

# Step 1: Build web version
echo "📦 Step 1: Building web version..."
pnpm run build:web

# Step 2: Start local server in background
echo "🌐 Step 2: Starting local server on port 8081..."
cd dist
python3 -m http.server 8081 > /dev/null 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 2

# Check if server is running
if ! curl -s http://127.0.0.1:8081 > /dev/null; then
    echo "❌ Error: Server failed to start"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Server running at http://127.0.0.1:8081"

# Step 3: Build with Pake
echo "🔨 Step 3: Building desktop application with Pake..."
pake http://127.0.0.1:8081 --name BeeDoc --version 0.1.1 --icon assets/icon.png --width 1200 --height 800

# Step 4: Stop server
echo "🛑 Step 4: Stopping local server..."
kill $SERVER_PID 2>/dev/null || true

# Move .deb to root if it exists
if [ -f "beedoc.deb" ]; then
    echo "✅ Build complete! Package: beedoc.deb"
else
    echo "⚠️  Package may be in a different location"
    find . -name "beedoc*.deb" -type f
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "To install:"
echo "  sudo dpkg -i beedoc.deb"
echo ""
echo "To run:"
echo "  pake-beedoc"
