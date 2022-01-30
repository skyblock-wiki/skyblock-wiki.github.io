export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

export function loadFromLocalStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(error);
    }
}
