/**
 * ========================================
 * OPTIMAL PAGE REPLACEMENT ALGORITHM
 * ========================================
 */

class OptimalAlgorithm {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.frames = new Array(numFrames).fill(null);
        this.pageFaults = 0;
        this.steps = [];
        this.futureReferences = [];
    }

    findOptimalReplacement(currentIndex) {
        let farthest = currentIndex;
        let replaceIndex = -1;

        for (let i = 0; i < this.frames.length; i++) {
            let j;
            
            for (j = currentIndex; j < this.futureReferences.length; j++) {
                if (this.frames[i] === this.futureReferences[j]) {
                    if (j > farthest) {
                        farthest = j;
                        replaceIndex = i;
                    }
                    break;
                }
            }

            if (j === this.futureReferences.length) {
                return i;
            }
        }

        return replaceIndex === -1 ? 0 : replaceIndex;
    }

    accessPage(page, currentIndex) {
        const isFault = !this.frames.includes(page);
        let replacedPage = null;
        let replaceIndex = -1;
        
        if (isFault) {
            this.pageFaults++;
            
            if (this.frames.includes(null)) {
                const emptyIndex = this.frames.indexOf(null);
                this.frames[emptyIndex] = page;
                replaceIndex = emptyIndex;
            } else {
                replaceIndex = this.findOptimalReplacement(currentIndex + 1);
                replacedPage = this.frames[replaceIndex];
                this.frames[replaceIndex] = page;
            }
        }

        const step = {
            page,
            fault: isFault,
            frames: [...this.frames],
            replacedPage,
            replaceIndex,
            algorithm: 'optimal'
        };

        this.steps.push(step);
        return step;
    }

    simulate(referenceString) {
        this.reset();
        this.futureReferences = referenceString;
        
        referenceString.forEach((page, index) => {
            this.accessPage(page, index);
        });

        return {
            algorithm: 'Optimal',
            steps: this.steps,
            pageFaults: this.pageFaults,
            frames: this.frames
        };
    }

    reset() {
        this.frames = new Array(this.numFrames).fill(null);
        this.pageFaults = 0;
        this.steps = [];
        this.futureReferences = [];
    }

    getState() {
        return {
            frames: [...this.frames],
            pageFaults: this.pageFaults
        };
    }
}

window.OptimalAlgorithm = OptimalAlgorithm;