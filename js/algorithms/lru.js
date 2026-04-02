/**
 * ========================================
 * LRU PAGE REPLACEMENT ALGORITHM
 * ========================================
 */

class LRUAlgorithm {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.frames = new Array(numFrames).fill(null);
        this.recentUse = [];
        this.pageFaults = 0;
        this.steps = [];
    }

    accessPage(page) {
        const isFault = !this.frames.includes(page);
        let replacedPage = null;
        let replaceIndex = -1;
        
        if (isFault) {
            this.pageFaults++;
            
            if (this.recentUse.length < this.numFrames) {
                const emptyIndex = this.frames.indexOf(null);
                this.frames[emptyIndex] = page;
                replaceIndex = emptyIndex;
            } else {
                const lruPage = this.recentUse[0];
                replaceIndex = this.frames.indexOf(lruPage);
                replacedPage = lruPage;
                this.frames[replaceIndex] = page;
                this.recentUse.shift();
            }
            
            this.recentUse.push(page);
        } else {
            const index = this.recentUse.indexOf(page);
            this.recentUse.splice(index, 1);
            this.recentUse.push(page);
        }

        const step = {
            page,
            fault: isFault,
            frames: [...this.frames],
            recentUse: [...this.recentUse],
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
            algorithm: 'LRU',
            steps: this.steps,
            pageFaults: this.pageFaults,
            frames: this.frames
        };
    }

    reset() {
        this.frames = new Array(this.numFrames).fill(null);
        this.recentUse = [];
        this.pageFaults = 0;
        this.steps = [];
    }

    getState() {
        return {
            frames: [...this.frames],
            recentUse: [...this.recentUse],
            pageFaults: this.pageFaults
        };
    }
}

window.LRUAlgorithm = LRUAlgorithm;