/**
 * Saves an item to local storage
 * @param {string} key the key to save the item under
 * @param {string} value the value to save
 */
export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Loads an item from the local storage
 * @param {string} key the key of the item to load
 * @returns {string} the value of the item
 */
export function loadFromLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(error); // eslint-disable-line no-console
    }
}
