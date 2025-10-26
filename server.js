// Simple file server for BeeDoc
const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const url = require('url');

const PORT = 8080;
const DOCS_PATH = path.join(__dirname, 'docs');

// Serve static files
async function serveStatic(res, filePath) {
    try {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        }[ext] || 'text/plain';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

// Read directory
async function readDirectory(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const items = [];

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const stats = await fs.stat(fullPath);

        items.push({
            name: entry.name,
            type: entry.isDirectory() ? 'directory' : 'file',
            path: fullPath,
            size: stats.size,
            modified: stats.mtime
        });
    }

    // Sort: directories first, then files
    items.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
    });

    return items;
}

// Read file content
async function readFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API endpoints
    if (pathname === '/api/browse') {
        try {
            const dirPath = parsedUrl.query.path || DOCS_PATH;
            const items = await readDirectory(dirPath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, path: dirPath, items }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (pathname === '/api/read-file') {
        try {
            const filePath = parsedUrl.query.path;
            if (!filePath) {
                throw new Error('No file path provided');
            }
            const content = await readFile(filePath);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, content, path: filePath }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: err.message }));
        }
        return;
    }

    if (pathname === '/api/default-path') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, path: DOCS_PATH }));
        return;
    }

    // Serve static files from src directory
    if (pathname === '/' || pathname === '/index.html') {
        await serveStatic(res, path.join(__dirname, 'src', 'index.html'));
    } else {
        await serveStatic(res, path.join(__dirname, 'src', pathname));
    }
});

server.listen(PORT, () => {
    console.log(`BeeDoc server running at http://localhost:${PORT}/`);
    console.log(`Default docs path: ${DOCS_PATH}`);
});
