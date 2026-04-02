/**
 * ========================================
 * MAIN APPLICATION - COMPLETE & FIXED
 * ========================================
 */

class MemoryManagementApp {
    constructor() {
        this.visualizer = new Visualizer();
        this.dashboard = new Dashboard();
        this.tutorial = new Tutorial();
        
        this.controls = new Controls({
            onRun: (input) => this.runSimulation(input),
            onStep: (input) => this.stepSimulation(input),
            onPrevStep: () => this.previousStep(),
            onReset: () => this.resetSimulation(),
            onCompare: (input) => this.compareAlgorithms(input),
            onExport: (format) => this.exportResults(format),
            onTutorial: () => this.tutorial.start()
        });
        
        this.currentAlgorithm = null;
        this.currentStepIndex = 0;
        this.simulationResult = null;
        this.simulationHistory = [];
        this.allResults = {};
        this.isRunning = false;
        
        this.initialize();
    }

    initialize() {
        this.updateSimulationCount();
        this.setupTimelineNavigation();
        this.loadSavedTheme();
        
        setTimeout(() => {
            Helpers.showNotification('Welcome! Click Tutorial (📚) to get started', 'success');
        }, 500);
    }

    updateSimulationCount() {
        const totalSims = document.getElementById('totalSims');
        if (totalSims) {
            totalSims.textContent = Storage.getSimCount();
        }
    }

