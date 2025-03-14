/**
 * A global object to store environment configuration variables.
 */
export const environmentConfig = {
    SERVER_HOST: window.config && window.config.SERVER_HOST,
    VITE_REACT_APP_API_ENDPOINT: window.config && window.config.VITE_REACT_APP_API_ENDPOINT,
    VITE_REACT_APP_CLIENT_BASE_URL: window.config && window.config.VITE_REACT_APP_CLIENT_BASE_URL,
    VITE_REACT_APP_ASGARDEO_BASE_URL: window.config && window.config.VITE_REACT_APP_ASGARDEO_BASE_URL,
    VITE_REACT_APP_CLIENT_ID: window.config && window.config.VITE_REACT_APP_CLIENT_ID,
    DISABLED_FEATURES: window.config && window.config.DISABLED_FEATURES
}

/**
 * Checks if a feature is enabled or not based on the DISABLED_FEATURES array.
 * 
 * @param {string} feature 
 * @returns A boolean indicating whether the feature is enabled or not.
 */
export const isFeatureEnabled = (feature) => {    
    return !(environmentConfig.DISABLED_FEATURES || []).includes(feature);
}
