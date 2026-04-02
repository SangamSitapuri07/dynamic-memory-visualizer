/**
 * ========================================
 * HEATMAP COMPONENT
 * ========================================
 */

class HeatMap {
    constructor() {
        this.canvas = document.getElementById('heatmapCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.data = null;
    }

    generate(result) {
        if (!this.ctx) return;

        const frequency = Analytics.calculateAccessFrequency(result.steps);
        const pages = Object.keys(frequency).map(Number).sort((a, b) => a - b);
        const maxFrequency = Math.max(...Object.values(frequency));

        this.data = { frequency, pages, maxFrequency };
        this.render();
    }

    render() {
        if (!this.data || !this.ctx) return;

        const { frequency, pages, maxFrequency } = this.data;
        
        const cols = Math.ceil(Math.sqrt(pages.length));
        const rows = Math.ceil(pages.length / cols);
        const cellSize = 60;
        const padding = 10;

        this.canvas.width = cols * (cellSize + padding);
        this.canvas.height = rows * (cellSize + padding);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        pages.forEach((page, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = col * (cellSize + padding);
            const y = row * (cellSize + padding);

            const accessCount = frequency[page];
            const intensity = accessCount / maxFrequency;

            this.ctx.fillStyle = this.getHeatColor(intensity);
            this.ctx.fillRect(x, y, cellSize, cellSize);

            this.ctx.strokeStyle = '#e5e7eb';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, cellSize, cellSize);

            this.ctx.fillStyle = intensity > 0.5 ? '#ffffff' : '#111827';
            this.ctx.font = 'bold 18px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(page, x + cellSize / 2, y + cellSize / 2 - 8);

            this.ctx.font = '12px Inter';
            this.ctx.fillText(`${accessCount}x`, x + cellSize / 2, y + cellSize / 2 + 10);
        });
    }

    getHeatColor(intensity) {
        const r = Math.floor(102 + (255 - 102) * (1 - intensity));
        const g = Math.floor(126 + (255 - 126) * (1 - intensity));
        const b = Math.floor(234 + (255 - 234) * (1 - intensity));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    clear() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        this.data = null;
    }
}

window.HeatMap = HeatMap;