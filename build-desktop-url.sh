#!/bin/bash

# BeeDoc Desktop Build Script (URL-based)
# This script builds the desktop application by:
# 1. Building the web version to dist/
# 2. Starting a local server
# 3. Running Pake to package from the server
# 4. Stopping the server

set -e

# Generate build number from timestamp
BUILD_NUMBER=$(date +%Y%m%d%H%M)
VERSION="0.1.2"

echo "🐝 Building BeeDoc Desktop Application (URL-based)..."
echo "📋 Version: ${VERSION} Build: ${BUILD_NUMBER}"

# Step 1: Build web version
echo "📦 Step 1: Building web version..."
pnpm run build:web

# Step 2: Update title and version info
echo "🔖 Step 2: Adding build number to title and UI..."
sed -i "s/<title>BeeDoc - Markdown Editor<\/title>/<title>BeeDoc v${VERSION} (Build ${BUILD_NUMBER})<\/title>/" dist/index.html
sed -i "s/<div class=\"about-version\">Version 0\.1\.1<\/div>/<div class=\"about-version\">Version ${VERSION} (Build ${BUILD_NUMBER})<\/div>/" dist/index.html
# Add version to status bar
sed -i "s/<span id=\"status-file\">Untitled.md<\/span>/<span id=\"status-file\">Untitled.md<\/span>\n            <\/div>\n            <div class=\"status-item\">\n                <span style=\"color: #888; font-size: 0.85em;\">v${VERSION} b${BUILD_NUMBER}<\/span>/" dist/index.html

# Step 3: Start local server in background
echo "🌐 Step 3: Starting local server on port 8081..."
cd dist
python3 -m http.server 8081 > /dev/null 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Check if server is running
if ! curl -s http://127.0.0.1:8081 > /dev/null; then
    echo "❌ Error: Server failed to start"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Server running at http://127.0.0.1:8081"

# Step 4: Build with Pake using URL
echo "🔨 Step 4: Building desktop application with Pake..."
pake http://127.0.0.1:8081 --name BeeDoc --title "BeeDoc v${VERSION} (Build ${BUILD_NUMBER})" --version ${VERSION} --icon assets/icon.png --width 1200 --height 800

# Step 5: Stop server
echo "🛑 Step 5: Stopping local server..."
kill $SERVER_PID 2>/dev/null || true

# Wait a moment for cleanup
sleep 1

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
