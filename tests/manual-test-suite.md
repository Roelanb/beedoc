# BeeDoc Manual Test Suite

**Version**: 0.1.0  
**Date**: October 25, 2024  
**Tester**: ___________  
**Platform**: [ ] Web [ ] Linux Desktop [ ] Windows Desktop

---

## Test Environment Setup

### Prerequisites
- [ ] Browser: Chrome/Firefox/Safari (latest version)
- [ ] Screen resolution: 1920x1080 or higher
- [ ] Internet connection (for CDN resources)
- [ ] Clean browser cache

### Launch Application
- [ ] Application loads without errors
- [ ] No console errors on startup
- [ ] All UI elements visible
- [ ] Toolbar displays correctly
- [ ] Status bar displays correctly

---

## 1. Basic Editor Functionality

### 1.1 Text Input
- [ ] Can type text in editor
- [ ] Cursor position updates correctly
- [ ] Text appears immediately
- [ ] No input lag
- [ ] Backspace/Delete work correctly

### 1.2 Selection
- [ ] Click and drag to select text
- [ ] Double-click selects word
- [ ] Triple-click selects paragraph
- [ ] Shift+Arrow keys extend selection
- [ ] Ctrl+A selects all

### 1.3 Copy/Paste
- [ ] Ctrl+C copies selected text
- [ ] Ctrl+V pastes text
- [ ] Ctrl+X cuts text
- [ ] Paste removes formatting (plain text only)
- [ ] Multiple paste operations work

---

## 2. Text Formatting

### 2.1 Bold
- [ ] Select text and press Ctrl+B → text becomes bold
- [ ] Click Bold button → text becomes bold
- [ ] Press Ctrl+B again → formatting removed
- [ ] Works with multiple selections
- [ ] Markdown syntax: `**text**`

### 2.2 Italic
- [ ] Select text and press Ctrl+I → text becomes italic
- [ ] Click Italic button → text becomes italic
- [ ] Press Ctrl+I again → formatting removed
- [ ] Works with multiple selections
- [ ] Markdown syntax: `*text*`

### 2.3 Strikethrough
- [ ] Select text and press Ctrl+U → text has strikethrough
- [ ] Click Strikethrough button → text has strikethrough
- [ ] Press Ctrl+U again → formatting removed
- [ ] Markdown syntax: `~~text~~`

### 2.4 Inline Code
- [ ] Select text and press Ctrl+E → text becomes code
- [ ] Click Code button → text becomes code
- [ ] Press Ctrl+E again → formatting removed
- [ ] Monospace font applied
- [ ] Markdown syntax: `` `text` ``

### 2.5 Combined Formatting
- [ ] Can apply bold + italic together
- [ ] Can apply bold + code together
- [ ] Formatting nests correctly
- [ ] Removing one format keeps others

---

## 3. Headings

### 3.1 Heading Levels
- [ ] Alt+1 creates H1
- [ ] Alt+2 creates H2
- [ ] Alt+3 creates H3
- [ ] Alt+4 creates H4
- [ ] Alt+5 creates H5
- [ ] Alt+6 creates H6

### 3.2 Heading Toolbar Buttons
- [ ] H1 button creates heading 1
- [ ] H2 button creates heading 2
- [ ] H3 button creates heading 3

### 3.3 Heading Styling
- [ ] H1 has bottom border
- [ ] H2 has bottom border
- [ ] Font sizes decrease H1→H6
- [ ] Proper spacing above/below

### 3.4 Heading Conversion
- [ ] Converts paragraph to heading
- [ ] Converts heading to different level
- [ ] Preserves text content

---

## 4. Lists

### 4.1 Unordered Lists
- [ ] Click UL button creates bullet list
- [ ] Press Enter creates new list item
- [ ] Press Enter on empty item exits list
- [ ] Bullets display correctly
- [ ] Proper indentation

### 4.2 Ordered Lists
- [ ] Click OL button creates numbered list
- [ ] Press Enter creates new list item
- [ ] Numbers increment automatically
- [ ] Press Enter on empty item exits list
- [ ] Proper indentation

