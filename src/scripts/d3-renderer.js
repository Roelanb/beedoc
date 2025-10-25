// D3.js Enhanced Renderer
class D3Renderer {
    constructor(editorElement) {
        this.editor = editorElement;
        this.d3Editor = d3.select(editorElement);
        this.animationEnabled = true;
        this.init();
    }
    
    init() {
        // Add D3-specific classes and data attributes
        this.d3Editor.classed('d3-enhanced', true);
        
        // Set up observers for DOM changes
        this.setupMutationObserver();
        
        // Initial enhancement
        this.enhanceAllElements();
    }
    
    setupMutationObserver() {
        // Observe changes to the editor content
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.enhanceElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(this.editor, {
            childList: true,
            subtree: true
        });
    }
    
    enhanceAllElements() {
        // Enhance all existing elements
        const elements = this.editor.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, blockquote, pre, table, hr');
        elements.forEach(el => this.enhanceElement(el));
    }
    
    enhanceElement(element) {
        const tagName = element.tagName.toLowerCase();
        
        switch(tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                this.enhanceHeading(element);
                break;
            case 'blockquote':
                this.enhanceBlockquote(element);
                break;
            case 'pre':
                this.enhanceCodeBlock(element);
                break;
            case 'table':
                this.enhanceTable(element);
                break;
            case 'hr':
                this.enhanceHorizontalRule(element);
                break;
            case 'ul':
            case 'ol':
                this.enhanceList(element);
                break;
        }
    }
    
