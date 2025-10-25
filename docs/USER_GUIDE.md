# BeeDoc User Guide

**Version**: 0.1.0  
**Last Updated**: October 25, 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Basic Editing](#basic-editing)
4. [Text Formatting](#text-formatting)
5. [Document Structure](#document-structure)
6. [Advanced Features](#advanced-features)
7. [File Operations](#file-operations)
8. [Customization](#customization)
9. [Keyboard Shortcuts](#keyboard-shortcuts)
10. [Tips & Tricks](#tips--tricks)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

### What is BeeDoc?

BeeDoc is a modern WYSIWYG (What You See Is What You Get) markdown editor that combines the simplicity of markdown with the visual feedback of a rich text editor. It features:

- **Real-time Visual Editing**: See your formatting as you type
- **Full Markdown Support**: All standard markdown features
- **Beautiful Animations**: Smooth D3.js-powered visual effects
- **Dark Mode**: Easy on the eyes
- **Export Options**: HTML and PDF (via print)
- **Keyboard-First**: Extensive keyboard shortcuts

### Who is it for?

- Writers and bloggers
- Developers writing documentation
- Students taking notes
- Anyone who loves markdown

---

## Getting Started

### Launching BeeDoc

#### Web Version
1. Open your browser
2. Navigate to the BeeDoc URL
3. Start typing!

#### Desktop Version (Linux)
```bash
# Install the .deb package
sudo dpkg -i beedoc_1.0.0_amd64.deb

# Launch
beedoc
```

#### Desktop Version (Windows)
1. Double-click `BeeDoc.exe`
2. Start editing

### First Steps

When you first open BeeDoc, you'll see:
- **Toolbar** at the top with formatting buttons
- **Editor** in the center where you type
- **Status Bar** at the bottom showing word count

Try typing "Hello World" and press **Alt+1** to make it a heading!

---

## Basic Editing

### Typing Text

Simply click in the editor and start typing. BeeDoc works like any text editor:

- **Enter** creates a new paragraph
- **Backspace** deletes characters
- **Delete** removes forward
- **Arrow keys** move the cursor

### Selecting Text

- **Click and drag** to select
- **Double-click** to select a word
- **Triple-click** to select a paragraph
- **Ctrl+A** to select all

### Copy, Cut, Paste

- **Ctrl+C**: Copy selected text
- **Ctrl+X**: Cut selected text
- **Ctrl+V**: Paste text (formatting removed)

### Undo and Redo

- **Ctrl+Z**: Undo last action
- **Ctrl+Y** or **Ctrl+Shift+Z**: Redo

---

## Text Formatting

### Bold

Make text **bold** for emphasis.

**Methods**:
1. Select text and press **Ctrl+B**
2. Click the **B** button in toolbar
3. Type `**text**` in markdown

**Example**:
```
This is **bold text**
```

### Italic

Make text *italic* for subtle emphasis.

**Methods**:
1. Select text and press **Ctrl+I**
2. Click the **I** button in toolbar
3. Type `*text*` in markdown

**Example**:
```
This is *italic text*
```

### Strikethrough

~~Cross out~~ text.

**Methods**:
1. Select text and press **Ctrl+U**
2. Click the **S** button in toolbar
3. Type `~~text~~` in markdown

**Example**:
```
This is ~~strikethrough text~~
```

### Inline Code

Format text as `code`.

**Methods**:
1. Select text and press **Ctrl+E**
2. Click the **Code** button in toolbar
3. Type `` `text` `` in markdown

**Example**:
```
Use `console.log()` to print
```

### Combining Formats

You can combine formats:
- ***Bold and italic***: `***text***`
- **Bold with `code`**: `**bold `code`**`

---

## Document Structure

### Headings

Create hierarchical structure with headings.

**Levels**: H1 (largest) through H6 (smallest)

**Methods**:
- **Alt+1** through **Alt+6** for H1-H6
- Click **H1**, **H2**, or **H3** buttons
- Type `#` through `######` in markdown

**Examples**:
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

**Visual Styling**:
- H1 and H2 have bottom borders
- Font size decreases from H1 to H6
- Proper spacing for readability

### Lists

#### Unordered Lists

Create bullet-point lists.

**Methods**:
1. Click **UL** button
2. Type `- ` or `* ` at start of line

**Example**:
```markdown
- First item
- Second item
- Third item
```

**Tips**:
- Press **Enter** to create new item
- Press **Enter** on empty item to exit list

#### Ordered Lists

Create numbered lists.

**Methods**:
1. Click **OL** button
2. Type `1. ` at start of line

**Example**:
```markdown
1. First step
2. Second step
3. Third step
```

**Tips**:
- Numbers auto-increment
- Press **Enter** for new item
- Press **Enter** on empty item to exit

### Blockquotes

Create quoted or highlighted sections.

**Methods**:
1. Click **Quote** button
2. Type `> ` at start of line

**Example**:
```markdown
> This is a blockquote.
> It can span multiple lines.
```

**Visual Styling**:
- Left border in accent color
- Italic text
- Subtle background

### Horizontal Rules

Create visual separators.

**Methods**:
1. Click **HR** button
2. Type `---` on a line

**Example**:
```markdown
Section 1

---

Section 2
```

---

## Advanced Features

### Links

Create clickable hyperlinks.

**Method**:
1. Select text
2. Press **Ctrl+K**
3. Enter URL
4. Click OK

**Markdown Syntax**:
```markdown
[Link Text](https://example.com)
```

**Example**:
```markdown
Visit [Google](https://google.com) for search.
```

### Images

Embed images from URLs.

**Method**:
1. Click **Image** button
2. Enter image URL
3. Enter alt text (description)
4. Click OK

**Markdown Syntax**:
```markdown
![Alt Text](https://example.com/image.png)
```

**Example**:
```markdown
![Logo](https://example.com/logo.png)
```

### Code Blocks

Create multi-line code sections.

**Method**:
1. Click **{ }** button
2. Type code

**Markdown Syntax**:
````markdown
```
function hello() {
  console.log("Hello!");
}
```
````

**Features**:
- Monospace font
- Syntax preservation
- Line numbers (automatic)
- Scroll for long code

### Tables

Create structured data tables.

**Method**:
1. Click **Table** button
2. Edit cells

**Markdown Syntax**:
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

**Features**:
- Headers with background
- Borders on all cells
- Hover effects on rows
- Editable content

### Task Lists

Create interactive checklists.

**Method**:
1. Click **☑** button
2. Add tasks

**Markdown Syntax**:
```markdown
- [ ] Unchecked task
- [x] Checked task
```

**Features**:
- Clickable checkboxes
- Strikethrough when checked
- Perfect for todos

---

## File Operations

### Creating a New File

**Method**: Press **Ctrl+N** or click **New** button

**Behavior**:
- Prompts to save if current file is modified
- Clears editor
- Resets to "Untitled.md"

### Opening a File

**Method**: Press **Ctrl+O** or click **Open** button

**Supported Formats**:
- `.md` (Markdown)
- `.markdown`
- `.txt` (plain text)

**Process**:
1. File picker opens
2. Select file
3. Content loads
4. File name shows in status bar

### Saving a File

**Method**: Press **Ctrl+S** or click **Save** button

**First Save**:
1. Prompts for file name
2. Choose location
3. File saves

**Subsequent Saves**:
- Updates existing file
- No prompt needed
- Modified indicator (*) clears

**Tips**:
- Save frequently (Ctrl+S)
- File name shows in status bar
- Asterisk (*) indicates unsaved changes

### Exporting

#### Export to HTML

**Method**: Click **HTML** button

**Output**:
- Standalone HTML file
- Embedded CSS styles
- Ready to open in browser
- All formatting preserved

**Use Cases**:
- Share with non-markdown users
- Publish to web
- Archive formatted version

#### Export to PDF

**Method**: Click **PDF** button

**Process**:
1. Export to HTML first
2. Open HTML in browser
3. Press **Ctrl+P** (Print)
4. Choose "Save as PDF"
5. Save PDF

**Alternative**: Use browser's print-to-PDF feature directly

---

## Customization

### Themes

BeeDoc includes light and dark themes.

**Toggle Theme**:
- Click **Theme** button in toolbar
- Switches between light and dark

**Light Theme**:
- White background
- Dark text
- High contrast
- Default theme

**Dark Theme**:
- Dark gray background
- Light text
- Reduced eye strain
- Great for night work

**Persistence**: Your theme choice is saved and restored on next launch.

### Animations

BeeDoc features smooth D3.js animations.

**Toggle Animations**:
- Click **✨** button in toolbar
- Active = animations on
- Inactive = animations off

**Animation Effects**:
- Headings fade in
- Blockquotes slide in
- Tables animate
- Lists stagger
- Smooth hover effects

**Performance**: Disable animations on slower devices for better performance.

**Accessibility**: Respects system "reduce motion" preference.

---

## Keyboard Shortcuts

### File Operations
| Shortcut | Action |
|----------|--------|
| Ctrl+N | New file |
| Ctrl+O | Open file |
| Ctrl+S | Save file |

### Editing
| Shortcut | Action |
|----------|--------|
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+Shift+Z | Redo (alternative) |
| Tab | Insert 4 spaces |
| Ctrl+A | Select all |

### Text Formatting
| Shortcut | Action |
|----------|--------|
| Ctrl+B | Bold |
| Ctrl+I | Italic |
| Ctrl+U | Strikethrough |
| Ctrl+E | Inline code |
| Ctrl+K | Insert link |

### Headings
| Shortcut | Action |
|----------|--------|
| Alt+1 | Heading 1 |
| Alt+2 | Heading 2 |
| Alt+3 | Heading 3 |
| Alt+4 | Heading 4 |
| Alt+5 | Heading 5 |
| Alt+6 | Heading 6 |

### Other
| Shortcut | Action |
|----------|--------|
| ? | Show keyboard shortcuts |
| Escape | Close help panel |

**Tip**: Press **?** anytime to see all shortcuts!

---

## Tips & Tricks

### Productivity Tips

1. **Learn Keyboard Shortcuts**: Much faster than clicking buttons
2. **Use Headings**: Structure your document for easy navigation
3. **Save Often**: Ctrl+S becomes muscle memory
4. **Try Dark Mode**: Easier on eyes for long sessions
5. **Disable Animations**: If you prefer minimal distractions

### Writing Tips

1. **Start with Outline**: Use headings to plan structure
2. **Use Lists**: Break down complex ideas
3. **Add Links**: Reference sources inline
4. **Task Lists**: Track todos in your notes
5. **Code Blocks**: Document code snippets clearly

### Markdown Tips

1. **Blank Lines**: Separate paragraphs with blank lines
2. **Escaping**: Use `\` to escape special characters
3. **Nesting**: Lists and quotes can be nested
4. **Consistency**: Stick to one style (e.g., `*` vs `_` for italic)

---

## Troubleshooting

### Common Issues

#### Text Not Formatting

**Problem**: Formatting shortcuts don't work

**Solutions**:
- Select text first before applying format
- Check if cursor is in correct position
- Try using toolbar buttons instead
- Refresh page if issue persists

#### File Won't Save

**Problem**: Save operation fails

**Solutions**:
- Check file permissions
- Ensure valid file name
- Try "Save As" with new name
- Check available disk space

#### Animations Laggy

**Problem**: Animations are slow or choppy

**Solutions**:
- Disable animations (✨ button)
- Close other browser tabs
- Update browser to latest version
- Check system resources

#### Can't Open File

**Problem**: File picker doesn't open

**Solutions**:
- Check browser permissions
- Try different browser
- Use desktop version for full file access
- Check file format (.md or .markdown)

### Browser Compatibility

**Fully Supported**:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Partial Support**:
- Older browsers may lack File System Access API
- Fallback to download/upload works

### Getting Help

**Resources**:
- GitHub Issues: Report bugs
- Documentation: This guide
- README: Quick start info

---

## Appendix

### Markdown Cheat Sheet

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold**
*italic*
~~strikethrough~~
`code`

- Unordered list
- Item 2

1. Ordered list
2. Item 2

> Blockquote

[Link](url)
![Image](url)

---

```code block```

| Table | Header |
|-------|--------|
| Cell  | Cell   |

- [ ] Task
- [x] Done
```

### Glossary

- **Markdown**: Lightweight markup language
- **WYSIWYG**: What You See Is What You Get
- **D3.js**: Data visualization library
- **ContentEditable**: Browser editing API
- **Syntax**: Markdown formatting rules

---

**Need more help?** Check the README or open an issue on GitHub!
