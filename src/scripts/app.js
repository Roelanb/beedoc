// Main Application
let editor;
let toolbar;
let fileOps;
let aiAssistant;
let d3Renderer;
let dragDropManager;
let contextMenuManager;
let fileBrowser;

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const editorElement = document.getElementById('editor');

    if (!editorElement) {
        console.error('Editor element not found');
        return;
    }

    // Initialize editor
    editor = new MarkdownEditor(editorElement);

    // Initialize file operations (before toolbar so it's available)
    fileOps = new FileOperations(editor);
    window.fileOps = fileOps; // Make globally accessible immediately

    // Initialize toolbar
    toolbar = new Toolbar(editor);

    // Initialize AI Assistant
    if (typeof AIAssistant !== 'undefined') {
        aiAssistant = new AIAssistant(editor);
        window.aiAssistant = aiAssistant;
        console.log('AI Assistant initialized');
    }

    // Initialize D3.js renderer
    if (typeof D3Renderer !== 'undefined') {
        d3Renderer = new D3Renderer(editorElement);
        window.d3Renderer = d3Renderer; // Make globally accessible immediately
        console.log('D3 renderer initialized');
    }

    // Initialize drag and drop manager
    if (typeof DragDropManager !== 'undefined') {
        dragDropManager = new DragDropManager(editorElement);
        window.dragDropManager = dragDropManager; // Make globally accessible immediately
        console.log('Drag and drop initialized');
    }

    // Initialize context menu manager
    if (typeof ContextMenuManager !== 'undefined') {
        contextMenuManager = new ContextMenuManager(editorElement, editor);
        window.contextMenuManager = contextMenuManager; // Make globally accessible immediately
        console.log('Context menu initialized');
    }

    // Initialize file browser (only if server API is available)
    if (typeof FileBrowser !== 'undefined') {
        // Check if we're running with a backend server
        fetch('/api/default-path')
            .then(response => response.json())
            .then(() => {
                fileBrowser = new FileBrowser(fileOps);
                window.fileBrowser = fileBrowser;
                console.log('File browser initialized');
            })
            .catch(() => {
                console.log('Running in standalone mode - file browser disabled');
                // Hide file browser toggle button and adjust layout
                const toggleBtn = document.getElementById('btn-toggle-browser');
                if (toggleBtn) {
                    toggleBtn.style.display = 'none';
                }

                // Remove file browser margin from editor
                const editorEl = document.getElementById('editor');
                if (editorEl) {
                    editorEl.style.marginLeft = '0';
                    editorEl.style.width = '100%';
                }
            });
    }

    // Make globally accessible (editor and toolbar)
    window.editor = editor;
    window.toolbar = toolbar;

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
