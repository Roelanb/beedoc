// Drag and Drop Functionality for Section Reordering
class DragDropManager {
    constructor(editorElement) {
        this.editor = editorElement;
        this.draggedElement = null;
        this.dropIndicator = null;
        this.enabled = true;
        this.eventHandlers = new WeakMap(); // Store bound event handlers

        this.init();
    }

    init() {
        // Create drop indicator element
        this.dropIndicator = document.createElement('div');
        this.dropIndicator.className = 'drop-indicator';
        this.dropIndicator.style.display = 'none';
        document.body.appendChild(this.dropIndicator);

        // Enable drag and drop for existing elements
        this.enableDragDropForAllSections();

        // Observe new elements being added
        this.setupMutationObserver();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && this.isDraggableSection(node)) {
                            this.makeDraggable(node);
                        }
                    });
                }
            });
        });

        observer.observe(this.editor, {
            childList: true,
            subtree: false // Only watch direct children
        });
    }

    isDraggableSection(element) {
        // Check if element is a section that should be draggable
        const draggableTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'BLOCKQUOTE', 'PRE', 'TABLE', 'HR'];
        return draggableTags.includes(element.tagName);
    }

    enableDragDropForAllSections() {
        const sections = this.editor.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, blockquote, pre, table, hr');
        sections.forEach(section => this.makeDraggable(section));
    }

    makeDraggable(element) {
        if (!this.enabled) return;

        // Skip if already has drag handle
        if (element.querySelector('.drag-handle')) return;

        // Add draggable attribute
        element.setAttribute('draggable', 'true');
        element.classList.add('draggable-section');

        // Create and add drag handle (non-contenteditable)
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        dragHandle.setAttribute('title', 'Drag to reorder');
        dragHandle.contentEditable = 'false'; // Critical: prevent editing
        dragHandle.setAttribute('data-drag-handle', 'true'); // Marker for identification

        // Insert drag handle as first child
        element.insertBefore(dragHandle, element.firstChild);

        // Prevent drag handle from being editable
        dragHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); // Don't interfere with contenteditable
        });

        // Create bound handlers if they don't exist
        if (!this.eventHandlers.has(element)) {
            this.eventHandlers.set(element, {
                dragStart: this.handleDragStart.bind(this),
                dragEnd: this.handleDragEnd.bind(this),
                dragOver: this.handleDragOver.bind(this),
                dragLeave: this.handleDragLeave.bind(this),
                drop: this.handleDrop.bind(this)
            });
        }

        const handlers = this.eventHandlers.get(element);

        // Remove existing listeners to avoid duplicates
        element.removeEventListener('dragstart', handlers.dragStart);
        element.removeEventListener('dragend', handlers.dragEnd);
        element.removeEventListener('dragover', handlers.dragOver);
        element.removeEventListener('dragleave', handlers.dragLeave);
        element.removeEventListener('drop', handlers.drop);

        // Add drag event listeners
        element.addEventListener('dragstart', handlers.dragStart);
        element.addEventListener('dragend', handlers.dragEnd);
        element.addEventListener('dragover', handlers.dragOver);
        element.addEventListener('dragleave', handlers.dragLeave);
        element.addEventListener('drop', handlers.drop);
    }

    handleDragStart(e) {
        if (!this.enabled) return;

        // Find the draggable section (in case the drag started on a child element)
        let element = e.target;
        while (element && !element.classList.contains('draggable-section')) {
            element = element.parentElement;
            if (element === this.editor) return; // Went too far up
        }

        if (!element) return;

        this.draggedElement = element;
        this.draggedElement.classList.add('dragging');

        // Set drag data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', ''); // Need something for Firefox

        // Make element semi-transparent while dragging
        setTimeout(() => {
            if (this.draggedElement) {
                this.draggedElement.style.opacity = '0.4';
            }
        }, 0);
    }

    handleDragEnd(e) {
        if (!this.enabled) return;

        // Reset opacity
        if (this.draggedElement) {
            this.draggedElement.style.opacity = '';
            this.draggedElement.classList.remove('dragging');
        }

        // Hide drop indicator
        this.hideDropIndicator();

        // Remove all drag-over classes
        const sections = this.editor.querySelectorAll('.drag-over');
        sections.forEach(section => section.classList.remove('drag-over'));

        // Clear dragged element reference
        this.draggedElement = null;

        // Trigger editor update
        if (window.editor) {
            window.editor.handleInput();
        }
    }

    handleDragOver(e) {
        if (!this.enabled || !this.draggedElement) return;

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // Find the target draggable section
        let targetElement = e.target;
        while (targetElement && !targetElement.classList.contains('draggable-section')) {
            targetElement = targetElement.parentElement;
            if (targetElement === this.editor) {
                // If we're over the editor but not over any section, check if we should
                // show indicator above/below nearby sections
                this.handleEditorDragOver(e);
                return;
            }
        }

        if (!targetElement || targetElement === this.draggedElement) {
            return;
        }

        // Determine if we should insert before or after
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const insertBefore = e.clientY < midpoint;

        // Show drop indicator
        this.showDropIndicator(targetElement, insertBefore);

        // Add visual feedback
        targetElement.classList.add('drag-over');
    }

    handleEditorDragOver(e) {
        // When dragging over empty space in the editor, find the closest section
        const sections = Array.from(this.editor.querySelectorAll('.draggable-section'));
        if (sections.length === 0) return;

        const mouseY = e.clientY;
        let closestSection = null;
        let closestDistance = Infinity;
        let insertBefore = false;

        sections.forEach(section => {
            if (section === this.draggedElement) return;

            const rect = section.getBoundingClientRect();
            const distanceToTop = Math.abs(mouseY - rect.top);
            const distanceToBottom = Math.abs(mouseY - rect.bottom);

            if (distanceToTop < closestDistance) {
                closestDistance = distanceToTop;
                closestSection = section;
                insertBefore = true;
            }
            if (distanceToBottom < closestDistance) {
                closestDistance = distanceToBottom;
                closestSection = section;
                insertBefore = false;
            }
        });

        if (closestSection) {
            this.showDropIndicator(closestSection, insertBefore);
        }
    }

    handleDragLeave(e) {
        if (!this.enabled) return;

        // Find the target draggable section
        let targetElement = e.target;
        while (targetElement && !targetElement.classList.contains('draggable-section')) {
            targetElement = targetElement.parentElement;
            if (targetElement === this.editor) return;
        }

        if (targetElement) {
            targetElement.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        if (!this.enabled || !this.draggedElement) return;

        e.preventDefault();
        e.stopPropagation();

        // Find the target draggable section
        let targetElement = e.target;
        while (targetElement && !targetElement.classList.contains('draggable-section')) {
            targetElement = targetElement.parentElement;
            if (targetElement === this.editor) {
                // Dropped on editor background - find closest section
                this.handleEditorDrop(e);
                return;
            }
        }

        if (!targetElement || targetElement === this.draggedElement) {
            return;
        }

        // Determine drop position
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        const insertBefore = e.clientY < midpoint;

        // Perform the move
        if (insertBefore) {
            targetElement.parentNode.insertBefore(this.draggedElement, targetElement);
        } else {
            targetElement.parentNode.insertBefore(this.draggedElement, targetElement.nextSibling);
        }

        // Remove drag-over class
        targetElement.classList.remove('drag-over');

        // The element already has its event listeners, no need to re-add them
    }

    handleEditorDrop(e) {
        // When dropped on editor background, find the closest section
        const sections = Array.from(this.editor.querySelectorAll('.draggable-section'));
        if (sections.length === 0) return;

        const mouseY = e.clientY;
        let closestSection = null;
        let closestDistance = Infinity;
        let insertBefore = false;

        sections.forEach(section => {
            if (section === this.draggedElement) return;

            const rect = section.getBoundingClientRect();
            const distanceToTop = Math.abs(mouseY - rect.top);
            const distanceToBottom = Math.abs(mouseY - rect.bottom);

            if (distanceToTop < closestDistance) {
                closestDistance = distanceToTop;
                closestSection = section;
                insertBefore = true;
            }
            if (distanceToBottom < closestDistance) {
                closestDistance = distanceToBottom;
                closestSection = section;
                insertBefore = false;
            }
        });

        if (closestSection) {
            // Perform the move
            if (insertBefore) {
                closestSection.parentNode.insertBefore(this.draggedElement, closestSection);
            } else {
                closestSection.parentNode.insertBefore(this.draggedElement, closestSection.nextSibling);
            }
        }
    }

    showDropIndicator(targetElement, insertBefore) {
        if (!this.dropIndicator) return;

        const rect = targetElement.getBoundingClientRect();

        this.dropIndicator.style.display = 'block';
        this.dropIndicator.style.width = rect.width + 'px';
        this.dropIndicator.style.left = rect.left + 'px';

        if (insertBefore) {
            this.dropIndicator.style.top = rect.top + 'px';
        } else {
            this.dropIndicator.style.top = (rect.bottom - 2) + 'px';
        }
    }

    hideDropIndicator() {
        if (this.dropIndicator) {
            this.dropIndicator.style.display = 'none';
        }
    }

    enable() {
        this.enabled = true;
        this.enableDragDropForAllSections();
    }

    disable() {
        this.enabled = false;
        const sections = this.editor.querySelectorAll('.draggable-section');
        sections.forEach(section => {
            section.setAttribute('draggable', 'false');
            section.classList.remove('draggable-section');

            // Remove drag handle
            const dragHandle = section.querySelector('.drag-handle');
            if (dragHandle) {
                dragHandle.remove();
            }

            // Remove event listeners
            const handlers = this.eventHandlers.get(section);
            if (handlers) {
                section.removeEventListener('dragstart', handlers.dragStart);
                section.removeEventListener('dragend', handlers.dragEnd);
                section.removeEventListener('dragover', handlers.dragOver);
                section.removeEventListener('dragleave', handlers.dragLeave);
                section.removeEventListener('drop', handlers.drop);
            }
        });
    }

    toggle() {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.enabled;
    }

    destroy() {
        // Clean up
        this.disable();
        if (this.dropIndicator && this.dropIndicator.parentNode) {
            this.dropIndicator.parentNode.removeChild(this.dropIndicator);
        }
        this.dropIndicator = null;
        this.draggedElement = null;
        this.eventHandlers = null;
    }
}
