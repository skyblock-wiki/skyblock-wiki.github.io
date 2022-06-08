import { Toast } from '../../../scripts/toast.js';
import { colorPicker, showHideMenu } from './index.js';

/**
 * Loads color from color model
 * @param {Event} event the event
 */
export function loadColorFromModel(event) {
    if (event) event.preventDefault();

    const input = document.getElementById('color-import');
    const isRGB = document.querySelector('.color-model #option1').checked;

    if (isRGB) {
        const rgbRegex = /(\d{0,3}),\s*(\d{0,3}),\s*(\d{0,3})/;

        if (input.value.trim().length === 0) new Toast({ message: 'Empty input!', type: 'error', time: 2000 }).show();
        else if (input.value.match(rgbRegex)) {
            const [, r, g, b] = input.value.match(rgbRegex);

            if (Number(r) < 256 && Number(g) < 256 && Number(b) < 256) {
                document.getElementById('color').value = rgbToHex(r, g, b);
                showHideMenu(document.querySelector('.imports-list'));
                colorPicker.color.hexString = rgbToHex(r, g, b);
                input.value = '';
            } else new Toast({ message: 'Invalid RGB color format!', type: 'error', time: 2000 }).show();
        } else new Toast({ message: 'Invalid RGB color format!', type: 'error', time: 2000 }).show();
    } else if (input.value.trim().length === 0) new Toast({ message: 'Input box empty.', type: 'error', time: 2000 }).show();
    else if (!isNaN(Number(input.value)) && Number(input.value) <= 16777215 && Number(input.value) >= 0) {
        document.getElementById('color').value = intToHex(input.value);
        showHideMenu(document.querySelector('.imports-list'));
        colorPicker.color.hexString = intToHex(input.value);
        input.value = '';
    } else new Toast({ message: 'Invalid color integer value!', type: 'error', time: 2000 }).show();
}

/**
 * Converts an array of RGB values to a hexadecimal string
 * @param {number} r red value
 * @param {number} g green value
 * @param {number} b blue value
 * @returns {string} hexadecimal string
 */
function rgbToHex(r, g, b) {
    r = Number(r).toString(16);
    g = Number(g).toString(16);
    b = Number(b).toString(16);
    if (r.length === 1) r = `0${r}`;
    if (g.length === 1) g = `0${g}`;
    if (b.length === 1) b = `0${b}`;

    return `#${r}${g}${b}`.toUpperCase();
}

/**
 * Converts an integer to hexadecimal
 * @param {string|number} int integer to convert
 * @returns {string} hexadecimal string
 */
function intToHex(int) {
    let ret = Number(int).toString(16);

    while (ret.length < 6) ret = `0${ret}`;
    ret = `#${ret.toUpperCase()}`;

    return ret;
}

/**
 * Updates the color import placeholder
 * @param {HTMLElement} element the element to update the placeholder for
 */
export function updatePlaceholder(element) {
    let isRGB;

    if (element) isRGB = element.getAttribute('id') === 'button-model-rgb';
    else isRGB = document.querySelector('.color-model #option1').checked;
    document.getElementById('color-import').placeholder = `e.g. ${isRGB ? '255,255,255' : '16777215'}`;
}
