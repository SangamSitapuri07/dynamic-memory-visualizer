/**
 * ========================================
 * NFU (NOT FREQUENTLY USED) ALGORITHM
 * ========================================
 */

class NFUAlgorithm {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.frames = new Array(numFrames).fill(null);
        this.counters = new Array(numFrames).fill(0);
        this.pageFaults = 0;
        this.steps = [];
    }

    findLFU() {
        let minCounter = Infinity;
        let lfuIndex = 0;

        for (let i = 0; i < this.numFrames; i++) {
            if (this.counters[i] < minCounter) {
                minCounter = this.counters[i];
                lfuIndex = i;
            }
        }

        return lfuIndex;
    }

    accessPage(page) {
        const pageIndex = this.frames.indexOf(page);
        const isFault = pageIndex === -1;
        let replacedPage = null;
        let replaceIndex = -1;
        
        if (isFault) {
            this.pageFaults++;
            
            if (this.frames.includes(null)) {
                const emptyIndex = this.frames.indexOf(null);
                this.frames[emptyIndex] = page;
                this.counters[emptyIndex] = 1;
                replaceIndex = emptyIndex;
            } else {
                replaceIndex = this.findLFU();
                replacedPage = this.frames[replaceIndex];
                this.frames[replaceIndex] = page;
                this.counters[replaceIndex] = 1;
            }
        } else {
            this.counters[pageIndex]++;
        }

        const step = {
            page,
            fault: isFault,
            frames: [...this.frames],
            counters: [...this.counters],
            replacedPage,
            replaceIndex,
            algorithm: 'nfu'
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
            algorithm: 'NFU',
            steps: this.steps,
            pageFaults: this.pageFaults,
            frames: this.frames
        };
    }

    reset() {
        this.frames = new Array(this.numFrames).fill(null);
        this.counters = new Array(this.numFrames).fill(0);
        this.pageFaults = 0;
        this.steps = [];
    }

    getState() {
        return {
            frames: [...this.frames],
            counters: [...this.counters],
            pageFaults: this.pageFaults
        };
    }
}

window.NFUAlgorithm = NFUAlgorithm;