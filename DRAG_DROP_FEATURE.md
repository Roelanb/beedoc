# Drag and Drop Feature

## Overview

BeeDoc now supports drag-and-drop reordering of document sections. Users can click and drag any block-level element (paragraphs, headings, lists, tables, etc.) to reorder them within the document.

## Supported Elements

The following elements can be dragged and dropped:
- Paragraphs (`<p>`)
- Headings (H1-H6)
- Unordered lists (`<ul>`)
- Ordered lists (`<ol>`)
- Blockquotes
- Code blocks (`<pre>`)
- Tables
- Horizontal rules (`<hr>`)

## How It Works

### User Experience

1. **Visible Drag Handle**: Each draggable section has a permanent "⋮⋮" handle on the left side (40% opacity)
2. **Handle Highlight**: Hovering over the handle increases opacity to 100% and shows a light blue background
3. **Dragging**: Click and hold the handle to drag a section. The entire element becomes semi-transparent (40% opacity)
4. **Drop Indicator**: A blue animated line appears showing where the element will be dropped
5. **Drop**: Release to drop the element in its new position

### Visual Feedback

- **Drag Handle**: Always visible "⋮⋮" icon at 40% opacity on the left side of each section
- **Handle Hover**: Handle becomes 100% opacity with light blue background
- **Dragging**: Semi-transparent element (40% opacity) with grabbing cursor
- **Drop Target**: Blue glow around the target section
- **Drop Indicator**: Animated blue line showing exact insertion point
- **Spacing**: Sections have 30px left padding; lists have 70px to accommodate list markers
- **Dark Theme**: All colors and handle visibility adjust automatically for dark mode

## Implementation Details

### Architecture

The drag-and-drop functionality is implemented in `src/scripts/drag-drop.js` with the `DragDropManager` class:

```javascript
class DragDropManager {
    constructor(editorElement)
    init()
    setupMutationObserver()
    enableDragDropForAllSections()
    makeDraggable(element)
    handleDragStart(e)
    handleDragEnd(e)
    handleDragOver(e)
    handleDrop(e)
    enable()
    disable()
    toggle()
}
```

### Key Features

1. **Always-Visible Handles**: Permanent drag handles (⋮⋮) on every section for clear discoverability
2. **Automatic Detection**: Uses MutationObserver to automatically add handles to newly created elements
3. **Visual Feedback**: Custom CSS provides clear visual indicators during all drag states
4. **Smart Drop Zones**: Automatically detects whether to insert before or after the target element based on cursor position
5. **Cursor Restoration**: Attempts to restore cursor position after a move operation
6. **Toggle Support**: Can be enabled/disabled programmatically (handles are added/removed accordingly)

### CSS Styling

Styles are defined in `src/styles/drag-drop.css`:
- `.draggable-section`: Base class for all draggable elements (includes 30px left padding)
- `.drag-handle`: The always-visible handle element with flexbox centering
- `.dragging`: Applied to the element being dragged
- `.drag-over`: Applied to potential drop targets
- `.drop-indicator`: The animated line showing where element will drop

### Integration

The DragDropManager is initialized in `src/scripts/app.js`:

```javascript
if (typeof DragDropManager !== 'undefined') {
    dragDropManager = new DragDropManager(editorElement);
    console.log('Drag and drop initialized');
}
window.dragDropManager = dragDropManager;
```

## Usage

### For End Users

1. Look for the vertical dots (⋮⋮) on the left side of each section
2. Click and hold the drag handle
3. Drag the section to a new position
4. Release to drop

The drag handles are always visible for easy discovery. No special shortcuts or hidden features.

### For Developers

#### Enable/Disable Programmatically

```javascript
// Disable drag and drop
window.dragDropManager.disable();

// Enable drag and drop
window.dragDropManager.enable();

// Toggle drag and drop
window.dragDropManager.toggle();
```

#### Check Status

```javascript
const isEnabled = window.dragDropManager.enabled;
```

#### Manual Element Registration

Elements are automatically detected, but you can manually register them:

```javascript
const element = document.createElement('p');
element.textContent = 'New paragraph';
window.dragDropManager.makeDraggable(element);
```

## Browser Compatibility

The drag-and-drop feature uses the HTML5 Drag and Drop API, which is supported in:
- Chrome/Edge 4+
- Firefox 3.5+
- Safari 3.1+
- Opera 12+

No polyfills are required for modern browsers.

## Accessibility Considerations

1. **Keyboard Alternative**: Currently drag-and-drop is mouse/touch only. A future enhancement could add keyboard shortcuts for reordering (e.g., Alt+Up/Down)
2. **Visual Indicators**: The grab cursor and hover effects provide clear visual feedback
3. **Focus Support**: Elements show drag handles when focused, aiding keyboard navigation

## Performance

- **Lightweight**: Uses native browser drag-and-drop API
- **Efficient**: MutationObserver only watches direct children of the editor
- **No Lag**: Visual feedback is CSS-based for smooth animations
- **Memory Safe**: Proper cleanup in the `destroy()` method

## Known Limitations

1. **Nested Elements**: Only top-level sections can be dragged. List items within lists cannot be individually reordered (the entire list moves)
2. **Keyboard Support**: No keyboard-based reordering currently implemented
3. **Touch Support**: Works on touch devices but may not be as intuitive as on desktop
4. **Selection Loss**: Text selection is lost during drag operations (intentional to prevent interference)

## Future Enhancements

Potential improvements for future versions:
- Keyboard shortcuts for reordering (Alt+Up/Down)
- Touch gesture improvements
- Nested list item reordering
- Visual preview during drag
- Undo/redo integration for drag operations
- Animation when element is dropped

## Testing

To test the drag-and-drop feature:

1. Start the dev server: `npm run dev`
2. Open http://localhost:8080
3. Create a document with multiple sections (headings, paragraphs, lists)
4. Hover over any section to see the grab cursor
5. Click and drag to reorder
6. Verify the drop indicator shows correct position
7. Release to drop
8. Test in both light and dark themes
9. Test with different element types (tables, code blocks, etc.)

## Troubleshooting

### Elements Not Draggable

- Check browser console for errors
- Verify `DragDropManager` is initialized: `console.log(window.dragDropManager)`
- Check if drag-drop is enabled: `console.log(window.dragDropManager.enabled)`

### Visual Feedback Not Showing

- Ensure `drag-drop.css` is loaded
- Check browser dev tools for CSS conflicts
- Verify styles are not being overridden

### Drop Not Working

- Check browser console for JavaScript errors
- Verify element has `draggable="true"` attribute
- Ensure `handleDrop` event is not being prevented elsewhere

## Code References

- Implementation: `src/scripts/drag-drop.js`
- Styles: `src/styles/drag-drop.css`
- Initialization: `src/scripts/app.js:33-36`
- HTML Integration: `src/index.html:12,255`
