# BeeDoc

A modern WYSIWYG markdown editor with D3.js rendering, packaged as a native desktop application for Linux and Windows.

## Features

- **WYSIWYG Editing**: Edit markdown directly with visual feedback
- **Drag and Drop**: Reorder document sections by dragging paragraphs, headings, lists, and more
- **D3.js Rendering**: Beautiful, dynamic rendering of markdown content
- **Native Desktop App**: Runs as a standalone executable on Linux and Windows
- **Full Markdown Support**: Headings, lists, links, images, code blocks, tables, and more
- **Modern UI**: Clean interface with light and dark themes

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Rendering**: D3.js for dynamic DOM manipulation
- **Markdown Parser**: marked.js
- **Packaging**: Pake for native executables

## Project Structure

```
BeeDoc/
├── src/              # Source files
│   ├── index.html    # Main HTML file
│   ├── styles/       # CSS files
│   ├── scripts/      # JavaScript files
│   └── lib/          # Third-party libraries
├── assets/           # Images, icons, fonts
├── dist/             # Build output
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BeeDoc
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will open at `http://localhost:8080`

## Building

### Web Version

```bash
npm run build
```

Output will be in the `dist/` folder.

### Desktop Executables

#### Linux

```bash
npm run build:linux
```

#### Windows

```bash
npm run build:windows
```

**Note**: Pake must be installed globally:
```bash
npm install -g pake-cli
```

## Usage

1. Launch the application
2. Start typing markdown in the editor
3. See real-time WYSIWYG rendering
4. Use the toolbar for quick formatting
5. Save/load markdown files using File menu

## Keyboard Shortcuts

### File Operations
- `Ctrl+N` - New File
- `Ctrl+O` - Open File
- `Ctrl+S` - Save File

### Text Formatting
- `Ctrl+B` - Bold
- `Ctrl+I` - Italic
- `Ctrl+U` - Strikethrough
- `Ctrl+E` - Inline Code
- `Ctrl+K` - Insert Link

### Headings
- `Alt+1` through `Alt+6` - Insert Heading 1-6

### Editing
- `Ctrl+Z` - Undo
- `Ctrl+Y` or `Ctrl+Shift+Z` - Redo
- `Tab` - Insert 4 spaces
- `?` - Show keyboard shortcuts help

For a complete list, press `?` in the application or click the Help button.

## Development Status

See [plan.md](plan.md) for detailed implementation progress.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Roadmap

- [x] Phase 1: Project Setup & Architecture
- [x] Phase 2: Core Editor Implementation
- [x] Phase 3: Editor Features (Formatting, Blocks, Advanced)
- [x] Phase 4: File Operations (Open, Save, Export)
- [x] Phase 5: UI/UX Enhancement (Themes, Help Panel)
- [ ] Phase 6: D3.js Advanced Integration
- [ ] Phase 7: Desktop Packaging with Pake
- [ ] Phase 8: Testing & QA
- [ ] Phase 9: Documentation & Deployment

**Current Status**: Web application fully functional. Ready for desktop packaging.

## Support

For issues and questions, please open an issue on GitHub.
