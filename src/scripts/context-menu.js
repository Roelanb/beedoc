// Context Menu Manager for Editor
class ContextMenuManager {
    constructor(editorElement, editorInstance) {
        this.editor = editorElement;
        this.editorInstance = editorInstance;
        this.menuElement = null;
        this.isVisible = false;
        this.clickPosition = null;

        this.init();
    }

    init() {
        // Create the context menu element
        this.createMenuElement();

        // Listen for context menu events on the editor
        this.editor.addEventListener('contextmenu', (e) => this.handleContextMenu(e));

        // Close menu on clicks outside
        document.addEventListener('click', (e) => this.handleDocumentClick(e));

        // Close menu on scroll
        this.editor.addEventListener('scroll', () => this.hide());

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    createMenuElement() {
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'context-menu';
        this.menuElement.innerHTML = this.getMenuHTML();
        document.body.appendChild(this.menuElement);

        // Attach click handlers to menu items
        this.attachMenuItemHandlers();
    }

    getMenuHTML() {
        return `
            <div class="context-menu-group-label">Insert</div>
            <div class="context-menu-item" data-action="insert-paragraph">
                <span class="context-menu-icon">¶</span>
                <span class="context-menu-label">Paragraph</span>
                <span class="context-menu-shortcut">Enter</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="insert-heading-1">
                <span class="context-menu-icon">H1</span>
                <span class="context-menu-label">Heading 1</span>
                <span class="context-menu-shortcut">Alt+1</span>
            </div>
            <div class="context-menu-item" data-action="insert-heading-2">
                <span class="context-menu-icon">H2</span>
                <span class="context-menu-label">Heading 2</span>
                <span class="context-menu-shortcut">Alt+2</span>
            </div>
            <div class="context-menu-item" data-action="insert-heading-3">
                <span class="context-menu-icon">H3</span>
                <span class="context-menu-label">Heading 3</span>
                <span class="context-menu-shortcut">Alt+3</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="insert-bullet-list">
                <span class="context-menu-icon">•</span>
                <span class="context-menu-label">Bullet List</span>
            </div>
            <div class="context-menu-item" data-action="insert-numbered-list">
                <span class="context-menu-icon">1.</span>
                <span class="context-menu-label">Numbered List</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="insert-blockquote">
                <span class="context-menu-icon">"</span>
                <span class="context-menu-label">Quote</span>
            </div>
            <div class="context-menu-item" data-action="insert-code-block">
                <span class="context-menu-icon">&lt;/&gt;</span>
                <span class="context-menu-label">Code Block</span>
            </div>
            <div class="context-menu-item" data-action="insert-table">
                <span class="context-menu-icon">⊞</span>
                <span class="context-menu-label">Table</span>
            </div>
            <div class="context-menu-item" data-action="insert-horizontal-rule">
                <span class="context-menu-icon">─</span>
                <span class="context-menu-label">Horizontal Rule</span>
            </div>
        `;
    }

    attachMenuItemHandlers() {
        const items = this.menuElement.querySelectorAll('.context-menu-item');
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.getAttribute('data-action');
                if (action && !item.classList.contains('disabled')) {
                    this.handleMenuAction(action);
                    this.hide();
                }
            });
        });
    }

    handleContextMenu(e) {
        // Only show context menu when right-clicking on editor or its direct content
        // Don't show on toolbar, buttons, etc.
        let target = e.target;
        let isInEditor = false;

        while (target) {
            if (target === this.editor) {
                isInEditor = true;
                break;
            }
            if (target.classList && (
                target.classList.contains('toolbar') ||
                target.classList.contains('status-bar') ||
                target.tagName === 'BUTTON'
            )) {
                return; // Don't show context menu
            }
            target = target.parentElement;
        }

        if (!isInEditor) return;

        e.preventDefault();

        // Save the click position for inserting content
        this.clickPosition = {
            x: e.clientX,
            y: e.clientY,
            target: e.target
        };

        this.show(e.clientX, e.clientY);
    }

    show(x, y) {
        this.menuElement.classList.add('visible');
        this.isVisible = true;

        // Position the menu
        this.menuElement.style.left = x + 'px';
        this.menuElement.style.top = y + 'px';

        // Adjust position if menu goes off-screen
        this.adjustPosition();
    }

    adjustPosition() {
        const rect = this.menuElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = parseInt(this.menuElement.style.left);
        let top = parseInt(this.menuElement.style.top);

        // Adjust horizontal position
        if (rect.right > viewportWidth) {
            left = viewportWidth - rect.width - 10;
        }

        // Adjust vertical position
        if (rect.bottom > viewportHeight) {
            top = viewportHeight - rect.height - 10;
        }

        this.menuElement.style.left = Math.max(10, left) + 'px';
        this.menuElement.style.top = Math.max(10, top) + 'px';
    }

    hide() {
        this.menuElement.classList.remove('visible');
        this.isVisible = false;
    }

    handleDocumentClick(e) {
        if (this.isVisible && !this.menuElement.contains(e.target)) {
            this.hide();
        }
    }

    handleMenuAction(action) {
        // Restore focus to editor
        this.editor.focus();

        // Get the selection or create one at the click position
        const selection = window.getSelection();

        // If no selection, try to place cursor at click position
        if (selection.rangeCount === 0 || !this.isSelectionInEditor(selection)) {
            this.createSelectionAtClickPosition();
        }

        // Execute the action
        switch (action) {
            case 'insert-paragraph':
                this.insertParagraph();
                break;
            case 'insert-heading-1':
                this.editorInstance.insertHeading(1);
                break;
            case 'insert-heading-2':
                this.editorInstance.insertHeading(2);
                break;
            case 'insert-heading-3':
                this.editorInstance.insertHeading(3);
                break;
            case 'insert-bullet-list':
                this.editorInstance.insertList(false);
                break;
            case 'insert-numbered-list':
                this.editorInstance.insertList(true);
                break;
            case 'insert-blockquote':
                this.editorInstance.insertBlockquote();
                break;
            case 'insert-code-block':
                this.editorInstance.insertCodeBlock();
                break;
            case 'insert-table':
                this.editorInstance.insertTable(3, 3);
                break;
            case 'insert-horizontal-rule':
                this.editorInstance.insertHorizontalRule();
                break;
            default:
                console.warn('Unknown context menu action:', action);
        }

        // Trigger input event to update content
        this.editorInstance.handleInput();
    }

    insertParagraph() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Create new paragraph
        const p = document.createElement('p');
        p.innerHTML = '<br>';

        // Insert the paragraph
        range.deleteContents();
        range.insertNode(p);

        // Place cursor in the new paragraph
        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    createSelectionAtClickPosition() {
        if (!this.clickPosition) return;

        try {
            const range = document.createRange();
            const selection = window.getSelection();

            // Try to find a good insertion point
            let target = this.clickPosition.target;

            // If clicked on editor itself, find or create a paragraph
            if (target === this.editor) {
                const paragraphs = this.editor.querySelectorAll('p, h1, h2, h3, h4, h5, h6');
                if (paragraphs.length > 0) {
                    // Use the last paragraph
                    const lastP = paragraphs[paragraphs.length - 1];
                    range.setStart(lastP, lastP.childNodes.length);
                    range.collapse(true);
                } else {
                    // Create a new paragraph
                    const p = document.createElement('p');
                    p.innerHTML = '<br>';
                    this.editor.appendChild(p);
                    range.setStart(p, 0);
                    range.collapse(true);
                }
            } else {
                // Clicked on an element - try to place cursor there
                if (target.nodeType === Node.TEXT_NODE) {
                    range.setStart(target, 0);
                } else {
                    range.setStart(target, 0);
                }
                range.collapse(true);
            }

            selection.removeAllRanges();
            selection.addRange(range);
        } catch (e) {
            console.debug('Could not create selection at click position:', e);
        }
    }

    isSelectionInEditor(selection) {
        if (selection.rangeCount === 0) return false;

        const range = selection.getRangeAt(0);
        let node = range.commonAncestorContainer;

        while (node) {
            if (node === this.editor) return true;
            node = node.parentElement;
        }

        return false;
    }

    destroy() {
        if (this.menuElement && this.menuElement.parentNode) {
            this.menuElement.parentNode.removeChild(this.menuElement);
        }
        this.menuElement = null;
    }
}
