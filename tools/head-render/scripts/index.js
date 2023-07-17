import { Toast } from '../../../scripts/toast.js';
import { beginImageRender, beginWebRender } from './draw.js';

/* Declare Elements */

const img = document.getElementById('drawn');
const imgLink = document.getElementById('drawn-link');
const sprite = document.getElementById('sprite');
const spriteLink = document.getElementById('sprite-link');

const loading = document.getElementById('loading');
const warning = document.getElementById('warning');

const fileUpload = document.getElementById('file-upload');

const mainElem = {
    nbt: document.getElementById('nbt'),
    val: document.getElementById('val'),
    tid: document.getElementById('tid')
};
const subElem = {
    nbt: document.getElementById('nbt-submit'),
    val: document.getElementById('val-submit'),
    tid: document.getElementById('tid-submit')
};
const errElem = {
    nbt: document.getElementById('nbt-error'),
    val: document.getElementById('val-error'),
    tid: document.getElementById('tid-error')
};

const textureID = document.getElementById('texture-id');
const textureTemplate = document.getElementById('texture-template');

/* Set Event Listeners */

fileUpload.addEventListener('change', () => {
    clear();
    // Obtain texture from upload
    if (fileUpload.files[0]) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', (event) => {
            const image = event.target.result;
            renderDispatcher(beginImageRender, image);
        });
        fileReader.readAsDataURL(fileUpload.files[0]);

        const filename = fileUpload.files[0].name.replace(/\.[a-z]{2,4}$/, '').trim();
        imgLink.download = `${filename} Head Render.png`.trim();
        spriteLink.download = `${filename} Sprite Render.png`.trim();
    }
});

['paste', 'input'].forEach((type) => mainElem.nbt.addEventListener(type, onNbtChange));
subElem.nbt.addEventListener('click', onNbtChange);
['paste', 'input'].forEach((type) => mainElem.val.addEventListener(type, onValChange));
subElem.val.addEventListener('click', onValChange);
['paste', 'input'].forEach((type) => mainElem.tid.addEventListener(type, onTidChange));
subElem.tid.addEventListener('click', onTidChange);

document.getElementById('copy-id').addEventListener('click', () => {
    copyText(textureID);
});
document.getElementById('copy-template').addEventListener('click', () => {
    copyText(textureTemplate);
});
document.getElementById('open-id').addEventListener('click', () => {
    openTexture(textureID.value);
});

document.getElementById('nbt-clear').addEventListener('click', () => {
    mainElem.nbt.value = '';
    clearErrors();
});
document.getElementById('val-clear').addEventListener('click', () => {
    mainElem.val.value = '';
    clearErrors();
});
document.getElementById('tid-clear').addEventListener('click', () => {
    mainElem.tid.value = '';
    clearErrors();
});

/* Functions */

/**
 * Renders both head and sprite with a corresponding renderFunction
 * @param {Function} renderFunction the function to render the head and sprite
 * @param {object} obj the object to pass to the render function
 */
function renderDispatcher(renderFunction, obj) {
    toggleImageLoader();
    new Toast({ message: 'Rendering...', type: 'info', time: 1000 }).show();
    const promises = new Array(2);
    promises[0] = renderFunction(obj, 'HEAD')
        .then((result) => {
            img.src = result;
            imgLink.href = result;
            imgLink.classList.remove('hidden');
        })
        .catch((err) => {
            new Toast({ message: err, type: 'error', time: 3500 }).show();
            console.error(err); // eslint-disable-line no-console
        });
    promises[1] = renderFunction(obj, 'SPRITE')
        .then((result) => {
            sprite.src = result;
            spriteLink.href = result.replace('image/png', 'image/octet-stream');
            spriteLink.classList.remove('hidden');
        })
        .catch((err) => {
            new Toast({ message: err, type: 'error', time: 3500 }).show();
            console.error(err); // eslint-disable-line no-console
        });
    Promise.allSettled(promises).then(() => {
        toggleImageLoader();
    });
}

/**
 * Copies and element's text to the clipboard
 * @param {HTMLElement} element the element who's value to copy
 */
function copyText(element) {
    navigator.clipboard.writeText(element.value);
    new Toast({ message: 'Copied!', type: 'success', time: 2000 }).show();
}

/**
 * Opens a texture in a new tab
 * @param {id} id the id of the texture to open
 */
function openTexture(id) {
    const tab = window.open(`https://textures.minecraft.net/texture/${id}`, '_blank');

    if (tab) tab.focus();
    else new Toast({ message: 'Could not open! Please allow popups for this website!', type: 'disallow', time: 4000 }).show();
}

/**
 * Updates the output texture ID info
 * @param {id} id the texture ID
 */
function updateTextureIdOutputs(id) {
    textureID.value = id;
    textureTemplate.value = `{{HeadRender|${id}}}`;
    document.querySelectorAll('.nbt-info button').forEach((element) => (element.disabled = false));
}

/**
 * Render with ID
 * @param {'url'|'textureId'} textureId texture URL or texture ID
 * @param {'nbt'|'val'|'tid'} element the element
 * @param {string} [fileName=null] the name of the file
 */
