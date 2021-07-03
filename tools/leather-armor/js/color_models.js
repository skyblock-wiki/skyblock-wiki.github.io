// Mostly taken from https://css-tricks.com/converting-color-spaces-in-javascript/

function hexToRGB(hex) {
    let r = 0,
        g = 0,
        b = 0;
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
    return [+r, +g, +b];
    //return "rgb(" + +r + "," + +g + "," + +b + ")";
}

function RGBToHSL(r, g, b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
        h = 0;
    // Red is max
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
        h = (b - r) / delta + 2;
    // Blue is max
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
        h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return [h, s, l];
    //return "hsl(" + h + "," + s + "%," + l + "%)";
}
// console.log('test');
$('#color').on('input', updateColorsList);
export function updateColorsList() {
    if (!$('#color').val().match(/^#([0-9A-F]{2}){3}/)) return;
    let hexValue = $('#color').val();

    let [, rr, gg, bb] = hexValue.match(/^#(..)(..)(..)$/);
    let [r, g, b] = hexToRGB(hexValue);
    let [h, s, l] = RGBToHSL(r, g, b);
    $('#color-hex').html(`<span>#</span><span class="red">${rr}</span><span class="green">${gg}</span><span class="blue">${bb}</span>`)
    $('#color-rgb').html(`<span>rgb(</span><span class="red">${r}</span><span>, </span><span class="green">${g}</span><span>, </span><span class="blue">${b}</span><span>)</span>`)
    $('#color-hsl').html(`<span>hsl(</span><span class="red">${h}</span><span>, </span><span class="gray">${s}%</span><span>, </span><span class="white">${l}%</span><span>)</span>`)

    //update input state shadow
    $(':root').css("--curcol", $('#color').val());
}
updateColorsList();