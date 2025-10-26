// AI Assistant with OpenRouter Integration
class AIAssistant {
    constructor(editorInstance) {
        this.editor = editorInstance;
        this.apiKey = null;
        this.isEnabled = false;
        this.debounceTimer = null;
        this.debounceDelay = 2000; // Wait 2s after user stops typing
        this.minContextLength = 30; // Minimum characters before suggesting
        this.currentSuggestion = null;
        this.isLoading = false;
        this.lastContext = ''; // Track last context to avoid duplicate requests
        this.ghostTextSpan = null; // Inline ghost text element

        // OpenRouter configuration
        this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'deepseek/deepseek-r1-0528-qwen3-8b'; // Fast, free model for type-ahead

        this.init();
    }

    init() {
        // Load saved API key
        this.apiKey = localStorage.getItem('beedoc-openrouter-key');
        this.isEnabled = localStorage.getItem('beedoc-ai-enabled') === 'true';

        // Setup keyboard shortcuts
        this.setupKeyboardShortcuts();

        console.log('AI Assistant initialized', { enabled: this.isEnabled, hasKey: !!this.apiKey });
    }

    setupKeyboardShortcuts() {
        // Use capture phase to intercept Tab before other handlers
        document.addEventListener('keydown', (e) => {
            console.log('AI Key pressed:', e.key, 'Ghost text exists:', !!this.ghostTextSpan, 'Suggestion exists:', !!this.currentSuggestion);

            // Tab to accept suggestion - check first with highest priority
            if (e.key === 'Tab') {
                if (this.currentSuggestion && this.ghostTextSpan) {
                    console.log('AI: Tab pressed, accepting suggestion');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    this.acceptSuggestion();
                    return false;
                } else {
                    console.log('AI: Tab pressed but no suggestion to accept');
                }
            }

            // Escape to dismiss
            if (e.key === 'Escape') {
                if (this.currentSuggestion && this.ghostTextSpan) {
                    console.log('AI: Escape pressed, dismissing suggestion');
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideSuggestion();
                    return false;
                }
            }

            // Alt+A to toggle AI assistant
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAI();
                return false;
            }
        }, true); // Use capture phase (true)
    }

    async toggleAI() {
        if (!this.apiKey) {
            this.promptForAPIKey();
            return;
        }

        this.isEnabled = !this.isEnabled;
        localStorage.setItem('beedoc-ai-enabled', this.isEnabled);

        // Show status message
        const message = this.isEnabled ? 'AI Assistant enabled ✨' : 'AI Assistant disabled';
        this.showStatusMessage(message);

        // Update toolbar button if it exists
        const btn = document.getElementById('btn-ai-toggle');
        if (btn) {
            btn.classList.toggle('active', this.isEnabled);
        }

        // Clear any active suggestion when toggling off
        if (!this.isEnabled) {
            this.hideSuggestion();
        }
    }

    promptForAPIKey() {
        const key = prompt(
            'Enter your OpenRouter API key:\n\n' +
            'Get your free API key at https://openrouter.ai/keys\n\n' +
            '(The key will be stored locally in your browser)'
        );

        if (key && key.trim()) {
            this.apiKey = key.trim();
            localStorage.setItem('beedoc-openrouter-key', this.apiKey);
            this.isEnabled = true;
            localStorage.setItem('beedoc-ai-enabled', 'true');
            this.showStatusMessage('API key saved! AI Assistant enabled ✨');

            // Update toolbar button
            const btn = document.getElementById('btn-ai-toggle');
            if (btn) {
                btn.classList.add('active');
            }
        }
    }

    async handleInput() {
        if (!this.isEnabled || !this.apiKey) return;

        // Clear existing debounce timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Hide current suggestion when typing continues
        this.hideSuggestion();

        // Start new debounce timer
        this.debounceTimer = setTimeout(() => {
            this.generateSuggestion();
        }, this.debounceDelay);
    }

    async generateSuggestion() {
        try {
            // Get current context
            const context = this.getContext();

            console.log('AI Context:', {
                length: context.length,
                text: context.substring(Math.max(0, context.length - 100))
            });

            if (!context || context.length < this.minContextLength) {
                console.log('AI: Context too short', context.length);
                return;
            }

            // Don't suggest if user is in the middle of a word
            if (context.match(/\w$/)) {
                console.log('AI: Mid-word, skipping');
                return;
            }

            // Avoid duplicate requests for same context
            if (context === this.lastContext) {
                console.log('AI: Same context, skipping');
                return;
            }

            this.lastContext = context;

            const suggestion = await this.requestSuggestion(context);

            if (suggestion && suggestion.trim()) {
                this.currentSuggestion = suggestion.trim();
                console.log('AI Suggestion:', this.currentSuggestion);
                this.showSuggestion(this.currentSuggestion);
            } else {
                console.log('AI: No suggestion received');
                this.hideSuggestion();
            }
        } catch (error) {
            console.error('Error generating suggestion:', error);
            this.hideSuggestion();

            if (error.message.includes('401') || error.message.includes('403')) {
                this.showStatusMessage('Invalid API key. Please check your OpenRouter API key.');
            } else if (error.message.includes('429')) {
                this.showStatusMessage('Rate limit reached. Please wait a moment.');
            } else {
                this.showStatusMessage('AI suggestion failed. Check console for details.');
            }
        }
    }

    getContext() {
        // Get all text content from the editor
        const editorElement = this.editor.editor;
        if (!editorElement) {
            console.error('AI: Editor element not found');
            return '';
        }

        // Get plain text content
        let fullText = editorElement.innerText || editorElement.textContent || '';

        // Clean up the text
        fullText = fullText
            .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
            .trim();

        console.log('AI: Full editor text length:', fullText.length);

        // Get cursor position to find where we are
        const selection = window.getSelection();
        if (!selection.rangeCount) {
            // No selection, use full text
            return fullText.substring(Math.max(0, fullText.length - 800));
        }

        // Try to get text up to cursor position
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorElement);
        preCaretRange.setEnd(range.endContainer, range.endOffset);

        let textBeforeCursor = preCaretRange.toString();

        // Limit context to last 800 characters for better performance
        if (textBeforeCursor.length > 800) {
            textBeforeCursor = textBeforeCursor.substring(textBeforeCursor.length - 800);
        }

        return textBeforeCursor.trim();
    }

    async requestSuggestion(context) {
        console.log('AI: Requesting suggestion from OpenRouter...');

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'BeeDoc'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful writing assistant. Continue the user\'s text naturally and concisely. Provide ONLY the continuation text (1-3 sentences max), NO explanations, NO quotation marks, NO meta-commentary. Match the writing style and tone exactly. Start your response with the next word that should come after the user\'s text.'
                    },
                    {
                        role: 'user',
                        content: context
                    }
                ],
                max_tokens: 120,
                temperature: 0.7,
                top_p: 0.9,
                stop: ["\n\n\n", "User:", "Assistant:"]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('AI API Error:', response.status, errorText);
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('AI API Response:', data);

        if (!data.choices || !data.choices[0]) {
            console.error('AI: Invalid response structure', data);
            return '';
        }

        let suggestion = data.choices[0].message.content;

        // Clean up the suggestion
        suggestion = suggestion
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .replace(/^Continue:\s*/i, '') // Remove "Continue:" prefix
            .replace(/^Here's the continuation:\s*/i, '') // Remove meta text
            .trim();

        return suggestion;
    }

    showSuggestion(text) {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);

        // Remove any existing ghost text
        this.hideSuggestion();

        // Create ghost text span
        this.ghostTextSpan = document.createElement('span');
        this.ghostTextSpan.className = 'ai-ghost-text';
        this.ghostTextSpan.textContent = text;
        this.ghostTextSpan.contentEditable = 'false';

        try {
            // Insert ghost text at cursor position
            range.collapse(false); // Collapse to end
            range.insertNode(this.ghostTextSpan);

            // Move cursor back before ghost text
            range.setStartBefore(this.ghostTextSpan);
            range.setEndBefore(this.ghostTextSpan);
            selection.removeAllRanges();
            selection.addRange(range);

            // IMPORTANT: Set currentSuggestion AFTER hideSuggestion() cleared it
            this.currentSuggestion = text;

            console.log('AI: Inline suggestion displayed. Press Tab to accept, Esc to dismiss.');
        } catch (error) {
            console.error('AI: Error inserting ghost text:', error);
            this.ghostTextSpan = null;
            this.currentSuggestion = null;
        }
    }

    hideSuggestion() {
        if (this.ghostTextSpan && this.ghostTextSpan.parentNode) {
            this.ghostTextSpan.parentNode.removeChild(this.ghostTextSpan);
        }
        this.ghostTextSpan = null;
        this.currentSuggestion = null;
        this.isLoading = false;
    }

    acceptSuggestion() {
        console.log('AI: acceptSuggestion called', {
            hasSuggestion: !!this.currentSuggestion,
            hasGhostText: !!this.ghostTextSpan,
            ghostTextParent: this.ghostTextSpan ? !!this.ghostTextSpan.parentNode : false
        });

        if (!this.currentSuggestion || !this.ghostTextSpan) {
            console.log('AI: No suggestion to accept');
            return;
        }

        if (!this.ghostTextSpan.parentNode) {
            console.error('AI: Ghost text has no parent node');
            this.hideSuggestion();
            return;
        }

        console.log('AI: Accepting suggestion:', this.currentSuggestion);

        try {
            const parentNode = this.ghostTextSpan.parentNode;

            // Replace ghost text with actual text (no leading space - it's already there)
            const textNode = document.createTextNode(this.currentSuggestion);
            parentNode.replaceChild(textNode, this.ghostTextSpan);

            console.log('AI: Ghost text replaced with real text');

            // Move cursor to end of inserted text
            const selection = window.getSelection();
            const range = document.createRange();
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            console.log('AI: Cursor moved to end of text');

            // Clear suggestion state
            this.ghostTextSpan = null;
            this.currentSuggestion = null;
            this.lastContext = ''; // Reset to allow new suggestions

            // Focus editor
            if (this.editor && this.editor.editor) {
                this.editor.editor.focus();
            }

            // Mark editor as modified (but don't trigger AI again immediately)
            if (this.editor) {
                this.editor.isModified = true;
                this.editor.updateContent();
                this.editor.updateStatusBar();
            }

            console.log('AI: Suggestion accepted successfully');
        } catch (error) {
            console.error('AI: Error accepting suggestion:', error);
            this.hideSuggestion();
            this.showStatusMessage('Failed to accept suggestion');
        }
    }

    showStatusMessage(message) {
        console.log('AI Status:', message);

        // Reuse the file operations status message system
        if (window.fileOps && window.fileOps.showMessage) {
            window.fileOps.showMessage(message);
        } else {
            // Fallback to console
            console.log(message);
        }
    }

    destroy() {
        this.hideSuggestion();
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}