function renderWithId(textureId, element, fileName = null) {
    if (textureId.match('//textures.minecraft.net')) textureId = textureId.split('/texture/')[1];

    imgLink.download = `${fileName ? fileName.trim() : textureId} Head Render.png`.trim();
    spriteLink.download = `${fileName ? fileName.trim() : textureId} Sprite Render.png`.trim();
    updateTextureIdOutputs(textureId);

    clearErrors();
    setTimeout(() => {
        mainElem[element].value = '';
    }, 100);
    renderDispatcher(beginWebRender, textureId);
}

/**
 * Parse value, then render with ID
 * @param {string} textureData the texture data
 * @param {'nbt'|'val'|'tid'} element the element
 * @param {string} [fileName=null] the file name
 * @returns {void}
 */
function renderWithValue(textureData, element, fileName = null) {
    textureData = atob(textureData);
    if (!textureData.match(/{\\&quot;/g))
        textureData = textureData.replace(/(\w+)(?=:)/g, (s) => {
            if (s.match(/http|https/g)) return s;
            else return `"${s}"`;
        });

    try {
        textureData = JSON.parse(textureData);
    } catch (error) {
        return showError('Error parsing texture data', element);
    }

    const url = textureData?.textures?.SKIN?.url;
    if (!url) return showError("Texture data doesn't contain skin url!", element);

    imgLink.download = 'Head Render.png';
    spriteLink.download = 'Sprite Render.png';
    renderWithId(url, element, fileName);
}

/**
 * Loads texture ID changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onTidChange(event) {
    clear();
    if (!mainElem.tid.value) return;

    const textureId = ((event.clipboardData || window.clipboardData)?.getData('text') || mainElem.tid.value).replace(/\W/g, '').toLowerCase();

    if (!/^[a-f0-9]{56,64}$/i.test(textureId)) return showError('Provided texture ID is invalid!', 'tid');

    renderWithId(textureId, 'tid');
}

/**
 * Loads value changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onValChange(event) {
    clear();
    if (!mainElem.val.value) return;

    let textureData = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.val.value;

    if (textureData.match(/Value\s*:\s*"\s*([A-Za-z0-9]*)=*\s*"/g)) textureData = textureData.match(/(?<=Value\s*:\s*"\s*)([A-Za-z0-9]*)(?==*\s*")/g);
    else textureData = textureData.match(/(?<=\s*)([A-Za-z0-9]*)(?==*\s*)/g);

    if (textureData.length < 1) return showError('Not a valid Texture Value', 'val');

    renderWithValue(textureData[0], 'val');
}

/**
 * Loads NBT changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onNbtChange(event) {
    clear();
    const nbt = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.nbt.value;
    if (!nbt) return clearErrors();

    const json = parseNBT(nbt);
    if (!json) return showError('Error parsing nbt', 'nbt');

    const textureData = json?.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;
    if (!textureData) return showError('Invalid JSON format!', 'nbt');

    const fileName = (json?.tag?.display?.Name || 'unknown').replace(/§[0-9a-f]/, '');

    renderWithValue(textureData, 'nbt', fileName);
}

/**
 * Shows error on a specific element
 * @param {string} error the error to show
 * @param {'nbt'|'val'|'tid'} element the element to show to error in
 */
function showError(error, element) {
    errElem[element].innerHTML = error;
}

/**
 * Clears all error messages
 */
function clearErrors() {
    Object.values(errElem).forEach((element) => {
        element.innerHTML = '';
    });
}

/**
 * Clears all outputs and errors
 */
function clear() {
    imgLink.href = '';
    imgLink.download = '';
    imgLink.classList.add('hidden');
    spriteLink.href = '';
    spriteLink.download = '';
    spriteLink.classList.add('hidden');
    img.src = '';
    sprite.src = '';
    clearErrors();
}

/**
 * Parses NBT
 * @param {string} nbt the NBT to parse
 * @returns {object|null} the parsed NBT (or null if error)
 * @see https://jsfiddle.net/joker876/ygm834cd
 */
function parseNBT(nbt) {
    try {
        nbt = nbt
            .replace(/\n/g, '')
            .replace(/([_a-zA-Z]+?): ?(["|\d|{|[])(?!\s*,\s*)/g, '"$1": $2')
            .replace(/: ?(\d+?)[bsfl]/g, ': $1')
            .replace(/\d+?\s*:\s*(["{[])/g, '$1')
            .replace(/": ?1b/g, '": true')
            .replace(/": ?0b/g, '": false');

        return JSON.parse(nbt);
    } catch (error) {
        return null;
    }
}

/**
 * Toggles the image loader
 */
function toggleImageLoader() {
    if (loading.style.display === 'none') loading.style.display = 'unset';
    else loading.style.display = 'none';
}

/**
 * Checks if WebGL is enabled
 * @returns {boolean} Whether or not WebGL is enabled
 */
function checkWebGL() {
    try {
        const canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
}
if (!checkWebGL()) {
    warning.style.display = 'inline';
    warning.innerText = 'WebGL is not supported on this browser. To make sure there is no unexpected error, please enable WebGL before using this tool.';
}

// auto generation through search param
const params = new URLSearchParams(window.location.search);

if (params.has('texture-id')) {
    const textureId = params.get('texture-id');

    if (!/^[a-f0-9]{56,64}$/i.test(textureId)) showError('Provided texture ID is invalid!', 'tid');
    else renderWithId(textureId, 'tid');
}
