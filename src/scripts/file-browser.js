// Simplified File Browser
class FileBrowser {
    constructor(fileOpsInstance) {
        this.fileOps = fileOpsInstance;
        this.browserElement = null;
        this.currentPath = '';
        this.isVisible = true;
        this.expandedFolders = new Set();

        this.init();
    }

    async init() {
        // Create the file browser element
        this.createBrowserElement();

        // Get default path and load directory
        try {
            const response = await fetch('/api/default-path');
            const data = await response.json();
            if (data.success) {
                this.currentPath = data.path;
                await this.loadDirectory(this.currentPath);
            }
        } catch (err) {
            console.error('Error loading default path:', err);
            this.showError('Unable to load file browser');
        }
    }

    createBrowserElement() {
        this.browserElement = document.createElement('div');
        this.browserElement.className = 'file-browser';
        this.browserElement.innerHTML = `
            <div class="file-browser-header">
                <span class="file-browser-title">Files</span>
                <button class="file-browser-close" title="Close File Browser">×</button>
            </div>
            <div class="file-browser-actions">
                <button class="file-browser-action-btn" id="fb-refresh" title="Refresh">↻</button>
                <button class="file-browser-action-btn" id="fb-select-folder" title="Select Folder">📁 Select</button>
            </div>
            <div class="file-browser-path"></div>
            <div class="file-browser-content">
                <div class="file-browser-loading">Loading...</div>
            </div>
        `;

        document.body.appendChild(this.browserElement);

        // Attach event listeners
        this.browserElement.querySelector('.file-browser-close').addEventListener('click', () => this.toggle());
        this.browserElement.querySelector('#fb-refresh').addEventListener('click', () => this.refresh());
        this.browserElement.querySelector('#fb-select-folder').addEventListener('click', () => this.selectFolder());
    }

    async selectFolder() {
        const newPath = prompt('Enter folder path:', this.currentPath);
        if (newPath && newPath !== this.currentPath) {
            await this.loadDirectory(newPath);
        }
    }

    async loadDirectory(dirPath, targetElement = null) {
        const content = targetElement || this.browserElement.querySelector('.file-browser-content');
        content.innerHTML = '<div class="file-browser-loading">Loading...</div>';

        try {
            const response = await fetch(`/api/browse?path=${encodeURIComponent(dirPath)}`);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error);
            }

            this.currentPath = data.path;
            this.updatePathDisplay();

            let html = '';
            for (const item of data.items) {
                if (item.type === 'directory') {
                    html += this.renderFolder(item);
                } else if (item.name.endsWith('.md') || item.name.endsWith('.markdown')) {
                    html += this.renderFile(item);
                }
            }

            if (html === '') {
                content.innerHTML = '<div class="file-browser-empty">No markdown files found</div>';
            } else {
                content.innerHTML = html;
            }