### 4.3 List Editing
- [ ] Can add items in middle of list
- [ ] Can delete list items
- [ ] Numbers update automatically
- [ ] Can convert UL ↔ OL

---

## 5. Block Elements

### 5.1 Blockquotes
- [ ] Click Quote button creates blockquote
- [ ] Left border displays
- [ ] Background color applied
- [ ] Text is italic
- [ ] Can nest blockquotes

### 5.2 Code Blocks
- [ ] Click Code Block button creates code block
- [ ] Monospace font applied
- [ ] Background color applied
- [ ] Preserves whitespace
- [ ] Line numbers appear (if multi-line)

### 5.3 Horizontal Rules
- [ ] Click HR button creates horizontal rule
- [ ] Line displays across width
- [ ] Proper spacing above/below
- [ ] Expand animation plays (if animations on)

---

## 6. Advanced Features

### 6.1 Links
- [ ] Press Ctrl+K prompts for URL
- [ ] Enter URL and text
- [ ] Link displays in blue
- [ ] Link is underlined on hover
- [ ] Click link opens in new tab (if applicable)
- [ ] Markdown syntax: `[text](url)`

### 6.2 Images
- [ ] Click Image button prompts for URL
- [ ] Enter URL and alt text
- [ ] Image displays (if URL valid)
- [ ] Alt text shows on hover
- [ ] Markdown syntax: `![alt](url)`

### 6.3 Tables
- [ ] Click Table button creates 3x3 table
- [ ] Headers have background color
- [ ] Borders display correctly
- [ ] Can edit cell content
- [ ] Rows have hover effect

### 6.4 Task Lists
- [ ] Click Task List button creates checklist
- [ ] Checkboxes display
- [ ] Can check/uncheck boxes
- [ ] Checked items have strikethrough
- [ ] Markdown syntax: `- [ ]` and `- [x]`

---

## 7. File Operations

### 7.1 New File
- [ ] Press Ctrl+N prompts to save if modified
- [ ] Clears editor content
- [ ] Resets file name to "Untitled.md"
- [ ] Clears modified flag
- [ ] Status bar updates

### 7.2 Open File
- [ ] Press Ctrl+O opens file picker
- [ ] Can select .md or .markdown file
- [ ] File content loads correctly
- [ ] File name displays in status bar
- [ ] Markdown renders correctly

### 7.3 Save File
- [ ] Press Ctrl+S saves file
- [ ] First save prompts for file name
- [ ] Subsequent saves update existing file
- [ ] Modified flag (*) clears after save
- [ ] Success message displays

### 7.4 Export HTML
- [ ] Click HTML button exports file
- [ ] Downloads .html file
- [ ] HTML file opens in browser
- [ ] Formatting preserved
- [ ] Styles embedded

### 7.5 Export PDF
- [ ] Click PDF button shows instructions
- [ ] Instructions mention browser print
- [ ] Instructions are clear

---

## 8. Keyboard Shortcuts

### 8.1 File Shortcuts
- [ ] Ctrl+N - New file
- [ ] Ctrl+O - Open file
- [ ] Ctrl+S - Save file

### 8.2 Editing Shortcuts
- [ ] Ctrl+Z - Undo
- [ ] Ctrl+Y - Redo
- [ ] Ctrl+Shift+Z - Redo (alternative)
- [ ] Tab - Insert 4 spaces

### 8.3 Formatting Shortcuts
- [ ] Ctrl+B - Bold
- [ ] Ctrl+I - Italic
- [ ] Ctrl+U - Strikethrough
- [ ] Ctrl+E - Inline code
- [ ] Ctrl+K - Insert link

### 8.4 Heading Shortcuts
- [ ] Alt+1 - Heading 1
- [ ] Alt+2 - Heading 2
- [ ] Alt+3 - Heading 3
- [ ] Alt+4 - Heading 4
- [ ] Alt+5 - Heading 5
- [ ] Alt+6 - Heading 6