    enhanceHeading(heading) {
        const d3Heading = d3.select(heading);
        
        // Add fade-in animation
        if (this.animationEnabled && !heading.classList.contains('d3-animated')) {
            d3Heading
                .style('opacity', 0)
                .transition()
                .duration(300)
                .style('opacity', 1);
            
            heading.classList.add('d3-animated');
        }
        
        // Add hover effect with D3
        d3Heading
            .on('mouseenter', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('transform', 'translateX(5px)');
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('transform', 'translateX(0)');
            });
    }
    
    enhanceBlockquote(blockquote) {
        const d3Blockquote = d3.select(blockquote);
        
        // Add sliding animation
        if (this.animationEnabled && !blockquote.classList.contains('d3-animated')) {
            d3Blockquote
                .style('opacity', 0)
                .style('transform', 'translateX(-20px)')
                .transition()
                .duration(400)
                .style('opacity', 1)
                .style('transform', 'translateX(0)');
            
            blockquote.classList.add('d3-animated');
        }
        
        // Add border animation on hover
        d3Blockquote
            .on('mouseenter', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('border-left-width', '6px');
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('border-left-width', '4px');
            });
    }
    
    enhanceCodeBlock(pre) {
        const d3Pre = d3.select(pre);
        
        // Add fade-in animation
        if (this.animationEnabled && !pre.classList.contains('d3-animated')) {
            d3Pre
                .style('opacity', 0)
                .transition()
                .duration(400)
                .style('opacity', 1);
            
            pre.classList.add('d3-animated');
        }
        
        // Add line numbers if not already present
        const code = pre.querySelector('code');
        if (code && !code.classList.contains('has-line-numbers')) {
            this.addLineNumbers(code);
        }
    }
    
    addLineNumbers(codeElement) {
        const lines = codeElement.textContent.split('\n');
        if (lines.length <= 1) return;
        
        codeElement.classList.add('has-line-numbers');
        
        // Create line number container
        const lineNumbersDiv = document.createElement('div');
        lineNumbersDiv.className = 'line-numbers';
        lineNumbersDiv.style.cssText = `
            position: absolute;
            left: 0;
            top: 0;
            padding: 1em 0.5em;
            color: var(--text-secondary);
            opacity: 0.5;
            user-select: none;
            font-family: var(--font-mono);
            font-size: 0.9em;
            line-height: 1.5;
        `;
        
        lines.forEach((_, i) => {
            const lineNum = document.createElement('div');
            lineNum.textContent = i + 1;
            lineNumbersDiv.appendChild(lineNum);
        });
        
        // Make pre relative and add padding
        codeElement.parentElement.style.position = 'relative';
        codeElement.style.paddingLeft = '3em';
        codeElement.parentElement.insertBefore(lineNumbersDiv, codeElement);
    }
    
    enhanceTable(table) {
        const d3Table = d3.select(table);
        
        // Add fade-in animation
        if (this.animationEnabled && !table.classList.contains('d3-animated')) {
            d3Table
                .style('opacity', 0)
                .transition()
                .duration(400)
                .style('opacity', 1);
            
            table.classList.add('d3-animated');
        }
        
        // Add row hover effects
        d3Table.selectAll('tr')
            .on('mouseenter', function() {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .style('background-color', 'var(--bg-tertiary)');
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .style('background-color', null);
            });
    }
    
    enhanceHorizontalRule(hr) {
        const d3Hr = d3.select(hr);
        
        // Add expanding animation
        if (this.animationEnabled && !hr.classList.contains('d3-animated')) {
            d3Hr
                .style('width', '0%')
                .transition()
                .duration(600)
                .style('width', '100%');
            
            hr.classList.add('d3-animated');
        }
    }
    
    enhanceList(list) {
        const d3List = d3.select(list);
        
        // Add staggered fade-in for list items
        if (this.animationEnabled && !list.classList.contains('d3-animated')) {
            d3List.selectAll('li')
                .style('opacity', 0)
                .transition()
                .duration(300)
                .delay((d, i) => i * 50)
                .style('opacity', 1);
            
            list.classList.add('d3-animated');
        }
    }
    
    // Visualize document structure
    createDocumentMap() {
        const headings = Array.from(this.editor.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        
        if (headings.length === 0) return null;
        
        const data = headings.map(h => ({
            level: parseInt(h.tagName[1]),
            text: h.textContent,
            element: h
        }));
        
        return data;
    }
    
    // Create a visual document outline
    renderDocumentOutline(container) {
        const data = this.createDocumentMap();
        if (!data) return;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', '100%')
            .attr('height', data.length * 30);
        
        const items = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', (d, i) => `translate(0, ${i * 30})`);
        
        // Add lines
        items.append('line')
            .attr('x1', d => (d.level - 1) * 20)
            .attr('y1', 15)
            .attr('x2', d => (d.level - 1) * 20 + 15)
            .attr('y2', 15)
            .attr('stroke', 'var(--accent-color)')
            .attr('stroke-width', 2);
        
        // Add text
        items.append('text')
            .attr('x', d => (d.level - 1) * 20 + 20)
            .attr('y', 20)
            .text(d => d.text)
            .style('font-size', '12px')
            .style('fill', 'var(--text-primary)')
            .style('cursor', 'pointer')
            .on('click', function(event, d) {
                d.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
    }
    
    // Add word cloud visualization for document
    createWordCloud(container, maxWords = 20) {
        const text = this.editor.textContent;
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(w => w.length > 3);
        
        // Count word frequency
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });
        
        // Get top words
        const topWords = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, maxWords)
            .map(([word, count]) => ({ word, count }));
        
        // Create visualization
        const width = container.clientWidth;
        const height = 300;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const maxCount = d3.max(topWords, d => d.count);
        const fontSize = d3.scaleLinear()
            .domain([1, maxCount])
            .range([12, 48]);
        
        const simulation = d3.forceSimulation(topWords)
            .force('charge', d3.forceManyBody().strength(5))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => fontSize(d.count) / 2 + 5));
        
        const nodes = svg.selectAll('text')
            .data(topWords)
            .enter()
            .append('text')
            .text(d => d.word)
            .style('font-size', d => fontSize(d.count) + 'px')
            .style('fill', 'var(--accent-color)')
            .style('text-anchor', 'middle')
            .style('cursor', 'pointer');
        
        simulation.on('tick', () => {
            nodes
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });
    }
    
    // Toggle animations
    toggleAnimations(enabled) {
        this.animationEnabled = enabled;
    }
    
    // Reset all animations
    resetAnimations() {
        const elements = this.editor.querySelectorAll('.d3-animated');
        elements.forEach(el => {
            el.classList.remove('d3-animated');
            el.style.opacity = '';
            el.style.transform = '';
        });
        this.enhanceAllElements();
    }
}
