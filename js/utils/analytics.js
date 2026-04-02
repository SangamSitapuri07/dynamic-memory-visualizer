/**
 * ========================================
 * ANALYTICS UTILITIES - COMPLETE
 * ========================================
 */

const Analytics = {
    /**
     * Detect thrashing
     */
    detectThrashing(steps, threshold = 0.7) {
        if (steps.length < 10) return false;
        
        const recentSteps = steps.slice(-10);
        const faultRate = recentSteps.filter(s => s.fault).length / recentSteps.length;
        
        return faultRate >= threshold;
    },

    /**
     * Calculate page access frequency
     */
    calculateAccessFrequency(steps) {
        const frequency = {};
        steps.forEach(step => {
            frequency[step.page] = (frequency[step.page] || 0) + 1;
        });
        return frequency;
    },

    /**
     * Calculate locality of reference score
     */
    calculateLocalityScore(steps) {
        if (steps.length < 2) return 0;
        
        let repeats = 0;
        for (let i = 1; i < steps.length; i++) {
            if (steps[i].page === steps[i - 1].page) {
                repeats++;
            }
        }
        
        return (repeats / (steps.length - 1)) * 100;
    },

    /**
     * Calculate working set size
     */
    calculateWorkingSet(steps, windowSize = 10) {
        if (steps.length < windowSize) return new Set(steps.map(s => s.page)).size;
        
        const window = steps.slice(-windowSize);
        return new Set(window.map(s => s.page)).size;
    },

    /**
     * Get page fault distribution
     */
    getFaultDistribution(steps) {
        const distribution = [];
        let cumulativeFaults = 0;
        
        steps.forEach((step, index) => {
            if (step.fault) cumulativeFaults++;
            distribution.push({
                step: index + 1,
                faults: cumulativeFaults,
                rate: cumulativeFaults / (index + 1)
            });
        });
        
        return distribution;
    },

    /**
     * Compare algorithms
     */
    compareAlgorithms(results) {
        const comparison = {};
        
        Object.keys(results).forEach(algo => {
            const result = results[algo];
            comparison[algo] = {
                pageFaults: result.pageFaults,
                pageHits: result.steps.length - result.pageFaults,
                hitRatio: ((result.steps.length - result.pageFaults) / result.steps.length * 100).toFixed(2),
                faultRatio: (result.pageFaults / result.steps.length * 100).toFixed(2)
            };
        });
        
        return comparison;
    },

    /**
     * Predict future performance
     */
    predictPerformance(steps, futureSteps = 10) {
        if (steps.length < 5) return null;
        
        const recentFaultRate = steps.slice(-10).filter(s => s.fault).length / Math.min(10, steps.length);
        const predictedFaults = Math.round(futureSteps * recentFaultRate);
        
        return {
            predictedFaults,
            predictedHits: futureSteps - predictedFaults,
            confidence: steps.length >= 20 ? 'high' : steps.length >= 10 ? 'medium' : 'low'
        };
    }
};

window.Analytics = Analytics;