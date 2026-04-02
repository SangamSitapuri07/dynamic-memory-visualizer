/**
 * ========================================
 * ENHANCED CONTROLS COMPONENT - FIXED
 * ========================================
 */

class Controls {
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.isRunning = false;
        this.autoRunInterval = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.setupKeyboardShortcuts();
        this.setupThemeSelector();
        this.setupCollapsibles();
        this.setupTabs();
        this.setupDropdowns();
    }

    initializeElements() {
        this.runBtn = document.getElementById('runBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.prevStepBtn = document.getElementById('prevStepBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.compareBtn = document.getElementById('compareBtn');
        this.clearLogBtn = document.getElementById('clearLogBtn');
        this.exportDropdownBtn = document.getElementById('exportDropdownBtn');
        
        this.tutorialBtn = document.getElementById('tutorialBtn');
        this.shortcutsBtn = document.getElementById('shortcutsBtn');
        
        this.newSimBtn = document.getElementById('newSimBtn');
        this.saveConfigBtn = document.getElementById('saveConfigBtn');
        this.loadConfigBtn = document.getElementById('loadConfigBtn');
        this.presetSelect = document.getElementById('presetSelect');
        
        this.numFramesInput = document.getElementById('numFrames');
        this.referenceStringInput = document.getElementById('referenceString');
        this.algorithmSelect = document.getElementById('algorithm');
        this.speedInput = document.getElementById('speed');
        this.speedValue = document.getElementById('speedValue');
        
        this.increaseFrames = document.getElementById('increaseFrames');
        this.decreaseFrames = document.getElementById('decreaseFrames');
        this.generateRandomBtn = document.getElementById('generateRandomBtn');
        this.validateBtn = document.getElementById('validateBtn');
        
        this.advancedToggle = document.getElementById('advancedToggle');
        this.advancedContent = document.getElementById('advancedContent');
        
        this.logSearch = document.getElementById('logSearch');
        this.logFilter = document.getElementById('logFilter');
    }

    attachEventListeners() {
        if (this.runBtn) {
            this.runBtn.addEventListener('click', () => this.handleRun());
        }
        if (this.stepBtn) {
            this.stepBtn.addEventListener('click', () => this.handleStep());
        }
        if (this.prevStepBtn) {
            this.prevStepBtn.addEventListener('click', () => this.handlePrevStep());
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.handleReset());
        }
        if (this.compareBtn) {
            this.compareBtn.addEventListener('click', () => this.handleCompare());
        }
        if (this.clearLogBtn) {
            this.clearLogBtn.addEventListener('click', () => this.handleClearLog());
        }
        
        if (this.tutorialBtn) {
            this.tutorialBtn.addEventListener('click', () => {
                if (this.callbacks.onTutorial) {
                    this.callbacks.onTutorial();
                }
            });
        }
        if (this.shortcutsBtn) {
            this.shortcutsBtn.addEventListener('click', () => this.showShortcuts());
        }
        
        if (this.newSimBtn) {
            this.newSimBtn.addEventListener('click', () => this.handleReset());
        }
        if (this.saveConfigBtn) {
            this.saveConfigBtn.addEventListener('click', () => this.saveConfiguration());
        }
        if (this.loadConfigBtn) {
            this.loadConfigBtn.addEventListener('click', () => this.loadConfiguration());
        }
        if (this.presetSelect) {
            this.presetSelect.addEventListener('change', (e) => this.loadPreset(e.target.value));
        }
        
        if (this.increaseFrames) {
            this.increaseFrames.addEventListener('click', () => this.adjustFrames(1));
        }
        if (this.decreaseFrames) {
            this.decreaseFrames.addEventListener('click', () => this.adjustFrames(-1));
        }
        if (this.generateRandomBtn) {
            this.generateRandomBtn.addEventListener('click', () => this.generateRandom());
        }
        if (this.validateBtn) {
            this.validateBtn.addEventListener('click', () => this.validateInput());
        }
        
        if (this.speedInput && this.speedValue) {
            this.speedInput.addEventListener('input', (e) => {
                this.speedValue.textContent = `${e.target.value}ms`;
            });
        }
        
        if (this.algorithmSelect) {
            this.algorithmSelect.addEventListener('change', (e) => {
                this.updateAlgorithmInfo(e.target.value);
            });
            this.updateAlgorithmInfo(this.algorithmSelect.value);
        }
        
        if (this.advancedToggle) {
            this.advancedToggle.addEventListener('click', () => this.toggleAdvanced());
        }
        
        if (this.logSearch) {
            this.logSearch.addEventListener('input', (e) => this.filterLogs(e.target.value));
        }
        if (this.logFilter) {
            this.logFilter.addEventListener('change', (e) => this.filterLogs(null, e.target.value));
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    this.handleRun();
                    break;
                case 'arrowright':
                    e.preventDefault();
                    this.handleStep();
                    break;
                case 'arrowleft':
                    e.preventDefault();
                    this.handlePrevStep();
                    break;
                case 'r':
                    e.preventDefault();
                    this.handleReset();
                    break;
                case 'c':
                    e.preventDefault();
                    this.handleCompare();
                    break;
                case 't':
                    e.preventDefault();
                    this.cycleTheme();
                    break;
                case 'h':
                    e.preventDefault();
                    this.showShortcuts();
                    break;
                case 's':
                    e.preventDefault();
                    this.saveConfiguration();
                    break;
            }
        });
    }

    setupThemeSelector() {
        const themeBtns = document.querySelectorAll('.theme-btn');
        const savedTheme = Storage.loadTheme();
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                Storage.saveTheme(theme);
                
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                Helpers.showNotification(`Theme changed to ${theme}`, 'success');
            });
        });
    }

    setupCollapsibles() {
        const collapseBtns = document.querySelectorAll('.collapse-btn');
        
        collapseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const target = document.getElementById(targetId);
                
                if (target) {
                    const isCollapsed = target.style.display === 'none';
                    target.style.display = isCollapsed ? 'block' : 'none';
                    btn.classList.toggle('collapsed');
                }
            });
        });
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const tabContent = document.getElementById(`${tabName}Tab`);
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });
    }

    setupDropdowns() {
        const exportMenu = document.getElementById('exportMenu');
        
        this.exportDropdownBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu?.classList.toggle('active');
        });
        
        document.addEventListener('click', () => {
            exportMenu?.classList.remove('active');
        });
        
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const format = item.dataset.format;
                this.handleExport(format);
                exportMenu?.classList.remove('active');
            });
        });
    }

    handleRun() {
        if (this.isRunning) {
            this.stopAutoRun();
        } else {
            const input = this.getInput();
            if (input) {
                this.callbacks.onRun?.(input);
            }
        }
    }

    handleStep() {
        const input = this.getInput();
        if (input) {
            this.callbacks.onStep?.(input);
        }
    }

    handlePrevStep() {
        this.callbacks.onPrevStep?.();
    }

    handleReset() {
        this.stopAutoRun();
        this.callbacks.onReset?.();
    }

    handleCompare() {
        const input = this.getInput();
        if (input) {
            this.callbacks.onCompare?.(input);
        }
    }

    handleClearLog() {
        const logContainer = document.getElementById('logContainer');
        if (logContainer) {
            logContainer.innerHTML = `
                <div class="log-empty">
                    <div class="empty-icon">📋</div>
                    <div class="empty-text">Run a simulation to see execution logs</div>
                </div>
            `;
        }
    }

    handleExport(format) {
        this.callbacks.onExport?.(format);
    }

    getInput() {
        const numFrames = parseInt(this.numFramesInput.value);
        const referenceString = this.referenceStringInput.value;
        const algorithm = this.algorithmSelect.value;
        const speed = parseInt(this.speedInput.value);

        const pages = Helpers.parseReferenceString(referenceString);
        
        if (!pages) {
            Helpers.showNotification('Invalid reference string format', 'error');
            return null;
        }

        const validation = Helpers.validateInput(numFrames, pages);
        
        if (!validation.success) {
            Helpers.showNotification(validation.message, 'error');
            return null;
        }

        return { numFrames, pages, algorithm, speed };
    }

    adjustFrames(delta) {
        const current = parseInt(this.numFramesInput.value);
        const newValue = Math.max(1, Math.min(10, current + delta));
        this.numFramesInput.value = newValue;
    }

    generateRandom() {
        const length = 15 + Math.floor(Math.random() * 15);
        const maxPage = 9;
        const pages = [];
        
        for (let i = 0; i < length; i++) {
            pages.push(Math.floor(Math.random() * (maxPage + 1)));
        }
        
        this.referenceStringInput.value = pages.join(',');
        Helpers.showNotification(`Generated random sequence of ${length} pages`, 'success');
    }

    validateInput() {
        const input = this.getInput();
        if (input) {
            Helpers.showNotification('✓ Input is valid and ready to simulate', 'success');
        }
    }

    updateAlgorithmInfo(algorithm) {
        const infoElement = document.getElementById('algorithmInfo');
        if (!infoElement) return;

        const descriptions = {
            fifo: 'FIFO: Replaces the oldest page in memory. Simple but may suffer from Belady\'s Anomaly.',
            lru: 'LRU: Replaces the page that hasn\'t been used for the longest time. Generally performs well.',
            optimal: 'Optimal: Replaces the page that won\'t be used for the longest time. Best possible but requires future knowledge.',
            clock: 'Clock: Uses a circular queue with reference bits. Good balance between performance and complexity.',
            nfu: 'NFU: Replaces the page with lowest access count. Tracks frequency of page usage.'
        };

        infoElement.innerHTML = `<strong>${algorithm.toUpperCase()}:</strong> ${descriptions[algorithm]}`;
    }

    toggleAdvanced() {
        if (this.advancedContent) {
            const isHidden = this.advancedContent.style.display === 'none';
            this.advancedContent.style.display = isHidden ? 'block' : 'none';
            this.advancedToggle.classList.toggle('active');
        }
    }

    filterLogs(searchTerm = null, filterType = null) {
        const logs = document.querySelectorAll('.log-entry');
        const search = searchTerm || this.logSearch?.value || '';
        const filter = filterType || this.logFilter?.value || 'all';
        
        logs.forEach(log => {
            const text = log.textContent.toLowerCase();
            const matchesSearch = text.includes(search.toLowerCase());
            const matchesFilter = filter === 'all' || 
                                (filter === 'fault' && log.classList.contains('fault')) ||
                                (filter === 'hit' && log.classList.contains('hit'));
            
            log.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });
    }

    saveConfiguration() {
        const name = prompt('Enter a name for this configuration:');
        if (!name) return;

        const config = {
            numFrames: this.numFramesInput.value,
            referenceString: this.referenceStringInput.value,
            algorithm: this.algorithmSelect.value,
            speed: this.speedInput.value
        };

        if (Storage.saveConfiguration(name, config)) {
            Helpers.showNotification(`Configuration '${name}' saved!`, 'success');
        } else {
            Helpers.showNotification('Failed to save configuration', 'error');
        }
    }

    loadConfiguration() {
        const configs = Storage.getAllConfigurations();
        const names = Object.keys(configs);
        
        if (names.length === 0) {
            Helpers.showNotification('No saved configurations found', 'info');
            return;
        }

        const name = prompt(`Available configurations:\n${names.join('\n')}\n\nEnter name to load:`);
        if (!name) return;

        const config = Storage.loadConfiguration(name);
        if (config) {
            this.numFramesInput.value = config.numFrames;
            this.referenceStringInput.value = config.referenceString;
            this.algorithmSelect.value = config.algorithm;
            this.speedInput.value = config.speed;
            this.speedValue.textContent = `${config.speed}ms`;
            
            Helpers.showNotification(`Configuration '${name}' loaded!`, 'success');
        } else {
            Helpers.showNotification('Configuration not found', 'error');
        }
    }

    loadPreset(presetName) {
        if (!presetName) return;

        const presets = Storage.getPresets();
        const preset = presets[presetName];
        
        if (preset) {
            this.numFramesInput.value = preset.numFrames;
            this.referenceStringInput.value = preset.referenceString;
            this.algorithmSelect.value = preset.algorithm;
            
            Helpers.showNotification(`Preset '${presetName}' loaded!`, 'success');
        }

        this.presetSelect.value = '';
    }

    showShortcuts() {
        const modal = document.getElementById('shortcutsModal');
        const closeBtn = document.getElementById('shortcutsClose');
        
        if (modal) {
            modal.style.display = 'flex';
            
            const handleClose = () => {
                modal.style.display = 'none';
                closeBtn?.removeEventListener('click', handleClose);
                modal.removeEventListener('click', handleOutsideClick);
            };
            
            const handleOutsideClick = (e) => {
                if (e.target === modal) {
                    handleClose();
                }
            };
            
            closeBtn?.addEventListener('click', handleClose);
            modal.addEventListener('click', handleOutsideClick);
        }
    }

    cycleTheme() {
        const themes = ['light', 'dark', 'blue', 'purple'];
        const current = document.documentElement.getAttribute('data-theme');
        const currentIndex = themes.indexOf(current);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        
        document.documentElement.setAttribute('data-theme', nextTheme);
        Storage.saveTheme(nextTheme);
        
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === nextTheme);
        });
        
        Helpers.showNotification(`Theme: ${nextTheme}`, 'info');
    }

    startAutoRun(stepCallback, speed) {
        this.isRunning = true;
        this.updateRunButton(true);
        
        this.autoRunInterval = setInterval(() => {
            const hasMore = stepCallback();
            if (!hasMore) {
                this.stopAutoRun();
            }
        }, speed);
    }

    stopAutoRun() {
        if (this.autoRunInterval) {
            clearInterval(this.autoRunInterval);
            this.autoRunInterval = null;
        }
        this.isRunning = false;
        this.updateRunButton(false);
    }

    updateRunButton(running) {
        if (this.runBtn) {
            if (running) {
                this.runBtn.innerHTML = '<span class="btn-icon">⏸</span><span class="btn-text">Pause</span>';
                this.runBtn.classList.add('running');
            } else {
                this.runBtn.innerHTML = '<span class="btn-icon">▶</span><span class="btn-text">Run Simulation</span>';
                this.runBtn.classList.remove('running');
            }
        }
    }

    setControlsEnabled(enabled) {
        if (this.stepBtn) this.stepBtn.disabled = !enabled;
        if (this.compareBtn) this.compareBtn.disabled = !enabled;
        if (this.numFramesInput) this.numFramesInput.disabled = !enabled;
        if (this.referenceStringInput) this.referenceStringInput.disabled = !enabled;
        if (this.algorithmSelect) this.algorithmSelect.disabled = !enabled;
    }
}

window.Controls = Controls;