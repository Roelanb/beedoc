// Main Application
let editor;
let toolbar;
let fileOps;
let d3Renderer;
let dragDropManager;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const editorElement = document.getElementById('editor');

    if (!editorElement) {
        console.error('Editor element not found');
        return;
    }

    // Initialize editor
    editor = new MarkdownEditor(editorElement);

    // Initialize toolbar
    toolbar = new Toolbar(editor);

    // Initialize file operations
    fileOps = new FileOperations(editor);

    // Initialize D3.js renderer
    if (typeof D3Renderer !== 'undefined') {
        d3Renderer = new D3Renderer(editorElement);
        console.log('D3 renderer initialized');
    }

    // Initialize drag and drop manager
    if (typeof DragDropManager !== 'undefined') {
        dragDropManager = new DragDropManager(editorElement);
        console.log('Drag and drop initialized');
    }

    // Make globally accessible
    window.editor = editor;
    window.toolbar = toolbar;
    window.fileOps = fileOps;
    window.d3Renderer = d3Renderer;
    window.dragDropManager = dragDropManager;

    // Initial status bar update
    editor.updateStatusBar();

    console.log('BeeDoc initialized successfully');
});

// Handle beforeunload to warn about unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (editor && editor.isModified) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Prevent accidental navigation
window.addEventListener('keydown', (e) => {
    // Prevent Ctrl+W (close tab) if there are unsaved changes
    if ((e.ctrlKey || e.metaKey) && e.key === 'w' && editor && editor.isModified) {
        e.preventDefault();
        alert('You have unsaved changes. Please save before closing.');
    }
});
