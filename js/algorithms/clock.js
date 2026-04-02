/**
 * ========================================
 * CLOCK (SECOND CHANCE) ALGORITHM
 * ========================================
 */

class ClockAlgorithm {
    constructor(numFrames) {
        this.numFrames = numFrames;
        this.frames = new Array(numFrames).fill(null);
        this.referenceBits = new Array(numFrames).fill(0);
        this.hand = 0;
        this.pageFaults = 0;
        this.steps = [];
    }

    findVictim() {
        while (true) {
            if (this.referenceBits[this.hand] === 0) {
                const victim = this.hand;
                this.hand = (this.hand + 1) % this.numFrames;
                return victim;
            }
            
            this.referenceBits[this.hand] = 0;
            this.hand = (this.hand + 1) % this.numFrames;
        }
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
                this.referenceBits[emptyIndex] = 1;
                replaceIndex = emptyIndex;
            } else {
                replaceIndex = this.findVictim();
                replacedPage = this.frames[replaceIndex];
                this.frames[replaceIndex] = page;
                this.referenceBits[replaceIndex] = 1;
            }
        } else {
            this.referenceBits[pageIndex] = 1;
        }

        const step = {
            page,
            fault: isFault,
            frames: [...this.frames],
            referenceBits: [...this.referenceBits],
            hand: this.hand,
            replacedPage,
            replaceIndex,
            algorithm: 'clock'
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
            algorithm: 'Clock',
            steps: this.steps,
            pageFaults: this.pageFaults,
            frames: this.frames
        };
    }

    reset() {
        this.frames = new Array(this.numFrames).fill(null);
        this.referenceBits = new Array(this.numFrames).fill(0);
        this.hand = 0;
        this.pageFaults = 0;
        this.steps = [];
    }

    getState() {
        return {
            frames: [...this.frames],
            referenceBits: [...this.referenceBits],
            hand: this.hand,
            pageFaults: this.pageFaults
        };
    }
}

window.ClockAlgorithm = ClockAlgorithm;