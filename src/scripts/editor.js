// Editor Core Functionality
class MarkdownEditor {
    constructor(editorElement) {
        this.editor = editorElement;
        this.content = '';
        this.currentFile = null;
        this.isModified = false;
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.editor.addEventListener('input', () => this.handleInput());
        this.editor.addEventListener('keydown', (e) => this.handleKeydown(e));
        this.editor.addEventListener('paste', (e) => this.handlePaste(e));
        this.editor.addEventListener('click', (e) => this.handleClick(e));

        // Initialize content
        this.updateContent();

        // Initialize currentFile property
        this.currentFile = null;

        // Ensure typing creates paragraphs
        this.ensureParagraphStructure();
    }
    
    handleInput() {
        this.isModified = true;

        // Ensure content is in paragraphs
        this.ensureParagraphStructure();

        this.updateContent();
        this.updateStatusBar();

        // Trigger D3 rendering enhancements
        if (window.d3Renderer) {
            // D3 renderer automatically observes changes via MutationObserver
            // No explicit call needed, but we can trigger specific effects here if needed
        }

        // Trigger AI suggestions
        if (window.aiAssistant) {
            window.aiAssistant.handleInput();
        }
    }
    
    handleKeydown(e) {
        // Help panel shortcut (? key without modifiers)
        if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (window.toolbar) {
                window.toolbar.toggleHelp();
            }
            return;
        }
        
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key.toLowerCase()) {
                case 'b':
                    e.preventDefault();
                    this.toggleFormat('bold');
                    break;
                case 'i':
                    e.preventDefault();
                    this.toggleFormat('italic');
                    break;
                case 'u':
                    e.preventDefault();
                    this.toggleFormat('strikethrough');
                    break;
                case 'e':
                    if (e.shiftKey) {
                        e.preventDefault();
                        if (window.fileBrowser) {
                            window.fileBrowser.toggle();
                        }
                    } else {
                        e.preventDefault();
                        this.toggleFormat('code');
                    }
                    break;
                case 'k':
                    e.preventDefault();
                    this.insertLink();
                    break;
                case 's':
                    e.preventDefault();
                    if (window.fileOps) {
                        window.fileOps.saveFile();
                    }
                    break;
                case 'o':
                    e.preventDefault();
                    if (window.fileOps) {
                        window.fileOps.openFile();
                    }
                    break;
                case 'n':
                    e.preventDefault();
                    if (window.fileOps) {
                        window.fileOps.newFile();
                    }
                    break;
                case 'z':
                    if (e.shiftKey) {
                        e.preventDefault();
                        document.execCommand('redo');
                    } else {
                        e.preventDefault();
                        document.execCommand('undo');
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    document.execCommand('redo');
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                    if (e.altKey) {
                        e.preventDefault();
                        this.insertHeading(parseInt(e.key));
                    }
                    break;
            }
        }
        
        // Handle Tab key
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertText', false, '    ');
        }
        
        // Handle Enter key
        if (e.key === 'Enter') {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                let element = range.commonAncestorContainer;
                if (element.nodeType === Node.TEXT_NODE) {
                    element = element.parentElement;
                }

                // Check if we're in a list item
                let listItem = element;
                let inList = false;
                while (listItem && listItem !== this.editor) {
                    if (listItem.tagName === 'LI') {
                        inList = true;
                        // If list item is empty, exit the list
                        if (!listItem.textContent.trim()) {
                            e.preventDefault();
                            const list = listItem.parentElement;
                            listItem.remove();

                            const p = document.createElement('p');
                            p.innerHTML = '<br>';
                            list.parentNode.insertBefore(p, list.nextSibling);

                            range.setStart(p, 0);
                            range.collapse(true);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                        break;
                    }
                    listItem = listItem.parentElement;
                }

                // For regular paragraphs and other elements, insert a line break instead of creating new paragraph
                if (!inList) {
                    e.preventDefault();

                    // Insert a <br> tag at cursor position
                    const br = document.createElement('br');
                    range.deleteContents();
                    range.insertNode(br);

                    // Move cursor after the <br>
                    range.setStartAfter(br);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);

                    // Trigger input event to ensure content is updated
                    this.handleInput();
                }
            }
        }
    }
    
    handlePaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    }

    handleClick(e) {
        // Check if clicked directly on the editor (not on a child element)
        if (e.target !== this.editor) {
            return;
        }

        // Get click position
        const rect = this.editor.getBoundingClientRect();
        const clickY = e.clientY - rect.top;

        // Find the best insertion point based on click Y position
        let insertAfter = null;
        let insertBefore = null;

        const children = Array.from(this.editor.children);

        if (children.length === 0) {
            // Editor is completely empty, create first paragraph
            this.createParagraphAtPosition(null, 'first');
            return;
        }

        // Find which element was clicked near
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childRect = child.getBoundingClientRect();
            const childY = childRect.top - rect.top;
            const childHeight = childRect.height;

            // Clicked above this element
            if (clickY < childY) {
                insertBefore = child;
                break;
            }

            // Clicked below this element
            if (clickY > childY + childHeight) {
                insertAfter = child;
            }
        }

        // Determine where to insert
        if (insertBefore) {
            this.createParagraphAtPosition(insertBefore, 'before');
        } else if (insertAfter) {
            this.createParagraphAtPosition(insertAfter, 'after');
        }
    }

    createParagraphAtPosition(referenceElement, position) {
        // Create new paragraph
        const p = document.createElement('p');
        p.innerHTML = '<br>'; // Empty paragraph with line break

        // Insert the paragraph
        if (position === 'first' || !referenceElement) {
            this.editor.insertBefore(p, this.editor.firstChild);
        } else if (position === 'before') {
            this.editor.insertBefore(p, referenceElement);
        } else if (position === 'after') {
            if (referenceElement.nextSibling) {
                this.editor.insertBefore(p, referenceElement.nextSibling);
            } else {
                this.editor.appendChild(p);
            }
        }

        // Place cursor in the new paragraph
        const range = document.createRange();
        const selection = window.getSelection();

        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        // Focus the editor
        this.editor.focus();

        // Mark as modified
        this.isModified = true;
        this.updateContent();

        // The MutationObserver will automatically make it draggable
    }
    
    updateContent() {
        this.content = this.editor.innerHTML;
    }
    
    getMarkdown() {
        // Convert HTML content to markdown
        return this.htmlToMarkdown(this.editor.innerHTML);
    }
    
    setMarkdown(markdown) {
        // Convert markdown to HTML and set editor content
        if (window.marked) {
            this.editor.innerHTML = marked.parse(markdown);
        } else {
            this.editor.textContent = markdown;
        }
        this.updateContent();
        this.updateStatusBar();
    }
    
    htmlToMarkdown(html) {
        // Simple HTML to Markdown conversion
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        let markdown = '';
        this.processNode(temp, (text) => {
            markdown += text;
        });
        
        return markdown.trim();
    }
    
    processTable(table, callback) {
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) return;
        
        // Process header row
        const headerRow = rows[0];
        const headers = headerRow.querySelectorAll('th, td');
        callback('| ');
        headers.forEach((header, i) => {
            callback(header.textContent.trim());
            callback(' | ');
        });
        callback('\n');
        
        // Add separator row
        callback('| ');
        headers.forEach(() => {
            callback('--- | ');
        });
        callback('\n');
        
        // Process body rows
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td, th');
            callback('| ');
            cells.forEach((cell) => {
                callback(cell.textContent.trim());
                callback(' | ');
            });
            callback('\n');
        }
    }
    
    processNode(node, callback) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                callback(child.textContent);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.tagName.toLowerCase();
                
                switch(tag) {
                    case 'h1':
                        callback('\n# ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'h2':
                        callback('\n## ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'h3':
                        callback('\n### ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'h4':
                        callback('\n#### ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'h5':
                        callback('\n##### ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'h6':
                        callback('\n###### ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'p':
                        callback('\n');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'strong':
                    case 'b':
                        callback('**');
                        this.processNode(child, callback);
                        callback('**');
                        break;
                    case 'em':
                    case 'i':
                        callback('*');
                        this.processNode(child, callback);
                        callback('*');
                        break;
                    case 'del':
                    case 's':
                        callback('~~');
                        this.processNode(child, callback);
                        callback('~~');
                        break;
                    case 'code':
                        callback('`');
                        this.processNode(child, callback);
                        callback('`');
                        break;
                    case 'pre':
                        callback('\n```\n');
                        this.processNode(child, callback);
                        callback('\n```\n\n');
                        break;
                    case 'a':
                        callback('[');
                        this.processNode(child, callback);
                        callback(`](${child.getAttribute('href') || ''})`);
                        break;
                    case 'img':
                        callback(`![${child.getAttribute('alt') || ''}](${child.getAttribute('src') || ''})`);
                        break;
                    case 'ul':
                        callback('\n');
                        this.processNode(child, callback);
                        callback('\n');
                        break;
                    case 'ol':
                        callback('\n');
                        this.processNode(child, callback);
                        callback('\n');
                        break;
                    case 'li':
                        callback('- ');
                        this.processNode(child, callback);
                        callback('\n');
                        break;
                    case 'blockquote':
                        callback('\n> ');
                        this.processNode(child, callback);
                        callback('\n\n');
                        break;
                    case 'hr':
                        callback('\n---\n\n');
                        break;
                    case 'br':
                        callback('\n');
                        break;
                    case 'table':
                        callback('\n');
                        this.processTable(child, callback);
                        callback('\n');
                        break;
                    case 'input':
                        if (child.type === 'checkbox') {
                            callback(child.checked ? '[x] ' : '[ ] ');
                        }
                        break;
                    default:
                        this.processNode(child, callback);
                }
            }
        });
    }
    
    toggleFormat(format) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        if (!selectedText) return;
        
        // Check if selection is already formatted
        let parentElement = range.commonAncestorContainer;
        if (parentElement.nodeType === Node.TEXT_NODE) {
            parentElement = parentElement.parentElement;
        }
        
        const tagMap = {
            'bold': ['STRONG', 'B'],
            'italic': ['EM', 'I'],
            'strikethrough': ['DEL', 'S', 'STRIKE'],
            'code': ['CODE']
        };
        
        const tags = tagMap[format] || [];
        let formattedElement = null;
        
        // Check if already formatted
        let element = parentElement;
        while (element && element !== this.editor) {
            if (tags.includes(element.tagName)) {
                formattedElement = element;
                break;
            }
            element = element.parentElement;
        }
        
        if (formattedElement) {
            // Remove formatting
            const text = document.createTextNode(formattedElement.textContent);
            formattedElement.parentNode.replaceChild(text, formattedElement);
        } else {
            // Apply formatting
            try {
                let wrapper;
                switch(format) {
                    case 'bold':
                        wrapper = document.createElement('strong');
                        break;
                    case 'italic':
                        wrapper = document.createElement('em');
                        break;
                    case 'strikethrough':
                        wrapper = document.createElement('del');
                        break;
                    case 'code':
                        wrapper = document.createElement('code');
                        break;
                }
                
                if (wrapper) {
                    const contents = range.extractContents();
                    wrapper.appendChild(contents);
                    range.insertNode(wrapper);
                    
                    // Restore selection
                    range.selectNodeContents(wrapper);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } catch (e) {
                console.error('Error applying format:', e);
            }
        }
        
        this.handleInput();
    }
    
    insertHeading(level) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
        }
        
        // Find the block element to convert
        let blockElement = element;
        while (blockElement && blockElement !== this.editor) {
            const tag = blockElement.tagName;
            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV'].includes(tag)) {
                break;
            }
            blockElement = blockElement.parentElement;
        }
        
        if (blockElement && blockElement !== this.editor) {
            // Convert existing block to heading
            const heading = document.createElement(`h${level}`);
            heading.innerHTML = blockElement.innerHTML || 'Heading ' + level;
            blockElement.parentNode.replaceChild(heading, blockElement);
            
            // Place cursor at end of heading
            range.selectNodeContents(heading);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // Insert new heading
            const heading = document.createElement(`h${level}`);
            heading.textContent = 'Heading ' + level;
            
            range.deleteContents();
            range.insertNode(heading);
            
            // Move cursor inside heading
            range.selectNodeContents(heading);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        this.handleInput();
    }
    
    insertLink() {
        const url = prompt('Enter URL:');
        if (!url) return;
        
        const selection = window.getSelection();
        const selectedText = selection.toString() || 'Link';
        
        const link = document.createElement('a');
        link.href = url;
        link.textContent = selectedText;
        
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(link);
        
        this.handleInput();
    }
    
    insertImage() {
        const url = prompt('Enter image URL:');
        if (!url) return;
        
        const alt = prompt('Enter alt text (optional):') || 'Image';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(img);
        
        this.handleInput();
    }
    
    insertList(ordered = false) {
        const list = document.createElement(ordered ? 'ol' : 'ul');
        const li = document.createElement('li');
        li.textContent = 'List item';
        list.appendChild(li);
        
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(list);
        
        this.handleInput();
    }
    
    insertBlockquote() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        let element = range.commonAncestorContainer;
        
        if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
        }
        
        // Find the block element to convert
        let blockElement = element;
        while (blockElement && blockElement !== this.editor) {
            const tag = blockElement.tagName;
            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'DIV'].includes(tag)) {
                break;
            }
            blockElement = blockElement.parentElement;
        }
        
        if (blockElement && blockElement !== this.editor) {
            // Wrap existing block in blockquote
            const blockquote = document.createElement('blockquote');
            blockElement.parentNode.insertBefore(blockquote, blockElement);
            blockquote.appendChild(blockElement);
            
            // Place cursor at end
            range.selectNodeContents(blockElement);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        } else {
            // Insert new blockquote
            const blockquote = document.createElement('blockquote');
            const p = document.createElement('p');
            p.textContent = 'Quote';
            blockquote.appendChild(p);
            
            range.deleteContents();
            range.insertNode(blockquote);
            
            range.selectNodeContents(p);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        this.handleInput();
    }
    
    insertCodeBlock() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = selectedText || 'Code block';
        pre.appendChild(code);
        
        range.deleteContents();
        range.insertNode(pre);
        
        // Add a paragraph after the code block for continued editing
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        pre.parentNode.insertBefore(p, pre.nextSibling);
        
        // Place cursor in code block
        range.selectNodeContents(code);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.handleInput();
    }
    
    insertHorizontalRule() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        
        const hr = document.createElement('hr');
        range.deleteContents();
        range.insertNode(hr);
        
        // Add a paragraph after the HR for continued editing
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        hr.parentNode.insertBefore(p, hr.nextSibling);
        
        // Place cursor in the new paragraph
        range.setStart(p, 0);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        
        this.handleInput();
    }
    
    insertTable(rows = 3, cols = 3) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        
        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';
        table.style.marginBottom = '1em';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (let i = 0; i < cols; i++) {
            const th = document.createElement('th');
            th.textContent = `Header ${i + 1}`;
            th.style.border = '1px solid #ddd';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.style.backgroundColor = '#f4f4f4';
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body rows
        const tbody = document.createElement('tbody');
        for (let i = 0; i < rows - 1; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < cols; j++) {
                const td = document.createElement('td');
                td.textContent = `Cell ${i + 1},${j + 1}`;
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        
        range.deleteContents();
        range.insertNode(table);
        
        // Add a paragraph after the table
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        table.parentNode.insertBefore(p, table.nextSibling);
        
        // Place cursor in first cell
        const firstCell = table.querySelector('th');
        if (firstCell) {
            range.selectNodeContents(firstCell);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        this.handleInput();
    }
    
    insertTaskList() {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        
        const range = selection.getRangeAt(0);
        
        const ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.paddingLeft = '0';
        
        for (let i = 0; i < 3; i++) {
            const li = document.createElement('li');
            li.style.marginBottom = '0.5em';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '0.5em';
            checkbox.addEventListener('change', () => this.handleInput());
            
            const text = document.createTextNode(`Task ${i + 1}`);
            
            li.appendChild(checkbox);
            li.appendChild(text);
            ul.appendChild(li);
        }
        
        range.deleteContents();
        range.insertNode(ul);
        
        // Add a paragraph after the task list
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        ul.parentNode.insertBefore(p, ul.nextSibling);
        
        this.handleInput();
    }
    
    updateStatusBar() {
        const text = this.editor.textContent || '';
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const chars = text.length;
        
        const wordsEl = document.getElementById('status-words');
        const charsEl = document.getElementById('status-chars');
        
        if (wordsEl) wordsEl.textContent = `Words: ${words}`;
        if (charsEl) charsEl.textContent = `Characters: ${chars}`;
    }
    
    clear() {
        this.editor.innerHTML = '';
        this.currentFile = null;
        this.isModified = false;
        this.updateStatusBar();
    }

    setContent(content, isMarkdown = false) {
        // Clear current content
        this.clear();

        if (isMarkdown) {
            // If content is markdown, convert to HTML and set
            this.setMarkdown(content);
        } else {
            // If content is plain text, treat as markdown
            this.setMarkdown(content);
        }

        // Mark as not modified since we just loaded from file
        this.isModified = false;
    }

    ensureParagraphStructure() {
        // Get selection before making changes
        const selection = window.getSelection();
        let cursorNode = null;
        let cursorOffset = 0;

        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            cursorNode = range.startContainer;
            cursorOffset = range.startOffset;
        }

        // Check all direct children of the editor
        const children = Array.from(this.editor.childNodes);
        let madeChanges = false;

        children.forEach(child => {
            // If it's a text node directly in the editor, wrap it in a paragraph
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
                const p = document.createElement('p');
                p.textContent = child.textContent;
                this.editor.replaceChild(p, child);
                madeChanges = true;

                // Update cursor reference if it was in this text node
                if (child === cursorNode) {
                    cursorNode = p.firstChild || p;
                }
            }
            // If it's an element but not a block-level element, wrap it
            // Note: DIV is intentionally excluded - we want to wrap divs in paragraphs
            else if (child.nodeType === Node.ELEMENT_NODE) {
                const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'BLOCKQUOTE', 'PRE', 'TABLE', 'HR'];
                if (!blockTags.includes(child.tagName)) {
                    // Skip drag handles
                    if (child.classList && child.classList.contains('drag-handle')) {
                        return;
                    }

                    const p = document.createElement('p');
                    this.editor.replaceChild(p, child);
                    p.appendChild(child);
                    madeChanges = true;
                }
            }
        });

        // If editor is empty or only has <br>, create a paragraph
        if (this.editor.childNodes.length === 0 ||
            (this.editor.childNodes.length === 1 && this.editor.firstChild.nodeName === 'BR')) {
            const p = document.createElement('p');
            p.innerHTML = '<br>';
            this.editor.innerHTML = '';
            this.editor.appendChild(p);
            madeChanges = true;

            // Place cursor in the new paragraph
            const range = document.createRange();
            range.setStart(p, 0);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            return;
        }

        // Restore cursor position if changes were made
        if (madeChanges && cursorNode) {
            try {
                const range = document.createRange();

                // Find the cursor node in the updated DOM
                if (cursorNode.nodeType === Node.TEXT_NODE) {
                    range.setStart(cursorNode, Math.min(cursorOffset, cursorNode.length));
                } else {
                    range.setStart(cursorNode, 0);
                }

                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } catch (e) {
                // If cursor restoration fails, just place it at the end
                console.debug('Could not restore cursor:', e);
            }
        }
    }
}
