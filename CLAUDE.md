# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BeeDoc is a WYSIWYG markdown editor with D3.js rendering, packaged as a native desktop application for Linux and Windows. The application uses vanilla JavaScript with D3.js for dynamic DOM manipulation and visual enhancements.

## Tech Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no build tools or frameworks)
- **Rendering**: D3.js v7 for DOM manipulation and visual effects
- **Markdown Parser**: marked.js
- **Packaging**: Pake CLI for creating native desktop executables from the web app
- **Dev Server**: live-server for development

## Development Commands

### Development Server
```bash
npm run dev
# Starts live-server on http://localhost:8080
# Serves from src/ directory with hot reload
```

### Build Commands
```bash
# Build web version (copies src/ to dist/)
npm run build:web

# Build Linux desktop app (.AppImage or .deb)
npm run build:linux

# Build Windows desktop app (.exe)
npm run build:windows

# Start local server for dist/
npm run serve:dist
```

### Desktop Build Process
The desktop build requires Pake CLI to be installed globally (`npm install -g pake-cli`). The build process:
1. Builds web version to dist/
2. Starts local server on port 8081
3. Pake packages the served app into a native executable
4. Output is platform-specific executable in project root

See `build-desktop.sh` for the full build script and `PACKAGING.md` for detailed instructions.

## Application Architecture

### Core Components

The application follows a modular architecture with separate JavaScript classes:

1. **MarkdownEditor** (`src/scripts/editor.js`)
   - Manages contenteditable WYSIWYG editor
   - Handles keyboard shortcuts and text formatting
   - Converts between HTML and Markdown using marked.js
   - Maintains document state and modification tracking

2. **Toolbar** (`src/scripts/toolbar.js`)
   - UI controls for formatting and document operations
   - Event handlers for toolbar buttons
   - Help panel management
   - Theme toggling

3. **FileOperations** (`src/scripts/file-operations.js`)
   - File I/O using File System Access API (with fallback)
   - Save, open, new file operations
   - Export to HTML/PDF
   - Status bar updates for file information

4. **D3Renderer** (`src/scripts/d3-renderer.js`)
   - Visual enhancements using D3.js
   - MutationObserver for automatic DOM updates
   - Animations and transitions for headings, lists, tables, etc.
   - Can be toggled on/off via toolbar

5. **DragDropManager** (`src/scripts/drag-drop.js`)
   - Enables drag-and-drop reordering of document sections
   - Supports paragraphs, headings, lists, tables, blockquotes, code blocks, and horizontal rules
   - Visual feedback with drop indicators and hover effects
   - MutationObserver to automatically enable drag for new elements
   - Can be toggled on/off programmatically

6. **App** (`src/scripts/app.js`)
   - Application initialization and coordination
   - Global state management
   - Unsaved changes warnings

### Script Load Order

Scripts must load in this order (defined in `src/index.html`):
1. D3.js (CDN)
2. marked.js (CDN)
3. editor.js
4. toolbar.js
5. file-operations.js
6. d3-renderer.js
7. drag-drop.js
8. app.js (initializes all components)

### HTML to Markdown Conversion

The editor uses a custom `htmlToMarkdown()` method in `MarkdownEditor` class to convert the contenteditable HTML back to Markdown format. This is critical for:
- Saving files as .md
- Maintaining Markdown syntax
- Exporting content

### D3.js Integration

D3.js is used for visual enhancements, not for virtual DOM or complete rendering:
- Adds animations to new elements (fade-in, slide effects)
- Enhances headings, blockquotes, code blocks, tables, lists
- Uses MutationObserver to detect DOM changes automatically
- All enhancements are optional and can be toggled off

### Theme System

- Light/dark theme toggle stored in localStorage
- Theme class applied to `<body>`
- All styles in `src/styles/` use CSS variables for theming
- Theme preference persists across sessions

## File Structure

```
src/
├── index.html              # Main HTML (loads all scripts/styles)
├── scripts/
│   ├── app.js             # Application initialization
│   ├── editor.js          # Core editor logic
│   ├── toolbar.js         # Toolbar and UI controls
│   ├── file-operations.js # File I/O operations
│   ├── d3-renderer.js     # D3.js visual enhancements
│   └── drag-drop.js       # Drag-and-drop section reordering
└── styles/
    ├── main.css           # Global styles and theme variables
    ├── editor.css         # Editor-specific styles
    ├── toolbar.css        # Toolbar styles
    ├── help.css          # Help panel styles
    ├── d3-enhancements.css # D3.js animation styles
    └── drag-drop.css      # Drag-and-drop visual feedback
```

## Keyboard Shortcuts

The editor implements these keyboard shortcuts (see `editor.js` handleKeydown):
- `Ctrl+N/O/S` - File operations
- `Ctrl+B/I/U/E/K` - Text formatting (bold, italic, strikethrough, code, link)
- `Alt+1-6` - Headings
- `Ctrl+Z/Y` - Undo/redo
- `?` - Toggle help panel
- `Tab` - Insert 4 spaces

## Testing

Manual testing checklist is in `TESTING.md`. No automated tests are currently implemented. Testing should cover:
- Basic editor functionality
- All keyboard shortcuts
- File operations (new, open, save, export)
- Theme switching
- D3.js animations
- Browser compatibility

## Important Development Notes

1. **No Build Pipeline**: This is a vanilla JavaScript project. Changes to `src/` are immediately reflected when running `npm run dev`.

2. **ContentEditable Quirks**: The editor uses `contenteditable="true"`, which can have browser-specific behavior. Test thoroughly across browsers.

3. **File API Fallback**: File operations use modern File System Access API with download/upload fallbacks for unsupported browsers.

4. **Markdown Conversion**: The `htmlToMarkdown()` method is custom-built and may need updates for new Markdown features.

5. **D3.js is Optional**: The app works without D3 enhancements. Don't make core functionality depend on D3Renderer.

6. **Pake Requirements**: Desktop builds require Pake CLI and system dependencies (see `PACKAGING.md`). Linux builds need WebKit libraries.

7. **Global State**: Components communicate via global `window` object (`window.editor`, `window.toolbar`, `window.dragDropManager`, etc.). This is intentional for simplicity.

8. **Status Bar Updates**: Call `editor.updateStatusBar()` after any content changes to update word/character counts.

9. **Drag and Drop**: The DragDropManager automatically enables drag-and-drop for all block-level elements (headings, paragraphs, lists, tables, etc.). It uses MutationObserver to watch for new elements. To toggle: `window.dragDropManager.toggle()`.

10. **Auto-Paragraph Creation**: The editor automatically wraps typed text in `<p>` tags via `ensureParagraphStructure()`. This runs on every input event and ensures proper block-level structure. New paragraphs are immediately made draggable by the MutationObserver.

11. **Click to Create Paragraphs**: Clicking in empty areas of the editor creates a new paragraph at that position via `handleClick()`. The cursor is automatically placed in the new paragraph, and it's immediately draggable. This works for clicks above, below, or between existing elements.
