import { loadFromLocalStorage, saveToLocalStorage } from '../../../scripts/local-storage.js';
import { Toast } from '../../../scripts/toast.js';

const colorCodeInfo = [
    {
        code: '0',
        name: 'black',
        foreground: '#000000',
        background: '#000000',
    },
    {
        code: '1',
        name: 'dark_blue',
        foreground: '#0000AA',
        background: '#00002A',
    },
    {
        code: '2',
        name: 'dark_green',
        foreground: '#00AA00',
        background: '#002A00',
    },
    {
        code: '3',
        name: 'dark_aqua',
        foreground: '#00AAAA',
        background: '#002A2A',
    },
    {
        code: '4',
        name: 'dark_red',
        foreground: '#AA0000',
        background: '#2A0000',
    },
    {
        code: '5',
        name: 'dark_purple',
        foreground: '#AA00AA',
        background: '#2A002A',
    },
    {
        code: '6',
        name: 'gold',
        foreground: '#FFAA00',
        background: '#2A2A00',
    },
    {
        code: '7',
        name: 'gray',
        foreground: '#AAAAAA',
        background: '#2A2A2A',
    },
    {
        code: '8',
        name: 'dark_gray',
        foreground: '#555555',
        background: '#151515',
    },
    {
        code: '9',
        name: 'blue',
        foreground: '#5555FF',
        background: '#15153F',
    },
    {
        code: 'a',
        name: 'green',
        foreground: '#55FF55',
        background: '#153F15',
    },
    {
        code: 'b',
        name: 'aqua',
        foreground: '#55FFFF',
        background: '#153F3F',
    },
    {
        code: 'c',
        name: 'red',
        foreground: '#FF5555',
        background: '#3F1515',
    },
    {
        code: 'd',
        name: 'light_purple',
        foreground: '#FF55FF',
        background: '#3F153F',
    },
    {
        code: 'e',
        name: 'yellow',
        foreground: '#FFFF55',
        background: '#3F3F15',
    },
    {
        code: 'f',
        name: 'white',
        foreground: '#FFFFFF',
        background: '#3F3F3F',
    },
];

const renderAreaMc = document.getElementById('render-area');
const renderAreaUni = document.getElementById('render-area2');

const optionsForm = document.getElementById('options-form');
const optionsForm2 = document.getElementById('options-form-2');

const symbolForm = document.getElementById('symbol-form');
const symbolFormSubmit = symbolForm.querySelector('input[type="submit"]');

const codeForm = document.getElementById('code-form');
const codeFormSubmit = codeForm.querySelector('input[type="submit"]');

let isRendering = false;

function toggleRenderingState({ renderState, error }) {
    if (typeof renderState == 'boolean') isRendering = renderState;
    else isRendering = !isRendering;
    symbolFormSubmit.disabled = codeFormSubmit.disabled = isRendering;
    if (isRendering) new Toast({ message: 'Rendering...', type: 'info', time: 1000 }).show();
    if (error) new Toast({ message: error, type: 'error', time: 3500 }).show();
}

// Initialize Program
function programReady() {
    // Options Form for Colors
    let selectedColorModel = loadFromLocalStorage('mc-font-color');
    if (!selectedColorModel) {
        selectedColorModel = 'f';
        saveToLocalStorage('mc-font-color', 'f');
    }
    for (let info of colorCodeInfo) {
        let inputEl = document.createElement('input');
        inputEl.type = 'radio';
        inputEl.name = 'color-option';
        inputEl.id = `code-${info.code}`;
        inputEl.value = info.code;
        inputEl.addEventListener('change', () => {
            saveToLocalStorage('mc-font-color', info.code);
        });
        inputEl.checked = info.code === selectedColorModel;
        let labelEl = document.createElement('label');
        labelEl.innerText = ` §${info.code} `;
        labelEl.style = `color: ${info.foreground}`;
        labelEl.htmlFor = `code-${info.code}`;
        let div = document.createElement('div');
        div.append(inputEl, labelEl);
        optionsForm.append(div);
    }

    // Symbol Form
    symbolForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = new FormData(symbolForm);
        const symbol = formdata.get('symbol-input').trim();
        toggleRenderingState({ renderState: true });
        renderingDispatcher(symbol);
    });

    // Code Point Form
    codeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = new FormData(codeForm);
        let symbol;
        try {
            symbol = String.fromCodePoint(parseInt(formdata.get('code-input').trim(), 16));
        } catch (error) {
            console.warn(error);
            toggleRenderingState({ renderState: false, error: 'Invalid code point' });
            return;
        }
        symbol = symbol.replace(/^0x/g, '');
        toggleRenderingState({ renderState: true });
        renderingDispatcher(symbol);
    });
}

// In our case, initialize program immediately
programReady();

// Rendering
function renderingDispatcher(symbol) {
    let colorcode = loadFromLocalStorage('mc-font-color');
    if (!colorcode) {
        toggleRenderingState({ renderState: false, error: 'Please select color' });
    }
    renderWithFont(renderAreaMc, 'minecraft', symbol, colorCodeInfo[parseInt(colorcode, 16)], true, 16);
    renderWithFont(renderAreaUni, 'unifont', symbol, colorCodeInfo[parseInt(colorcode, 16)], false, 0);
}
function renderWithFont(renderArea, fontname, symbol, colorinfo, hasshadow, yshift) {
    let canvas = renderArea.querySelector('.drawn-cvs');
    let drawnImage = renderArea.querySelector('.drawn-img');
    let drawnLink = renderArea.querySelector('.drawn-lnk');
    let ctx = canvas.getContext('2d');

    // Set canvas width and height
    canvas.width = 300;
    canvas.height = 128;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prevents blur
    ctx.imageSmoothingEnabled = false;

    // Set rendering options
    ctx.font = `128px ${fontname}`;
    ctx.textBaseline = 'top';

    // Reset width before drawing text (Reset width will reset canvas)
    canvas.width = ctx.measureText(symbol).width;
    canvas.height = 128 + yshift; // accomodate for the shadow

    // Set rendering options again
    ctx.globalCompositeOperation = 'source-over';
    ctx.font = `128px ${fontname}`;
    ctx.textBaseline = 'top';

    // Draw text
    if (hasshadow) {
        ctx.fillStyle = colorinfo.background;
        ctx.fillText(symbol, 16, 16);
    }
    ctx.fillStyle = colorinfo.foreground;
    ctx.fillText(symbol, 0, 0);

    // // Finalize image output
    drawnImage.src = canvas.toDataURL('image/png');
    drawnLink.href = canvas.toDataURL('image/png');
    drawnLink.download = `Symbol U+${symbol.codePointAt(0).toString(16).padStart(4, '0')}.png`;

    // Re-enable buttons
    toggleRenderingState({ renderState: false });
}
