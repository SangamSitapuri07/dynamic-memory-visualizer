/**
 * ========================================
 * DASHBOARD COMPONENT - FIXED VERSION
 * ========================================
 */

class Dashboard {
    constructor() {
        this.miniCharts = {};
        this.performanceHistory = [];
        this.performanceChart = null;
        this.accessPatternChart = null;
        this.initializeMiniCharts();
    }

    initializeMiniCharts() {
        const chartIds = ['miniChart1', 'miniChart2', 'miniChart3'];
        
        chartIds.forEach((id, index) => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                this.miniCharts[id] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: [{
                            data: [],
                            borderColor: this.getChartColor(index),
                            backgroundColor: this.getChartColor(index, 0.1),
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true,
                            pointRadius: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            }
        });
    }

    getChartColor(index, alpha = 1) {
        const colors = [
            `rgba(102, 126, 234, ${alpha})`,
            `rgba(239, 68, 68, ${alpha})`,
            `rgba(16, 185, 129, ${alpha})`
        ];
        return colors[index] || colors[0];
    }

    updateStats(stats) {
        document.getElementById('currentStep').textContent = stats.currentStep || 0;
        document.getElementById('totalSteps').textContent = stats.totalSteps || 0;
        document.getElementById('pageFaults').textContent = stats.pageFaults || 0;
        document.getElementById('pageHits').textContent = stats.pageHits || 0;
        document.getElementById('hitRatio').textContent = `${stats.hitRatio || 0}%`;

        if (stats.faultChange !== undefined) {
            document.getElementById('faultChange').textContent = stats.faultChange;
        }
        if (stats.hitChange !== undefined) {
            document.getElementById('hitChange').textContent = stats.hitChange;
        }
        if (stats.ratioChange !== undefined) {
            document.getElementById('ratioChange').textContent = stats.ratioChange;
        }

        const ratioProgress = document.getElementById('ratioProgress');
        if (ratioProgress) {
            ratioProgress.style.width = `${stats.hitRatio || 0}%`;
        }

        this.updatePerformanceIndicator(stats.hitRatio || 0);
        this.updateMiniCharts(stats);
    }

    updatePerformanceIndicator(hitRatio) {
        const perfFill = document.getElementById('perfFill');
        const perfValue = document.getElementById('perfValue');
        
        if (perfFill && perfValue) {
            perfFill.style.width = `${hitRatio}%`;
            perfValue.textContent = `${hitRatio.toFixed(1)}%`;
        }
    }

    updateMiniCharts(stats) {
        this.performanceHistory.push(stats);
        
        if (this.performanceHistory.length > 20) {
            this.performanceHistory.shift();
        }

        const labels = this.performanceHistory.map((_, i) => i + 1);

        if (this.miniCharts['miniChart1']) {
            this.miniCharts['miniChart1'].data.labels = labels;
            this.miniCharts['miniChart1'].data.datasets[0].data = 
                this.performanceHistory.map(s => s.currentStep);
            this.miniCharts['miniChart1'].update('none');
        }

        if (this.miniCharts['miniChart2']) {
            this.miniCharts['miniChart2'].data.labels = labels;
            this.miniCharts['miniChart2'].data.datasets[0].data = 
                this.performanceHistory.map(s => s.pageFaults);
            this.miniCharts['miniChart2'].update('none');
        }

        if (this.miniCharts['miniChart3']) {
            this.miniCharts['miniChart3'].data.labels = labels;
            this.miniCharts['miniChart3'].data.datasets[0].data = 
                this.performanceHistory.map(s => s.pageHits);
            this.miniCharts['miniChart3'].update('none');
        }
    }

    /**
     * Create performance chart - FIXED VERSION
     */
    createPerformanceChart(result) {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        const faultDistribution = Analytics.getFaultDistribution(result.steps);

        this.performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: faultDistribution.map(d => d.step),
                datasets: [{
                    label: 'Fault Rate',
                    data: faultDistribution.map(d => d.rate * 100),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Fault Rate: ${context.parsed.y.toFixed(2)}%`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => `${value}%`
                        },
                        title: {
                            display: true,
                            text: 'Fault Rate (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Step Number'
                        },
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        });
    }

    /**
     * Create access pattern chart - FIXED VERSION
     */
    createAccessPatternChart(result) {
        const canvas = document.getElementById('accessPatternChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (this.accessPatternChart) {
            this.accessPatternChart.destroy();
        }

        const frequency = Analytics.calculateAccessFrequency(result.steps);
        const pages = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
        
        const topPages = pages.slice(0, 10);
        const counts = topPages.map(page => frequency[page]);

        this.accessPatternChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topPages.map(p => `Page ${p}`),
                datasets: [{
                    label: 'Access Count',
                    data: counts,
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Top 10 Most Accessed Pages',
                        font: { size: 14 }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        },
                        title: {
                            display: true,
                            text: 'Number of Accesses'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Page Number'
                        }
                    }
                }
            }
        });
    }

    checkThrashing(result) {
        const indicator = document.getElementById('thrashingIndicator');
        if (!indicator) return;

        const isThrashing = Analytics.detectThrashing(result.steps);
        
        if (isThrashing) {
            indicator.style.display = 'flex';
            indicator.classList.add('attention');
        } else {
            indicator.style.display = 'none';
        }
    }

    reset() {
        this.performanceHistory = [];
        
        this.updateStats({
            currentStep: 0,
            totalSteps: 0,
            pageFaults: 0,
            pageHits: 0,
            hitRatio: 0
        });

        Object.values(this.miniCharts).forEach(chart => {
            if (chart) {
                chart.data.labels = [];
                chart.data.datasets[0].data = [];
                chart.update('none');
            }
        });

        const indicator = document.getElementById('thrashingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }
}

window.Dashboard = Dashboard;