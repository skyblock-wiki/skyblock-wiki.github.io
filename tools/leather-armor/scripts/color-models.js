// Mostly taken from https://css-tricks.com/converting-color-spaces-in-javascript/

/**
 * Converts a hex color to an array of RGB values
 * @param {string} hex hexadecimal color
 * @returns {Array} RGB color `[red, green, blue]`
 */
function hexToRgb(hex) {
    let r = 0,
        g = 0,
        b = 0;

    r = `0x${hex[1]}${hex[2]}`;
    g = `0x${hex[3]}${hex[4]}`;
    b = `0x${hex[5]}${hex[6]}`;

    return [+r, +g, +b];
}

/**
 * Converts an array of RGB values to an array of HSL values
 * @param {number} r red value
 * @param {number} g green value
 * @param {number} b blue value
 * @returns {Array} HSL color `[hue, saturation, lightness]`
 */
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const cMin = Math.min(r, g, b),
        cMax = Math.max(r, g, b),
        delta = cMax - cMin;
    let h = 0,
        s = 0,
        l = 0;

    if (delta === 0) h = 0;
    else if (cMax === r) h = ((g - b) / delta) % 6;
    else if (cMax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;
    l = (cMax + cMin) / 2;

    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
}

const colorInput = document.getElementById('color');

colorInput.addEventListener('input', updateColorsList);

/**
 * Updates the color list
 */
export function updateColorsList() {
    if (!colorInput.value.match(/^#([0-9A-F]{2}){3}/)) return;
    const hexValue = colorInput.value;
    const [, rr, gg, bb] = hexValue.match(/^#(..)(..)(..)$/);
    const [r, g, b] = hexToRgb(hexValue);
    const [h, s, l] = rgbToHsl(r, g, b);

    document.getElementById('color-hex').innerHTML =
        `<span>#</span><span class="red">${rr}</span><span class="green">${gg}</span><span class="blue">${bb}</span>`;
    document.getElementById('color-rgb').innerHTML =
        `<span>rgb(</span><span class="red">${r}</span><span>, </span><span class="green">${g}</span><span>, </span><span class="blue">${b}</span><span>)</span>`;
    document.getElementById('color-hsl').innerHTML =
        `<span>hsl(</span><span class="red">${h}</span><span>, </span><span class="gray">${s}%</span><span>, </span><span class="white">${l}%</span><span>)</span>`;
    document.getElementById('color-int').innerHTML = `<span class="gray">${parseInt(rr.concat(gg, bb), 16)}</span>`;

    document.documentElement.style.setProperty('--hover-color', colorInput.value);
}

updateColorsList();
