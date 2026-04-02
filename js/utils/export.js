/**
 * ========================================
 * EXPORT UTILITIES - COMPLETE
 * ========================================
 */

const ExportUtil = {
    /**
     * Export as JSON
     */
    exportJSON(data, filename = 'simulation.json') {
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, filename, 'application/json');
    },

    /**
     * Export as CSV
     */
    exportCSV(data, filename = 'simulation.csv') {
        let csv = 'Step,Page,Action,';
        
        const numFrames = data.steps[0]?.frames?.length || 0;
        for (let i = 0; i < numFrames; i++) {
            csv += `Frame ${i},`;
        }
        csv += 'Cumulative Faults\n';

        let cumulativeFaults = 0;
        data.steps.forEach((step, index) => {
            cumulativeFaults += step.fault ? 1 : 0;
            csv += `${index + 1},${step.page},${step.fault ? 'FAULT' : 'HIT'},`;
            step.frames.forEach(frame => {
                csv += `${frame === null ? '' : frame},`;
            });
            csv += `${cumulativeFaults}\n`;
        });

        csv += `\nSummary\n`;
        csv += `Total Steps,${data.steps.length}\n`;
        csv += `Page Faults,${data.pageFaults}\n`;
        csv += `Page Hits,${data.steps.length - data.pageFaults}\n`;
        csv += `Hit Ratio,${((data.steps.length - data.pageFaults) / data.steps.length * 100).toFixed(2)}%\n`;

        this.downloadFile(csv, filename, 'text/csv');
    },

    /**
     * Export as Text
     */
    exportText(data, filename = 'simulation.txt') {
        let text = '═══════════════════════════════════════\n';
        text += '  MEMORY MANAGEMENT SIMULATION REPORT\n';
        text += '═══════════════════════════════════════\n\n';

        text += `Algorithm: ${data.algorithm}\n`;
        text += `Date: ${new Date().toLocaleString()}\n`;
        text += `Total Steps: ${data.steps.length}\n\n`;

        text += '───────────────────────────────────────\n';
        text += 'STEP-BY-STEP EXECUTION\n';
        text += '───────────────────────────────────────\n\n';

        data.steps.forEach((step, index) => {
            text += `Step ${index + 1}: Page ${step.page} - ${step.fault ? 'PAGE FAULT' : 'PAGE HIT'}\n`;
            text += `  Frames: [${step.frames.map(f => f === null ? '□' : f).join(', ')}]\n`;
            if (step.replacedPage !== null && step.replacedPage !== undefined) {
                text += `  Replaced: Page ${step.replacedPage}\n`;
            }
            text += '\n';
        });

        text += '───────────────────────────────────────\n';
        text += 'SUMMARY\n';
        text += '───────────────────────────────────────\n\n';
        text += `Total Page Faults: ${data.pageFaults}\n`;
        text += `Total Page Hits: ${data.steps.length - data.pageFaults}\n`;
        text += `Hit Ratio: ${((data.steps.length - data.pageFaults) / data.steps.length * 100).toFixed(2)}%\n`;
        text += `Fault Ratio: ${(data.pageFaults / data.steps.length * 100).toFixed(2)}%\n\n`;

        text += '═══════════════════════════════════════\n';

        this.downloadFile(text, filename, 'text/plain');
    },

    /**
     * Download file helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

window.ExportUtil = ExportUtil;