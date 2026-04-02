/**
 * ========================================
 * ENHANCED VISUALIZATION COMPONENT
 * ========================================
 */

class Visualizer {
    constructor() {
        this.framesContainer = document.getElementById('framesContainer');
        this.timeline = document.getElementById('timeline');
        this.logContainer = document.getElementById('logContainer');
        this.currentPageElement = document.getElementById('currentPage');
        this.pageStatusElement = document.getElementById('pageStatus');
        this.currentAlgorithmElement = document.getElementById('currentAlgorithm');
        this.tableBody = document.getElementById('tableBody');
        this.comparisonChart = null;
        this.heatMap = new HeatMap();
    }

    initializeFrames(numFrames) {
        this.framesContainer.innerHTML = '';
        
        for (let i = 0; i < numFrames; i++) {
            const frame = document.createElement('div');
            frame.className = 'frame';
            frame.innerHTML = `
                <div class="frame-label">Frame ${i}</div>
                <div class="frame-content" id="frame-${i}"></div>
            `;
            this.framesContainer.appendChild(frame);
        }
    }

    updateFrames(frames, isFault = false, highlightIndex = -1) {
        frames.forEach((page, index) => {
            const frameContent = document.getElementById(`frame-${index}`);
            if (!frameContent) return;
            
            frameContent.innerHTML = '';
            
            if (page !== null) {
                const pageElement = document.createElement('div');
                pageElement.className = 'frame-page';
                
                if (index === highlightIndex) {
                    if (isFault) {
                        pageElement.classList.add('highlight-fault');
                    } else {
                        pageElement.classList.add('highlight-hit');
                    }
                }
                
                pageElement.textContent = page;
                frameContent.appendChild(pageElement);
            }
        });
    }

    updateCurrentPage(page, isFault, algorithm = '') {
        if (this.currentPageElement) {
            this.currentPageElement.textContent = page;
        }
        
        if (this.pageStatusElement) {
            this.pageStatusElement.textContent = isFault ? 'PAGE FAULT' : 'PAGE HIT';
            this.pageStatusElement.className = `page-status ${isFault ? 'fault' : 'hit'}`;
        }

        if (this.currentAlgorithmElement && algorithm) {
            this.currentAlgorithmElement.textContent = algorithm;
        }
    }

    buildTimeline(steps) {
        this.timeline.innerHTML = '';
        
        steps.forEach((step, index) => {
            const timelineStep = document.createElement('div');
            timelineStep.className = `timeline-step ${step.fault ? 'fault' : 'hit'}`;
            timelineStep.innerHTML = `
                <div class="timeline-step-number">${step.page}</div>
                <div class="timeline-step-label">${step.fault ? 'Fault' : 'Hit'}</div>
            `;
            timelineStep.dataset.step = index;
            timelineStep.addEventListener('click', () => this.onTimelineStepClick(index));
            this.timeline.appendChild(timelineStep);
        });
    }

    onTimelineStepClick(stepIndex) {
        const event = new CustomEvent('timeline-step-click', { detail: { stepIndex } });
        document.dispatchEvent(event);
    }

