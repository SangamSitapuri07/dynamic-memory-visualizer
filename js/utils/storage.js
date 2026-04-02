/**
 * ========================================
 * LOCAL STORAGE MANAGEMENT - COMPLETE
 * ========================================
 */

const Storage = {
    /**
     * Save configuration to local storage
     */
    saveConfiguration(name, config) {
        try {
            const configurations = this.getAllConfigurations();
            configurations[name] = {
                ...config,
                savedAt: new Date().toISOString()
            };
            localStorage.setItem('memorySimConfigs', JSON.stringify(configurations));
            return true;
        } catch (error) {
            console.error('Error saving configuration:', error);
            return false;
        }
    },

    /**
     * Load configuration from local storage
     */
    loadConfiguration(name) {
        try {
            const configurations = this.getAllConfigurations();
            return configurations[name] || null;
        } catch (error) {
            console.error('Error loading configuration:', error);
            return null;
        }
    },

    /**
     * Get all saved configurations
     */
    getAllConfigurations() {
        try {
            const configs = localStorage.getItem('memorySimConfigs');
            return configs ? JSON.parse(configs) : {};
        } catch (error) {
            console.error('Error getting configurations:', error);
            return {};
        }
    },

    /**
     * Delete configuration
     */
    deleteConfiguration(name) {
        try {
            const configurations = this.getAllConfigurations();
            delete configurations[name];
            localStorage.setItem('memorySimConfigs', JSON.stringify(configurations));
            return true;
        } catch (error) {
            console.error('Error deleting configuration:', error);
            return false;
        }
    },

    /**
     * Save theme preference
     */
    saveTheme(theme) {
        localStorage.setItem('memorySimTheme', theme);
    },

    /**
     * Load theme preference
     */
    loadTheme() {
        return localStorage.getItem('memorySimTheme') || 'light';
    },

    /**
     * Increment simulation counter
     */
    incrementSimCount() {
        const count = this.getSimCount();
        localStorage.setItem('memorySimCount', count + 1);
        return count + 1;
    },

    /**
     * Get simulation count
     */
    getSimCount() {
        return parseInt(localStorage.getItem('memorySimCount') || '0');
    },

    /**
     * Get presets
     */
    getPresets() {
        return {
            simple: {
                numFrames: 3,
                referenceString: '1,2,3,4,1,2,5',
                algorithm: 'fifo'
            },
            belady: {
                numFrames: 3,
                referenceString: '1,2,3,4,1,2,5,1,2,3,4,5',
                algorithm: 'fifo'
            },
            locality: {
                numFrames: 4,
                referenceString: '1,2,1,2,1,2,3,4,3,4,3,4',
                algorithm: 'lru'
            },
            thrashing: {
                numFrames: 2,
                referenceString: '1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10',
                algorithm: 'fifo'
            },
            optimal: {
                numFrames: 3,
                referenceString: '7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0',
                algorithm: 'optimal'
            }
        };
    }
};

window.Storage = Storage;