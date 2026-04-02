/**
 * ========================================
 * FIFO PAGE REPLACEMENT ALGORITHM
 * ========================================
 */

class FIFOAlgorithm {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.frames = new Array(numFrames).fill(null);
        this.queue = [];
        this.pageFaults = 0;
        this.steps = [];
    }

    accessPage(page) {
        const isFault = !this.frames.includes(page);
        let replacedPage = null;
        let replaceIndex = -1;
        
        if (isFault) {
            this.pageFaults++;
            
            if (this.queue.length < this.numFrames) {
                const emptyIndex = this.frames.indexOf(null);
                this.frames[emptyIndex] = page;
                this.queue.push(page);
                replaceIndex = emptyIndex;
            } else {
                const oldestPage = this.queue.shift();
                replaceIndex = this.frames.indexOf(oldestPage);
                replacedPage = oldestPage;
                this.frames[replaceIndex] = page;
                this.queue.push(page);
            }
        }

        const step = {
            page,
            fault: isFault,
            frames: [...this.frames],
            queue: [...this.queue],
            replacedPage,
            replaceIndex
        };

        this.steps.push(step);
        return step;
    }

    simulate(referenceString) {
        this.reset();
        
        referenceString.forEach(page => {
            this.accessPage(page);
        });

        return {
            algorithm: 'FIFO',
            steps: this.steps,
            pageFaults: this.pageFaults,
            frames: this.frames
        };
    }

    reset() {
        this.frames = new Array(this.numFrames).fill(null);
        this.queue = [];
        this.pageFaults = 0;
        this.steps = [];
    }

    getState() {
        return {
            frames: [...this.frames],
            queue: [...this.queue],
            pageFaults: this.pageFaults
        };
    }
}

window.FIFOAlgorithm = FIFOAlgorithm;