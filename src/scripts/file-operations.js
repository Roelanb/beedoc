// File Operations
class FileOperations {
    constructor(editor) {
        this.editor = editor;
        this.currentFileName = 'Untitled.md';
        this.fileHandle = null;
    }
    
    async newFile() {
        if (this.editor.isModified) {
            const confirm = window.confirm('You have unsaved changes. Create new file anyway?');
            if (!confirm) return;
        }
        
        this.editor.clear();
        this.currentFileName = 'Untitled.md';
        this.fileHandle = null;
        this.updateFileName();
    }
    
    async openFile() {
        try {
            // Try using File System Access API (modern browsers)
            if ('showOpenFilePicker' in window) {
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Markdown Files',
                        accept: { 'text/markdown': ['.md', '.markdown'] }
                    }],
                    multiple: false
                });
                
                this.fileHandle = handle;
                const file = await handle.getFile();
                const content = await file.text();
                
                this.editor.setMarkdown(content);
                this.currentFileName = file.name;
                this.editor.isModified = false;
                this.updateFileName();
            } else {
                // Fallback for older browsers
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.md,.markdown';
                
                input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const content = await file.text();
                        this.editor.setMarkdown(content);
                        this.currentFileName = file.name;
                        this.editor.isModified = false;
                        this.updateFileName();
                    }
                };
                
                input.click();
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error opening file:', err);
                alert('Failed to open file');
            }
        }
    }
    
    async saveFile() {
        try {
            const markdown = this.editor.getMarkdown();
            
            // Try using File System Access API
            if ('showSaveFilePicker' in window) {
                if (!this.fileHandle) {
                    this.fileHandle = await window.showSaveFilePicker({
                        suggestedName: this.currentFileName,
                        types: [{
                            description: 'Markdown Files',
                            accept: { 'text/markdown': ['.md', '.markdown'] }
                        }]
                    });
                }
                
                const writable = await this.fileHandle.createWritable();
                await writable.write(markdown);
                await writable.close();
                
                this.currentFileName = this.fileHandle.name;
                this.editor.isModified = false;
                this.updateFileName();
                
                // Show success message briefly
                this.showMessage('File saved successfully');
            } else {
                // Fallback: download file
                this.downloadFile(markdown, this.currentFileName);
                this.editor.isModified = false;
                this.showMessage('File downloaded');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error saving file:', err);
                alert('Failed to save file');
            }
        }
    }
    
    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    updateFileName() {
        const fileNameEl = document.getElementById('status-file');
        if (fileNameEl) {
            fileNameEl.textContent = this.currentFileName + (this.editor.isModified ? ' *' : '');
        }
    }
    
    async exportHTML() {
        try {
            const markdown = this.editor.getMarkdown();
            
            // Convert markdown to HTML
            let html = '';
            if (window.marked) {
                html = marked.parse(markdown);
            } else {
                html = this.editor.editor.innerHTML;
            }
            
            // Create a complete HTML document
            const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.currentFileName.replace('.md', '')}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 60px;
            color: #1a1a1a;
        }
        h1, h2 { border-bottom: 1px solid #ddd; padding-bottom: 0.3em; }
        h1 { font-size: 2.5em; }
        h2 { font-size: 2em; }
        h3 { font-size: 1.5em; }
        code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
        }
        pre {
            background-color: #f5f5f5;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
        }
        pre code { background-color: transparent; padding: 0; }
        blockquote {
            border-left: 4px solid #4a90e2;
            padding-left: 1em;
            color: #666;
            font-style: italic;
        }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: 600; }
        img { max-width: 100%; height: auto; }
        a { color: #4a90e2; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
${html}
</body>
</html>`;
            
            const filename = this.currentFileName.replace('.md', '.html');
            this.downloadFile(fullHTML, filename, 'text/html');
            this.showMessage('Exported to HTML');
        } catch (err) {
            console.error('Error exporting HTML:', err);
            alert('Failed to export HTML');
        }
    }
    
    async exportPDF() {
        // Note: PDF export requires a library like jsPDF or html2pdf
        // For now, we'll show a message that this feature requires the desktop app
        alert('PDF export will be available in the desktop application. For now, you can:\n1. Export to HTML\n2. Open in browser\n3. Print to PDF (Ctrl+P)');
    }
    
    downloadFile(content, filename, type = 'text/markdown') {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    showMessage(message) {
        const statusBar = document.getElementById('statusbar');
        const messageEl = document.createElement('div');
        messageEl.className = 'status-message';
        messageEl.textContent = message;
        messageEl.style.cssText = 'position: absolute; right: 12px; background: var(--accent-color); color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;';
        
        statusBar.style.position = 'relative';
        statusBar.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }
}
