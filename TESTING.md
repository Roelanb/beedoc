# BeeDoc Testing Guide

## Manual Testing Checklist

### Basic Editor Functionality
- [ ] Editor loads successfully
- [ ] Can type text in the editor
- [ ] Text appears with proper formatting
- [ ] Cursor position is correct
- [ ] Selection works properly

### Text Formatting
- [ ] **Bold** (Ctrl+B) - Select text and press Ctrl+B
- [ ] *Italic* (Ctrl+I) - Select text and press Ctrl+I
- [ ] ~~Strikethrough~~ (Ctrl+U) - Select text and press Ctrl+U
- [ ] `Inline code` (Ctrl+E) - Select text and press Ctrl+E
- [ ] Toggle formatting off by pressing shortcut again

### Headings
- [ ] H1 (Alt+1) - Convert line to heading 1
- [ ] H2 (Alt+2) - Convert line to heading 2
- [ ] H3 (Alt+3) - Convert line to heading 3
- [ ] H4-H6 (Alt+4-6) - Convert line to headings 4-6
- [ ] Headings display with proper styling

### Lists
- [ ] Unordered list - Click UL button
- [ ] Ordered list - Click OL button
- [ ] Press Enter to create new list item
- [ ] Press Enter on empty item to exit list
- [ ] Nested lists work properly

### Block Elements
- [ ] Blockquote - Click Quote button
- [ ] Code block - Click { } button
- [ ] Horizontal rule - Click HR button
- [ ] Each element renders correctly

### Advanced Features
- [ ] Insert link (Ctrl+K) - Prompts for URL
- [ ] Insert image - Prompts for URL and alt text
- [ ] Insert table - Creates 3x3 table
- [ ] Insert task list - Creates checkable items
- [ ] Task checkboxes are interactive

### File Operations
- [ ] New file (Ctrl+N) - Clears editor
- [ ] Open file (Ctrl+O) - Opens file picker
- [ ] Save file (Ctrl+S) - Saves current document
- [ ] Export HTML - Downloads HTML file
- [ ] Export PDF - Shows instructions
- [ ] File name updates in status bar

### Keyboard Shortcuts
- [ ] Ctrl+Z - Undo works
- [ ] Ctrl+Y - Redo works
- [ ] Ctrl+Shift+Z - Redo works
- [ ] Tab - Inserts 4 spaces
- [ ] ? - Opens help panel
- [ ] Escape - Closes help panel

### UI Components
- [ ] Toolbar buttons are clickable
- [ ] Toolbar buttons show tooltips on hover
- [ ] Status bar shows word count
- [ ] Status bar shows character count
- [ ] Status bar shows file name
- [ ] Modified indicator (*) appears when editing

### Theme
- [ ] Theme toggle button works
- [ ] Dark theme applies correctly
- [ ] Light theme applies correctly
- [ ] Theme preference is saved
- [ ] Theme persists after reload

### Help Panel
- [ ] Help button opens panel
- [ ] ? key opens panel
- [ ] Close button (×) closes panel
- [ ] Click outside closes panel
- [ ] Escape key closes panel
- [ ] All shortcuts are documented

### Markdown Conversion
- [ ] HTML to Markdown conversion works
- [ ] Markdown to HTML conversion works
- [ ] Tables convert properly
- [ ] Task lists convert properly
- [ ] All formatting is preserved

### Edge Cases
- [ ] Empty editor behaves correctly
- [ ] Very long documents (1000+ lines) work
- [ ] Special characters are handled
- [ ] Copy/paste works correctly
- [ ] Paste removes formatting (plain text only)

### Browser Compatibility
- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] File API works (or fallback works)

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Toolbar adapts to screen size

### Performance
- [ ] Typing is responsive (no lag)
- [ ] Scrolling is smooth
- [ ] Large documents don't freeze
- [ ] Memory usage is reasonable

### Error Handling
- [ ] Invalid file types are rejected
- [ ] File errors show user-friendly messages
- [ ] Unsaved changes warning works
- [ ] Ctrl+W warning works (if modified)

## Automated Testing (Future)

### Unit Tests
```javascript
// Example tests to implement
describe('MarkdownEditor', () => {
  test('toggleFormat applies bold', () => {
    // Test bold formatting
  });
  
  test('insertHeading creates heading', () => {
    // Test heading insertion
  });
  
  test('htmlToMarkdown converts correctly', () => {
    // Test conversion
  });
});
```

### Integration Tests
```javascript
describe('File Operations', () => {
  test('save and load cycle preserves content', () => {
    // Test save/load
  });
  
  test('export HTML generates valid HTML', () => {
    // Test export
  });
});
```

## Test Scenarios

### Scenario 1: Create a Document
1. Launch BeeDoc
2. Type a heading: "My Document"
3. Press Alt+1 to make it H1
4. Type some paragraphs
5. Add a list
6. Insert a link
7. Save the file
8. Verify file is saved correctly

### Scenario 2: Edit Existing Document
1. Open an existing .md file
2. Make changes
3. Verify modified indicator appears
4. Save changes
5. Reload file
6. Verify changes persisted

### Scenario 3: Export Workflow
1. Create a formatted document
2. Export to HTML
3. Open HTML in browser
4. Verify formatting is preserved
5. Print to PDF from browser
6. Verify PDF looks correct

### Scenario 4: Keyboard Workflow
1. Use only keyboard (no mouse)
2. Create new file (Ctrl+N)
3. Type content
4. Apply formatting with shortcuts
5. Save file (Ctrl+S)
6. Open help (?)
7. Verify all shortcuts work

### Scenario 5: Theme Switching
1. Start in light theme
2. Create some content
3. Switch to dark theme
4. Verify content is still visible
5. Reload page
6. Verify theme persisted

## Bug Report Template

When reporting bugs, include:

```
**Description**: Brief description of the issue

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happens

**Environment**:
- Browser: Chrome 120 / Firefox 121 / Safari 17
- OS: Linux / Windows / macOS
- BeeDoc Version: 0.1.0

**Screenshots**: (if applicable)

**Console Errors**: (if any)
```

## Performance Benchmarks

Target performance metrics:

- **Typing latency**: < 50ms
- **Scroll performance**: 60 FPS
- **File open time**: < 1s for 10MB file
- **Memory usage**: < 200MB for typical documents
- **Startup time**: < 2s

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Screen reader compatibility (basic)
- [ ] High contrast mode works
- [ ] Text can be zoomed

## Security Testing

- [ ] XSS prevention (HTML sanitization)
- [ ] File path validation
- [ ] No arbitrary code execution
- [ ] Safe handling of user input

## Test Results

Document test results here:

| Date | Tester | Browser | Pass/Fail | Notes |
|------|--------|---------|-----------|-------|
| 2024-01-XX | Name | Chrome 120 | Pass | All features working |
| | | | | |

## Known Issues

Document any known issues here:

1. **Issue**: Description
   - **Severity**: Low/Medium/High
   - **Workaround**: If any
   - **Status**: Open/In Progress/Fixed

## Test Coverage

Current test coverage:
- Manual testing: ✅ Complete
- Unit tests: ❌ Not implemented
- Integration tests: ❌ Not implemented
- E2E tests: ❌ Not implemented

## Next Steps

1. Complete manual testing checklist
2. Fix any discovered bugs
3. Implement automated tests
4. Set up CI/CD pipeline
5. Regular regression testing
