/**
 * ========================================
 * TUTORIAL COMPONENT
 * ========================================
 */

class Tutorial {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: 'Welcome! 👋',
                content: `
                    <p>Welcome to the <strong>Memory Management Visualizer</strong>!</p>
                    <p>This interactive tool helps you understand how operating systems manage memory using different page replacement algorithms.</p>
                    <p>Let's take a quick tour to get you started.</p>
                `
            },
            {
                title: 'Configuration Panel ⚙️',
                content: `
                    <p>Start by configuring your simulation:</p>
                    <ul>
                        <li><strong>Number of Frames:</strong> Set how many memory frames are available (1-10)</li>
                        <li><strong>Reference String:</strong> Enter the sequence of page requests</li>
                        <li><strong>Algorithm:</strong> Choose a page replacement algorithm</li>
                        <li><strong>Speed:</strong> Adjust animation speed</li>
                    </ul>
                    <p>💡 Try the presets for quick examples!</p>
                `
            },
            {
                title: 'Available Algorithms 🧠',
                content: `
                    <p>Choose from 5 different algorithms:</p>
                    <ul>
                        <li><strong>FIFO:</strong> First-In-First-Out - replaces oldest page</li>
                        <li><strong>LRU:</strong> Least Recently Used - replaces least recently accessed page</li>
                        <li><strong>Optimal:</strong> Bélády's Algorithm - replaces page not needed for longest time</li>
                        <li><strong>Clock:</strong> Second Chance - circular queue with reference bits</li>
                        <li><strong>NFU:</strong> Not Frequently Used - replaces least frequently accessed page</li>
                    </ul>
                `
            },
            {
                title: 'Running Simulations ▶️',
                content: `
                    <p>Three ways to run your simulation:</p>
                    <ul>
                        <li><strong>Run Simulation:</strong> Automatic playback at your chosen speed</li>
                        <li><strong>Next Step:</strong> Execute one step at a time</li>
                        <li><strong>Prev Step:</strong> Go back to previous step</li>
                    </ul>
                    <p>🎯 Use keyboard shortcuts for faster control!</p>
                    <ul>
                        <li><kbd>Space</kbd> - Run/Pause</li>
                        <li><kbd>→</kbd> - Next Step</li>
                        <li><kbd>←</kbd> - Previous Step</li>
                    </ul>
                `
            },
            {
                title: 'Understanding Visualizations 📊',
                content: `
                    <p>Multiple views to understand your simulation:</p>
                    <ul>
                        <li><strong>Frame View:</strong> See current state of memory frames</li>
                        <li><strong>Timeline:</strong> Complete execution history</li>
                        <li><strong>Heat Map:</strong> Page access frequency visualization</li>
                        <li><strong>Table View:</strong> Detailed step-by-step data</li>
                    </ul>
                    <p>🎨 <span style="color: #ef4444;">Red</span> = Page Fault | <span style="color: #10b981;">Green</span> = Page Hit</p>
                `
            },
            {
                title: 'Compare Algorithms 🔬',
                content: `
                    <p>See which algorithm performs best:</p>
                    <ul>
                        <li>Click <strong>"Compare All"</strong> to run all algorithms</li>
                        <li>View side-by-side performance comparison</li>
                        <li>Analyze with interactive charts</li>
                        <li>Identify the winner based on fewest page faults</li>
                    </ul>
                    <p>Perfect for understanding trade-offs between algorithms!</p>
                `
            },
            {
                title: 'Advanced Features 🚀',
                content: `
                    <p>Take your learning further:</p>
                    <ul>
                        <li><strong>Save/Load:</strong> Save configurations for later</li>
                        <li><strong>Export:</strong> Download results as JSON, CSV, or TXT</li>
                        <li><strong>Analytics:</strong> View performance metrics and patterns</li>
                        <li><strong>Themes:</strong> Choose from 4 beautiful themes</li>
                        <li><strong>Thrashing Detection:</strong> Automatic warning for high fault rates</li>
                    </ul>
                `
            },
            {
                title: 'Ready to Start! 🎉',
                content: `
                    <p>You're all set to explore memory management!</p>
                    <p><strong>Quick Start Tips:</strong></p>
                    <ul>
                        <li>Start with a preset for a quick example</li>
                        <li>Try different algorithms on the same data</li>
                        <li>Experiment with different frame counts</li>
                        <li>Use step-by-step mode to understand each decision</li>
                    </ul>
                    <p>💡 Press <kbd>H</kbd> anytime to see keyboard shortcuts</p>
                    <p><strong>Happy Learning!</strong> 🎓</p>
                `
            }
        ];

        this.overlay = document.getElementById('tutorialOverlay');
        this.content = document.getElementById('tutorialContent');
        this.progress = document.getElementById('tutorialProgress');
        this.prevBtn = document.getElementById('tutorialPrev');
        this.nextBtn = document.getElementById('tutorialNext');
        this.closeBtn = document.getElementById('tutorialClose');

        this.attachEventListeners();
    }

    attachEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousStep());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextStep());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }
    }

    start() {
        this.currentStep = 0;
        this.show();
        this.render();
    }

    show() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            setTimeout(() => this.overlay.classList.add('fade-in'), 10);
        }
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('fade-in');
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.style.display = 'none';
                this.overlay.classList.remove('fade-out');
            }, 300);
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.render();
        } else {
            this.close();
            Helpers.showNotification('Tutorial completed! Start exploring! 🎉', 'success');
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.render();
        }
    }

    render() {
        const step = this.steps[this.currentStep];
        
        if (this.content) {
            this.content.innerHTML = `
                <h4 style="margin-bottom: 1rem; font-size: 1.25rem;">${step.title}</h4>
                <div style="line-height: 1.8;">${step.content}</div>
            `;
        }

        if (this.progress) {
            this.progress.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
        }

        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentStep === 0;
            this.prevBtn.style.opacity = this.currentStep === 0 ? '0.5' : '1';
        }

        if (this.nextBtn) {
            this.nextBtn.innerHTML = this.currentStep === this.steps.length - 1 
                ? 'Finish ✓' 
                : 'Next →';
        }
    }
}

window.Tutorial = Tutorial;