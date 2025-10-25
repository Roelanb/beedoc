# Changelog

All notable changes to BeeDoc will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2024-10-25

### 🎉 Initial Release

First public release of BeeDoc - a modern WYSIWYG markdown editor with D3.js visual enhancements.

### ✨ Added

#### Core Editor
- WYSIWYG markdown editing with ContentEditable API
- Real-time visual feedback while typing
- Smart paste handling (plain text only)
- Undo/Redo support (Ctrl+Z, Ctrl+Y)
- Word and character count in status bar
- Modified file indicator

#### Text Formatting
- **Bold** formatting (Ctrl+B, `**text**`)
- *Italic* formatting (Ctrl+I, `*text*`)
- ~~Strikethrough~~ formatting (Ctrl+U, `~~text~~`)
- `Inline code` formatting (Ctrl+E, `` `text` ``)
- Format toggle (apply/remove with same shortcut)

#### Document Structure
- Headings H1-H6 (Alt+1 through Alt+6)
- Unordered lists with automatic continuation
- Ordered lists with auto-incrementing numbers
- Blockquotes with styled rendering
- Horizontal rules
- Smart Enter key handling in lists

#### Advanced Features
- Hyperlinks with Ctrl+K shortcut
- Image embedding with URL
- Tables (3x3 default, expandable)
- Task lists with interactive checkboxes
- Code blocks with automatic line numbers

#### File Operations
- New file creation (Ctrl+N)
- Open markdown files (Ctrl+O)
- Save files (Ctrl+S)
- Export to HTML with embedded styles
- Export to PDF (via browser print)
- File System Access API with fallback
- Unsaved changes warning

#### User Interface
- Modern, clean toolbar with grouped buttons
- Status bar with file name, word count, character count
- Comprehensive help panel with all shortcuts (press ?)
- Responsive design for different screen sizes
- Tooltips on all toolbar buttons

#### Themes
- Light theme (default)
- Dark theme
- Theme toggle button
- Persistent theme preference (localStorage)
- Smooth theme transitions

#### D3.js Visual Enhancements
- Automatic element animations
  - Headings: Fade-in and hover slide effect
  - Blockquotes: Slide-in and border animation
  - Code blocks: Fade-in with line numbers
  - Tables: Fade-in and row hover effects
  - Horizontal rules: Expanding width animation
  - Lists: Staggered fade-in for items
- Animation toggle (✨ button)
- Persistent animation preference
- Reduced motion support for accessibility
- MutationObserver for automatic enhancement

#### Keyboard Shortcuts
- File: Ctrl+N, Ctrl+O, Ctrl+S
- Editing: Ctrl+Z, Ctrl+Y, Tab (4 spaces)
- Formatting: Ctrl+B, Ctrl+I, Ctrl+U, Ctrl+E
- Headings: Alt+1 through Alt+6
- Links: Ctrl+K
- Help: ? key
- Close: Escape

#### Desktop Application
- Linux .deb package (Ubuntu/Debian)
- Native file system integration
- Window size: 1200x800
- Built with Pake (Tauri-based)

#### Documentation
- Comprehensive USER_GUIDE.md (50+ pages)
- QUICK_START.md for new users
- INSTALLATION.md with platform-specific instructions
- FEATURES.md listing all capabilities
- TESTING.md with 200+ test cases
- PACKAGING.md for building desktop apps
- PHASE5_SUMMARY.md documenting D3.js integration

#### Testing
- Automated test suite (automated-tests.html)
- Manual test suite with 200+ test cases
- Performance testing documentation
- Browser compatibility testing
- Edge case handling

### 🎨 Design
- Professional typography with system fonts
- Consistent spacing and alignment
- Proper contrast ratios for accessibility
- Smooth transitions and animations
- Visual hierarchy with headings and borders

### ⚡ Performance
- Fast typing response (< 50ms latency)
- Smooth scrolling (60 FPS target)
- Efficient DOM updates
- Hardware-accelerated animations
- Optimized for documents up to 10,000 lines

### ♿ Accessibility
- Keyboard navigation support
- Focus indicators on all interactive elements
- Reduced motion support (`prefers-reduced-motion`)
- High contrast in both themes
- Screen reader compatible (basic)

### 🔧 Technical
- Vanilla JavaScript (no framework dependencies)
- D3.js v7.9.0 for visualizations
- marked.js v11.1.1 for markdown parsing
- ContentEditable API for editing
- File System Access API with fallback
- localStorage for preferences
- MutationObserver for DOM watching

### 📦 Build System
- pnpm for package management
- live-server for development
- Pake for desktop packaging
- Simple build scripts in package.json

### 🐛 Known Issues
- Footnotes not implemented
- Auto-save not implemented
- Syntax highlighting in code blocks not implemented
- Split-pane preview not available
- Find and replace not available
- Custom themes not available

### 📝 Notes
- First stable release
- Web version fully functional
- Linux desktop app tested on Ubuntu 24.04
- Windows desktop app build available but not tested
- All core features implemented and working

---

## [Unreleased]

### Planned Features
- Auto-save functionality
- Syntax highlighting in code blocks
- Split-pane markdown preview
- Find and replace
- Custom theme editor
- Plugin system
- Collaborative editing
- Cloud sync
- Mobile apps
- Browser extension

### Under Consideration
- Footnotes support
- Math equations (LaTeX)
- Diagrams (Mermaid.js)
- Spell checker
- Grammar checker
- Version history
- Templates
- Macros

---

## Version History

- **0.1.0** (2024-10-25) - Initial release

---

## Upgrade Guide

### From Web to Desktop
1. Export your documents to .md files
2. Install desktop application
3. Open files in desktop app
4. All features work the same

### Future Upgrades
Upgrade instructions will be provided with each new release.

---

## Breaking Changes

None in this release (first version).

---

## Deprecations

None in this release.

---

## Security

### Reporting Security Issues
Please report security vulnerabilities to security@beedoc.example.com

### Security Measures
- HTML sanitization to prevent XSS
- No server-side code (client-side only)
- No data collection or tracking
- Local file access only
- No external API calls (except CDN for libraries)

---

## Credits

### Libraries Used
- [D3.js](https://d3js.org/) - Data visualization
- [marked.js](https://marked.js.org/) - Markdown parsing
- [Pake](https://github.com/tw93/pake) - Desktop packaging

### Inspiration
- Typora - WYSIWYG markdown editing
- Bear - Beautiful note-taking
- iA Writer - Focused writing
- Obsidian - Knowledge management

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

**For detailed documentation, see:**
- [User Guide](docs/USER_GUIDE.md)
- [Quick Start](docs/QUICK_START.md)
- [Installation](docs/INSTALLATION.md)
- [Features](FEATURES.md)
