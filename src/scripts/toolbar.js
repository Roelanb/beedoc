// Toolbar Functionality
class Toolbar {
    constructor(editor) {
        this.editor = editor;
        this.theme = 'light';
        this.init();
    }
    
    init() {
        // File browser toggle
        this.bindButton('btn-toggle-browser', () => window.fileBrowser?.toggle());

        // File operations
        this.bindButton('btn-new', () => window.fileOps?.newFile());
        this.bindButton('btn-open', () => window.fileOps?.openFile());
        this.bindButton('btn-save', () => window.fileOps?.saveFile());

        // Export operations
        this.bindButton('btn-export-html', () => window.fileOps?.exportHTML());
        this.bindButton('btn-export-pdf', () => window.fileOps?.exportPDF());
        
        // Text formatting
        this.bindButton('btn-bold', () => this.editor.toggleFormat('bold'));
        this.bindButton('btn-italic', () => this.editor.toggleFormat('italic'));
        this.bindButton('btn-strikethrough', () => this.editor.toggleFormat('strikethrough'));
        this.bindButton('btn-code', () => this.editor.toggleFormat('code'));
        
        // Headings
        this.bindButton('btn-h1', () => this.editor.insertHeading(1));
        this.bindButton('btn-h2', () => this.editor.insertHeading(2));
        this.bindButton('btn-h3', () => this.editor.insertHeading(3));
        
        // Lists and quotes
        this.bindButton('btn-ul', () => this.editor.insertList(false));
        this.bindButton('btn-ol', () => this.editor.insertList(true));
        this.bindButton('btn-quote', () => this.editor.insertBlockquote());
        
        // Links and images
        this.bindButton('btn-link', () => this.editor.insertLink());
        this.bindButton('btn-image', () => this.editor.insertImage());
        
        // Advanced features
        this.bindButton('btn-codeblock', () => this.editor.insertCodeBlock());
        this.bindButton('btn-hr', () => this.editor.insertHorizontalRule());
        this.bindButton('btn-table', () => this.editor.insertTable());
        this.bindButton('btn-tasklist', () => this.editor.insertTaskList());
        
        // Theme toggle
        this.bindButton('btn-theme', () => this.toggleTheme());
        
        // Animations toggle
        this.bindButton('btn-animations', () => this.toggleAnimations());
        
        // Help panel
        this.bindButton('btn-help', () => this.toggleHelp());

        // About panel
        this.bindButton('btn-about', () => this.toggleAbout());

        // AI Assistant toggle
        this.bindButton('btn-ai-toggle', () => {
            if (window.aiAssistant) {
                window.aiAssistant.toggleAI();
            }
        });

        // Load saved theme
        this.loadTheme();

        // Setup help panel close handlers
        this.setupHelpPanel();

        // Setup about panel close handlers
        this.setupAboutPanel();

        // Global Escape key handler for dialogs
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const helpPanel = document.getElementById('help-panel');
                const aboutPanel = document.getElementById('about-panel');

                // Close whichever panel is open
                if (helpPanel && helpPanel.style.display !== 'none') {
                    this.toggleHelp();
                } else if (aboutPanel && aboutPanel.style.display !== 'none') {
                    this.toggleAbout();
                }
            }
        });
    }
    
    setupHelpPanel() {
        const helpPanel = document.getElementById('help-panel');
        const helpClose = document.getElementById('help-close');
        
        if (helpClose) {
            helpClose.addEventListener('click', () => this.toggleHelp());
        }
        
        if (helpPanel) {
            // Close on background click
            helpPanel.addEventListener('click', (e) => {
                if (e.target === helpPanel) {
                    this.toggleHelp();
                }
            });
            
            // Close on Escape key (handled globally below)
            // Removed individual listener to avoid duplicates
        }
    }
    
    toggleHelp() {
        const helpPanel = document.getElementById('help-panel');
        if (helpPanel) {
            if (helpPanel.style.display === 'none') {
                helpPanel.style.display = 'flex';
            } else {
                helpPanel.style.display = 'none';
            }
        }
    }

    setupAboutPanel() {
        const aboutPanel = document.getElementById('about-panel');
        const aboutClose = document.getElementById('about-close');

        if (aboutClose) {
            aboutClose.addEventListener('click', () => this.toggleAbout());
        }

        if (aboutPanel) {
            // Close on background click
            aboutPanel.addEventListener('click', (e) => {
                if (e.target === aboutPanel) {
                    this.toggleAbout();
                }
            });

            // Close on Escape key (handled globally below)
            // Removed individual listener to avoid duplicates
        }
    }

    toggleAbout() {
        const aboutPanel = document.getElementById('about-panel');
        if (aboutPanel) {
            if (aboutPanel.style.display === 'none') {
                aboutPanel.style.display = 'flex';
            } else {
                aboutPanel.style.display = 'none';
            }
        }
    }
    
    bindButton(id, handler) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handler);
        }
    }
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('beedoc-theme', this.theme);
    }
    
    toggleAnimations() {
        const btn = document.getElementById('btn-animations');
        if (window.d3Renderer) {
            const enabled = !window.d3Renderer.animationEnabled;
            window.d3Renderer.toggleAnimations(enabled);
            
            // Update button state
            if (enabled) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            // Save preference
            localStorage.setItem('beedoc-animations', enabled);
        }
    }
    
    loadTheme() {
        const savedTheme = localStorage.getItem('beedoc-theme');
        if (savedTheme) {
            this.theme = savedTheme;
            document.documentElement.setAttribute('data-theme', this.theme);
        }

        // Load animation preference
        const savedAnimations = localStorage.getItem('beedoc-animations');
        if (savedAnimations !== null && window.d3Renderer) {
            const enabled = savedAnimations === 'true';
            window.d3Renderer.toggleAnimations(enabled);

            const btn = document.getElementById('btn-animations');
            if (btn) {
                if (enabled) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            }
        }

        // Load AI assistant preference
        const aiEnabled = localStorage.getItem('beedoc-ai-enabled') === 'true';
        const aiBtn = document.getElementById('btn-ai-toggle');
        if (aiBtn && aiEnabled) {
            aiBtn.classList.add('active');
        }
    }
}