    highlightTimelineStep(stepIndex) {
        const steps = this.timeline.querySelectorAll('.timeline-step');
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        const activeStep = steps[stepIndex];
        if (activeStep) {
            activeStep.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest', 
                inline: 'center' 
            });
        }
    }

    buildTable(steps, numFrames) {
        if (!this.tableBody) return;

        this.tableBody.innerHTML = '';

        const table = document.getElementById('dataTable');
        if (table) {
            const thead = table.querySelector('thead tr');
            thead.innerHTML = '<th>Step</th><th>Page</th><th>Action</th>';
            for (let i = 0; i < numFrames; i++) {
                thead.innerHTML += `<th>Frame ${i}</th>`;
            }
            thead.innerHTML += '<th>Faults</th>';
        }

        let cumulativeFaults = 0;
        steps.forEach((step, index) => {
            if (step.fault) cumulativeFaults++;

            const row = document.createElement('tr');
            row.className = step.fault ? 'fault' : 'hit';
            
            let html = `
                <td><strong>${index + 1}</strong></td>
                <td>${step.page}</td>
                <td><span class="page-status ${step.fault ? 'fault' : 'hit'}">${step.fault ? 'FAULT' : 'HIT'}</span></td>
            `;

            step.frames.forEach(frame => {
                html += `<td>${frame === null ? '-' : frame}</td>`;
            });

            html += `<td><strong>${cumulativeFaults}</strong></td>`;
            row.innerHTML = html;
            this.tableBody.appendChild(row);
        });
    }

    addLogEntry(step, stepNumber) {
        const emptyState = this.logContainer.querySelector('.log-empty');
        if (emptyState) {
            emptyState.remove();
        }

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${step.fault ? 'fault' : 'hit'} fade-in`;
        
        const timestamp = new Date().toLocaleTimeString();
        const framesDisplay = step.frames.map(f => f === null ? '□' : f).join(', ');
        
        let detailText = '';
        if (step.replacedPage !== null && step.replacedPage !== undefined) {
            detailText = `<br>Replaced page ${step.replacedPage} at frame ${step.replaceIndex}`;
        }
        
        logEntry.innerHTML = `
            <div class="log-entry-header">
                <span>Step ${stepNumber}: Page ${step.page}</span>
                <span>${timestamp}</span>
            </div>
            <div class="log-entry-content">
                <strong>${step.fault ? '❌ PAGE FAULT' : '✓ PAGE HIT'}</strong>
                ${detailText}
                <br>Frames: [${framesDisplay}]
            </div>
        `;
        
        this.logContainer.appendChild(logEntry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    clearLog() {
        this.logContainer.innerHTML = `
            <div class="log-empty">
                <div class="empty-icon">📋</div>
                <div class="empty-text">Run a simulation to see execution logs</div>
            </div>
        `;
    }

    createComparisonChart(results) {
        const canvas = document.getElementById('comparisonChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }

        const algorithms = Object.keys(results);
        const datasets = algorithms.map((algo, index) => {
            const result = results[algo];
            const faults = this.calculateCumulativeFaults(result.steps);
            const colors = [
                { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
                { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
                { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
                { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' }
            ];
            const color = colors[index % colors.length];

            return {
                label: `${algo.toUpperCase()} (${result.pageFaults} faults)`,
                data: faults,
                borderColor: color.border,
                backgroundColor: color.bg,
                borderWidth: 3,
                tension: 0.4,
                fill: true
            };
        });

        const labels = results[algorithms[0]].steps.map((_, i) => i + 1);

        this.comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Algorithm Performance Comparison',
                        font: { size: 18, weight: 'bold' }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cumulative Page Faults'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Step Number'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        this.displayComparisonStats(results);
        this.displayWinner(results);
    }

    calculateCumulativeFaults(steps) {
        let cumulative = 0;
        return steps.map(step => {
            if (step.fault) cumulative++;
            return cumulative;
        });
    }

    displayComparisonStats(results) {
        const statsContainer = document.getElementById('comparisonStats');
        if (!statsContainer) return;

        statsContainer.innerHTML = '';

        Object.keys(results).forEach(algo => {
            const result = results[algo];
            const totalSteps = result.steps.length;
            const hitRatio = ((totalSteps - result.pageFaults) / totalSteps * 100).toFixed(1);
            
            const statItem = document.createElement('div');
            statItem.className = 'comparison-stat-item';
            statItem.innerHTML = `
                <div class="comparison-stat-label">${algo.toUpperCase()}</div>
                <div class="comparison-stat-value">${result.pageFaults}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">
                    Hit Ratio: ${hitRatio}%
                </div>
            `;
            statsContainer.appendChild(statItem);
        });
    }

    displayWinner(results) {
        const winnerCard = document.getElementById('winnerCard');
        const winnerName = document.getElementById('winnerName');
        const winnerStats = document.getElementById('winnerStats');

        if (!winnerCard || !winnerName || !winnerStats) return;

        let minFaults = Infinity;
        let winner = '';
        
        Object.keys(results).forEach(algo => {
            if (results[algo].pageFaults < minFaults) {
                minFaults = results[algo].pageFaults;
                winner = algo;
            }
        });

        const winnerResult = results[winner];
        const totalSteps = winnerResult.steps.length;
        const hitRatio = ((totalSteps - minFaults) / totalSteps * 100).toFixed(1);

        winnerName.textContent = winner.toUpperCase();
        winnerStats.innerHTML = `
            ${minFaults} page faults | ${hitRatio}% hit ratio
        `;

        winnerCard.classList.add('scale-in');
    }

    generateHeatMap(result) {
        this.heatMap.generate(result);
    }

    reset() {
        this.framesContainer.innerHTML = '';
        this.timeline.innerHTML = '';
        this.clearLog();
        
        if (this.currentPageElement) {
            this.currentPageElement.textContent = '-';
        }
        if (this.pageStatusElement) {
            this.pageStatusElement.textContent = '';
        }
        if (this.currentAlgorithmElement) {
            this.currentAlgorithmElement.textContent = '-';
        }
        
        if (this.tableBody) {
            this.tableBody.innerHTML = '<tr><td colspan="7" class="table-empty">Run a simulation to see data</td></tr>';
        }

        this.heatMap.clear();
    }
}

window.Visualizer = Visualizer;