            // Attach click handlers
            this.attachItemHandlers();

        } catch (err) {
            console.error('Error loading directory:', err);
            this.showError('Error loading directory: ' + err.message);
        }
    }

    renderFolder(item) {
        const isExpanded = this.expandedFolders.has(item.path);
        return `
            <div class="folder-item ${isExpanded ? 'expanded' : ''}" data-path="${this.escapeHtml(item.path)}">
                <span class="folder-item-icon ${isExpanded ? 'folder-open' : 'folder'}"></span>
                <span class="folder-item-name">${this.escapeHtml(item.name)}</span>
            </div>
            <div class="folder-content" data-folder="${this.escapeHtml(item.path)}" style="display: ${isExpanded ? 'block' : 'none'}"></div>
        `;
    }

    renderFile(item) {
        return `
            <div class="file-item" data-path="${this.escapeHtml(item.path)}">
                <span class="file-item-icon markdown"></span>
                <span class="file-item-name">${this.escapeHtml(item.name)}</span>
            </div>
        `;
    }

    attachItemHandlers(container = null) {
        const searchContainer = container || this.browserElement;
        const folderItems = searchContainer.querySelectorAll('.folder-item');
        const fileItems = searchContainer.querySelectorAll('.file-item');

        folderItems.forEach(item => {
            // Remove existing listener if any (by cloning)
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            newItem.addEventListener('click', async (e) => {
                e.stopPropagation();
                const folderPath = newItem.getAttribute('data-path');
                await this.toggleFolder(newItem, folderPath);
            });
        });

        fileItems.forEach(item => {
            // Remove existing listener if any (by cloning)
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);

            newItem.addEventListener('click', async (e) => {
                e.stopPropagation();
                const filePath = newItem.getAttribute('data-path');
                console.log('File clicked:', filePath);
                await this.openFile(filePath);
            });
        });
    }

    async toggleFolder(folderElement, folderPath) {
        const isExpanded = folderElement.classList.contains('expanded');
        const folderContent = folderElement.nextElementSibling;

        if (isExpanded) {
            // Collapse
            folderElement.classList.remove('expanded');
            const icon = folderElement.querySelector('.folder-item-icon');
            icon.classList.remove('folder-open');
            icon.classList.add('folder');
            folderContent.style.display = 'none';
            this.expandedFolders.delete(folderPath);
        } else {
            // Expand
            folderElement.classList.add('expanded');
            const icon = folderElement.querySelector('.folder-item-icon');
            icon.classList.remove('folder');
            icon.classList.add('folder-open');
            folderContent.style.display = 'block';
            this.expandedFolders.add(folderPath);

            // Load folder contents
            if (folderContent && folderContent.classList.contains('folder-content')) {
                await this.loadDirectory(folderPath, folderContent);
            }
        }
    }

    async openFile(filePath) {
        console.log('Opening file:', filePath);
        try {
            const response = await fetch(`/api/read-file?path=${encodeURIComponent(filePath)}`);
            console.log('Response status:', response.status);

            const data = await response.json();
            console.log('Response data:', data);

            if (!data.success) {
                throw new Error(data.error);
            }

            // Update editor with file content
            if (window.editor) {
                console.log('Setting editor content, length:', data.content.length);
                window.editor.setContent(data.content, true);
                window.editor.currentFilePath = filePath;
                window.editor.isModified = false;
                window.editor.updateStatusBar();

                // Update window title
                const fileName = filePath.split('/').pop();
                document.title = `${fileName} - BeeDoc`;

                // Highlight the file
                this.highlightFile(filePath);
                console.log('File opened successfully');
            } else {
                console.error('window.editor not found!');
            }
        } catch (err) {
            console.error('Error opening file:', err);
            alert('Error opening file: ' + err.message);
        }
    }

    highlightFile(filePath) {
        // Remove previous highlights
        const previousActive = this.browserElement.querySelectorAll('.file-item.active');
        previousActive.forEach(item => item.classList.remove('active'));

        // Add highlight to current file
        const fileItems = this.browserElement.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            if (item.getAttribute('data-path') === filePath) {
                item.classList.add('active');
            }
        });
    }

    updatePathDisplay() {
        const pathElement = this.browserElement.querySelector('.file-browser-path');
        pathElement.textContent = this.currentPath;
    }

    async refresh() {
        if (this.currentPath) {
            await this.loadDirectory(this.currentPath);
        }
    }

    toggle() {
        this.isVisible = !this.isVisible;
        this.browserElement.classList.toggle('hidden', !this.isVisible);

        // Update editor margin
        const editor = document.getElementById('editor');
        if (editor) {
            if (this.isVisible) {
                const width = 280; // Fixed width
                editor.style.marginLeft = width + 'px';
                editor.style.width = `calc(100% - ${width}px)`;
            } else {
                editor.style.marginLeft = '0';
                editor.style.width = '100%';
            }
        }

        return this.isVisible;
    }

    show() {
        if (!this.isVisible) {
            this.toggle();
        }
    }

    hide() {
        if (this.isVisible) {
            this.toggle();
        }
    }

    showError(message) {
        const content = this.browserElement.querySelector('.file-browser-content');
        content.innerHTML = `<div class="file-browser-error">${this.escapeHtml(message)}</div>`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    destroy() {
        if (this.browserElement && this.browserElement.parentNode) {
            this.browserElement.parentNode.removeChild(this.browserElement);
        }
        this.browserElement = null;
    }
}