### 8.5 Other Shortcuts
- [ ] ? - Open help panel
- [ ] Escape - Close help panel

---

## 9. UI Components

### 9.1 Toolbar
- [ ] All buttons visible
- [ ] Buttons have tooltips
- [ ] Hover effects work
- [ ] Active state shows correctly
- [ ] Groups separated by dividers
- [ ] Responsive on smaller screens

### 9.2 Status Bar
- [ ] File name displays
- [ ] Word count updates live
- [ ] Character count updates live
- [ ] Modified indicator (*) appears/disappears
- [ ] All items aligned correctly

### 9.3 Help Panel
- [ ] Opens with ? key
- [ ] Opens with Help button
- [ ] Displays all shortcuts
- [ ] Organized by category
- [ ] Close button works
- [ ] Click outside closes
- [ ] Escape key closes

---

## 10. Themes

### 10.1 Light Theme
- [ ] Default theme is light
- [ ] White background
- [ ] Dark text
- [ ] Good contrast
- [ ] All elements visible

### 10.2 Dark Theme
- [ ] Click Theme button switches to dark
- [ ] Dark background
- [ ] Light text
- [ ] Good contrast
- [ ] All elements visible

### 10.3 Theme Persistence
- [ ] Theme preference saves
- [ ] Reload page keeps theme
- [ ] Works after browser restart

---

## 11. D3.js Animations

### 11.1 Animation Toggle
- [ ] ✨ button toggles animations
- [ ] Active state shows when on
- [ ] Inactive state shows when off
- [ ] Preference saves to localStorage

### 11.2 Element Animations
- [ ] Headings fade in
- [ ] Headings slide on hover
- [ ] Blockquotes slide in
- [ ] Blockquote border animates on hover
- [ ] Code blocks fade in
- [ ] Tables fade in
- [ ] Table rows highlight on hover
- [ ] HR expands from left
- [ ] List items stagger in

### 11.3 Performance
- [ ] Animations are smooth (60fps)
- [ ] No lag during typing
- [ ] No memory leaks
- [ ] Can disable animations

---

## 12. Edge Cases

### 12.1 Empty States
- [ ] Empty editor shows placeholder
- [ ] Empty file saves correctly
- [ ] Empty selection doesn't crash

### 12.2 Large Documents
- [ ] 1000+ lines load correctly
- [ ] Scrolling is smooth
- [ ] No performance degradation
- [ ] Save/load works

### 12.3 Special Characters
- [ ] Unicode characters display
- [ ] Emojis display correctly
- [ ] HTML entities escaped
- [ ] No XSS vulnerabilities

### 12.4 Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## 13. Error Handling

### 13.1 File Errors
- [ ] Invalid file shows error
- [ ] Large file shows warning
- [ ] Network error handled gracefully

### 13.2 User Errors
- [ ] Invalid URL shows message
- [ ] Unsaved changes warning works
- [ ] Error messages are clear

---

## 14. Accessibility

### 14.1 Keyboard Navigation
- [ ] Can navigate with Tab
- [ ] Focus indicators visible
- [ ] All features keyboard accessible

### 14.2 Reduced Motion
- [ ] Respects prefers-reduced-motion
- [ ] Animations minimal when set
- [ ] Still functional without animations

---

## Test Results Summary

### Pass/Fail Count
- **Total Tests**: _____ / 200+
- **Passed**: _____
- **Failed**: _____
- **Skipped**: _____

### Critical Issues Found
1. ___________________________
2. ___________________________
3. ___________________________

### Minor Issues Found
1. ___________________________
2. ___________________________
3. ___________________________

### Performance Notes
- Load time: _____ seconds
- Memory usage: _____ MB
- Typing latency: _____ ms

### Overall Assessment
[ ] Ready for release
[ ] Needs minor fixes
[ ] Needs major fixes

### Tester Notes
_________________________________
_________________________________
_________________________________

---

**Test Completed**: ___________  
**Signature**: ___________