    loadSavedTheme() {
        const savedTheme = Storage.loadTheme();
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === savedTheme);
        });
    }

    setupTimelineNavigation() {
        document.addEventListener('timeline-step-click', (e) => {
            const { stepIndex } = e.detail;
            this.jumpToStep(stepIndex);
        });
    }

    runSimulation(input) {
        try {
            if (this.isRunning) {
                this.controls.stopAutoRun();
                this.isRunning = false;
                return;
            }

            this.resetSimulation();
            
            this.currentAlgorithm = this.createAlgorithm(input.algorithm, input.numFrames);
            this.simulationResult = this.currentAlgorithm.simulate(input.pages);
            this.simulationResult.input = input;
            
            this.visualizer.initializeFrames(input.numFrames);
            this.visualizer.buildTimeline(this.simulationResult.steps);
            this.visualizer.buildTable(this.simulationResult.steps, input.numFrames);
            
            this.currentStepIndex = 0;
            this.isRunning = true;
            
            this.controls.startAutoRun(() => {
                return this.executeNextStep();
            }, input.speed);
            
            Storage.incrementSimCount();
            this.updateSimulationCount();
            
            Helpers.showNotification('Simulation started! 🚀', 'success');
        } catch (error) {
            console.error('Simulation error:', error);
            Helpers.showNotification('Error: ' + error.message, 'error');
            this.isRunning = false;
        }
    }

    stepSimulation(input) {
        try {
            if (!this.currentAlgorithm) {
                this.currentAlgorithm = this.createAlgorithm(input.algorithm, input.numFrames);
                this.simulationResult = this.currentAlgorithm.simulate(input.pages);
                this.simulationResult.input = input;
                this.visualizer.initializeFrames(input.numFrames);
                this.visualizer.buildTimeline(this.simulationResult.steps);
                this.visualizer.buildTable(this.simulationResult.steps, input.numFrames);
                this.currentStepIndex = 0;
            }
            
            this.executeNextStep();
            
        } catch (error) {
            console.error('Step error:', error);
            Helpers.showNotification('Error: ' + error.message, 'error');
        }
    }

    executeNextStep() {
        if (!this.simulationResult) {
            console.error('No simulation result');
            return false;
        }

        if (this.currentStepIndex >= this.simulationResult.steps.length) {
            this.onSimulationComplete();
            this.isRunning = false;
            return false;
        }

        const step = this.simulationResult.steps[this.currentStepIndex];
        
        this.visualizer.updateFrames(step.frames, step.fault, step.replaceIndex);
        this.visualizer.updateCurrentPage(step.page, step.fault, this.simulationResult.algorithm);
        this.visualizer.highlightTimelineStep(this.currentStepIndex);
        this.visualizer.addLogEntry(step, this.currentStepIndex + 1);
        
        const stats = this.calculateCurrentStats();
        this.dashboard.updateStats(stats);
        
        this.currentStepIndex++;
        
        return this.currentStepIndex < this.simulationResult.steps.length;
    }

    previousStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            
            const step = this.simulationResult.steps[this.currentStepIndex];
            
            this.visualizer.updateFrames(step.frames, false);
            this.visualizer.updateCurrentPage(step.page, step.fault, this.simulationResult.algorithm);
            this.visualizer.highlightTimelineStep(this.currentStepIndex);
            
            const stats = this.calculateCurrentStats();
            this.dashboard.updateStats(stats);
        } else {
            Helpers.showNotification('Already at first step', 'info');
        }
    }

    jumpToStep(stepIndex) {
        if (!this.simulationResult || stepIndex < 0 || stepIndex >= this.simulationResult.steps.length) {
            return;
        }

        this.currentStepIndex = stepIndex;
        
        const step = this.simulationResult.steps[stepIndex];
        
        this.visualizer.updateFrames(step.frames, false);
        this.visualizer.updateCurrentPage(step.page, step.fault, this.simulationResult.algorithm);
        this.visualizer.highlightTimelineStep(stepIndex);
        
        const stats = this.calculateCurrentStats();
        this.dashboard.updateStats(stats);
        
        Helpers.showNotification(`Jumped to step ${stepIndex + 1}`, 'info');
    }

    calculateCurrentStats() {
        const currentSteps = this.simulationResult.steps.slice(0, this.currentStepIndex + 1);
        const pageFaults = currentSteps.filter(s => s.fault).length;
        const pageHits = currentSteps.length - pageFaults;
        const hitRatio = currentSteps.length > 0 
            ? ((pageHits / currentSteps.length) * 100).toFixed(1) 
            : 0;

        return {
            currentStep: this.currentStepIndex + 1,
            totalSteps: this.simulationResult.steps.length,
            pageFaults,
            pageHits,
            hitRatio: parseFloat(hitRatio),
            faultChange: `${pageFaults}`,
            hitChange: `${pageHits}`,
            ratioChange: `${hitRatio}%`
        };
    }

    onSimulationComplete() {
        this.isRunning = false;
        Helpers.showNotification('✓ Simulation complete!', 'success');
        
        this.dashboard.createPerformanceChart(this.simulationResult);
        this.dashboard.createAccessPatternChart(this.simulationResult);
        this.dashboard.checkThrashing(this.simulationResult);
        
        this.visualizer.generateHeatMap(this.simulationResult);
    }

    resetSimulation() {
        this.controls.stopAutoRun();
        this.isRunning = false;
        this.currentAlgorithm = null;
        this.currentStepIndex = 0;
        this.simulationResult = null;
        this.simulationHistory = [];
        this.visualizer.reset();
        this.dashboard.reset();
        
        const comparisonSection = document.getElementById('comparisonSection');
        if (comparisonSection) {
            comparisonSection.style.display = 'none';
        }
        
        Helpers.showNotification('Simulation reset', 'info');
    }

    async compareAlgorithms(input) {
        try {
            Helpers.showNotification('Running comparison... ⏳', 'info');
            
            const algorithms = ['fifo', 'lru', 'optimal', 'clock', 'nfu'];
            this.allResults = {};
            
            for (const algo of algorithms) {
                const algorithm = this.createAlgorithm(algo, input.numFrames);
                this.allResults[algo] = algorithm.simulate(input.pages);
            }
            
            const comparisonSection = document.getElementById('comparisonSection');
            if (comparisonSection) {
                comparisonSection.style.display = 'block';
                setTimeout(() => {
                    comparisonSection.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            
            this.visualizer.createComparisonChart(this.allResults);
            
            let bestAlgo = '';
            let minFaults = Infinity;
            Object.keys(this.allResults).forEach(algo => {
                if (this.allResults[algo].pageFaults < minFaults) {
                    minFaults = this.allResults[algo].pageFaults;
                    bestAlgo = algo;
                }
            });
            
            Helpers.showNotification(`Best: ${bestAlgo.toUpperCase()} with ${minFaults} faults! 🏆`, 'success');
            
        } catch (error) {
            console.error('Comparison error:', error);
            Helpers.showNotification('Comparison failed: ' + error.message, 'error');
        }
    }

    exportResults(format) {
        if (!this.simulationResult) {
            Helpers.showNotification('No simulation data to export', 'error');
            return;
        }

        const data = {
            algorithm: this.simulationResult.algorithm,
            timestamp: new Date().toISOString(),
            input: this.simulationResult.input,
            steps: this.simulationResult.steps,
            summary: {
                totalSteps: this.simulationResult.steps.length,
                pageFaults: this.simulationResult.pageFaults,
                pageHits: this.simulationResult.steps.length - this.simulationResult.pageFaults,
                hitRatio: ((this.simulationResult.steps.length - this.simulationResult.pageFaults) / 
                          this.simulationResult.steps.length * 100).toFixed(2) + '%'
            }
        };

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const algoName = this.simulationResult.algorithm.toLowerCase();

        switch (format) {
            case 'json':
                ExportUtil.exportJSON(data, `simulation-${algoName}-${timestamp}.json`);
                break;
            case 'csv':
                ExportUtil.exportCSV(data, `simulation-${algoName}-${timestamp}.csv`);
                break;
            case 'txt':
                ExportUtil.exportText(data, `simulation-${algoName}-${timestamp}.txt`);
                break;
        }

        Helpers.showNotification(`Exported as ${format.toUpperCase()}! 💾`, 'success');
    }

    createAlgorithm(type, numFrames) {
        switch (type) {
            case 'fifo':
                return new FIFOAlgorithm(numFrames);
            case 'lru':
                return new LRUAlgorithm(numFrames);
            case 'optimal':
                return new OptimalAlgorithm(numFrames);
            case 'clock':
                return new ClockAlgorithm(numFrames);
            case 'nfu':
                return new NFUAlgorithm(numFrames);
            default:
                throw new Error('Unknown algorithm type: ' + type);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Memory Management Visualizer...');
    
    try {
        window.app = new MemoryManagementApp();
        console.log('✅ Application initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        alert('Failed to load application. Please check console for errors.');
    }
    
    // Footer links
    const footerTutorial = document.getElementById('footerTutorial');
    if (footerTutorial) {
        footerTutorial.addEventListener('click', (e) => {
            e.preventDefault();
            window.app.tutorial.start();
        });
    }
    
    const footerDocs = document.getElementById('footerDocs');
    if (footerDocs) {
        footerDocs.addEventListener('click', (e) => {
            e.preventDefault();
            Helpers.showNotification('Documentation feature coming soon!', 'info');
        });
    }
    
    const footerGithub = document.getElementById('footerGithub');
    if (footerGithub) {
        footerGithub.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://github.com', '_blank');
        });
    }
});

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    Helpers.showNotification('An error occurred. Check console for details.', 'error');
});

// Prevent unload if simulation is running
window.addEventListener('beforeunload', (e) => {
    if (window.app && window.app.isRunning) {
        e.preventDefault();
        e.returnValue = '';
        return 'Simulation is running. Are you sure you want to leave?';
    }
});