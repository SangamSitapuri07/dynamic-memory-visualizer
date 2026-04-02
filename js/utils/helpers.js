/**
 * ========================================
 * HELPER UTILITIES - COMPLETE
 * ========================================
 */

const Helpers = {
    /**
     * Parse reference string input into array of numbers
     */
    parseReferenceString(input) {
        try {
            const pages = input
                .split(',')
                .map(s => s.trim())
                .filter(s => s !== '')
                .map(Number);

            if (pages.some(isNaN)) {
                throw new Error('Invalid page numbers');
            }

            return pages;
        } catch (error) {
            console.error('Error parsing reference string:', error);
            return null;
        }
    },

    /**
     * Validate input parameters
     */
    validateInput(numFrames, pages) {
        if (!numFrames || numFrames < 1 || numFrames > 10) {
            return {
                success: false,
                message: 'Number of frames must be between 1 and 10'
            };
        }

        if (!pages || pages.length === 0) {
            return {
                success: false,
                message: 'Please enter a valid page reference string'
            };
        }

        if (pages.some(p => p < 0 || p > 99)) {
            return {
                success: false,
                message: 'Page numbers must be between 0 and 99'
            };
        }

        return {
            success: true,
            message: 'Valid input'
        };
    },

    /**
     * Show notification message
     */
    showNotification(message, type = 'info') {
        const existing = document.querySelectorAll('.toast');
        existing.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type} fade-in`;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6',
            warning: '#f59e0b'
        };

        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div style="font-size: 1.25rem; font-weight: bold;">${icons[type]}</div>
                <div style="flex: 1;">${message}</div>
            </div>
        `;

        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            min-width: 300px;
            padding: 1rem 1.5rem;
            background: var(--bg-primary);
            color: var(--text-primary);
            border-left: 4px solid ${colors[type]};
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-weight: 500;
        `;

        const container = document.getElementById('toastContainer') || document.body;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'all 0.3s ease-out';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Calculate statistics from simulation results
     */
    calculateStats(result) {
        const totalSteps = result.steps.length;
        const pageFaults = result.pageFaults;
        const pageHits = totalSteps - pageFaults;
        const hitRatio = totalSteps > 0 ? ((pageHits / totalSteps) * 100).toFixed(1) : 0;

        return {
            totalSteps,
            pageFaults,
            pageHits,
            hitRatio
        };
    },

    /**
     * Deep clone an array
     */
    cloneArray(arr) {
        return JSON.parse(JSON.stringify(arr));
    },

    /**
     * Format timestamp
     */
    getTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString();
    },

    /**
     * Export data as JSON file
     */
    exportJSON(data, filename = 'simulation-results.json') {
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export data as CSV file
     */
    exportCSV(data, filename = 'simulation-log.csv') {
        let csv = 'Step,Page,Action,Frames\n';
        
        data.steps.forEach((step, index) => {
            const frames = step.frames.map(f => f === null ? 'empty' : f).join('|');
            csv += `${index + 1},${step.page},${step.fault ? 'FAULT' : 'HIT'},"${frames}"\n`;
        });

        csv += `\nTotal Steps,${data.steps.length}\n`;
        csv += `Page Faults,${data.pageFaults}\n`;
        csv += `Page Hits,${data.steps.length - data.pageFaults}\n`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Generate random reference string
     */
    generateRandomReference(length = 20, maxPage = 9) {
        const pages = [];
        for (let i = 0; i < length; i++) {
            pages.push(Math.floor(Math.random() * (maxPage + 1)));
        }
        return pages.join(',');
    }
};

window.Helpers = Helpers;