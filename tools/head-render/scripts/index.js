import { Toast } from '../../../scripts/toast.js';
import { createImageThenRender } from './draw.js';

export const context = document.getElementById('canvas').getContext('2d');
context.canvas.width = 64;
context.canvas.height = 16;
export const spriteCanvas = document.getElementById('sprite-canvas').getContext('2d');
spriteCanvas.canvas.width = 64;
spriteCanvas.canvas.height = 64;

export const img = document.getElementById('drawn');
export const imgLink = document.getElementById('drawn-link');
export const sprite = document.getElementById('sprite');
export const spriteLink = document.getElementById('sprite-link');

const loading = document.getElementById('loading');

/**
 * Clears and input and outputs
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
    document.querySelectorAll('.sec-error').forEach((elem) => {
        elem.innerHTML = '';
    });
}

const fileUpload = document.getElementById('file-upload');

// Obtain texture from upload
fileUpload.addEventListener('change', () => {
    clear();
    toggleImageLoader();

    if (fileUpload.files[0]) {
        const fileReader = new FileReader();

        fileReader.addEventListener('load', (event) => {
            createImageThenRender(event.target.result);
        });

        fileReader.readAsDataURL(fileUpload.files[0]);
    }

    const filename = fileUpload.files[0].name.replace(/\.[a-z]{2,4}$/, '').trim();

    imgLink.download = `${filename} Head Render.png`.trim();
    spriteLink.download = `${filename} Sprite Render.png`.trim();
});

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

['paste', 'input'].forEach((type) => mainElem.nbt.addEventListener(type, onNbtChanged));
subElem.nbt.addEventListener('click', onNbtChanged);
['paste', 'input'].forEach((type) => mainElem.val.addEventListener(type, onValChanged));
subElem.val.addEventListener('click', onValChanged);
['paste', 'input'].forEach((type) => mainElem.tid.addEventListener(type, onTidChanged));
subElem.tid.addEventListener('click', onTidChanged);

document.getElementById('copy-id').addEventListener('click', () => {
    copyText(textureID);
});
document.getElementById('copy-template').addEventListener('click', () => {
    copyText(document.getElementById('textureTemplate'));
});
document.getElementById('open-id').addEventListener('click', () => {
    openTexture(textureID.value);
});

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
 * Handles texture ID changes
 * @param {string} url the texture URL
 * @param {'nbt'|'val'|'tid'} element the element
 * @param {string} [fileName=null] the name of the file
 */
function handleTidChange(url, element, fileName = null) {
    imgLink.download = `${fileName ? fileName.trim() : url.split('/texture/')[1]} Head Render.png`.trim();
    spriteLink.download = `${fileName ? fileName.trim() : url.split('/texture/')[1]} Sprite Render.png`.trim();
    updateTextureIdOutputs(url.split('/texture/')[1]);

    clearErrors();
    setTimeout(() => {
        mainElem[element].value = '';
    }, 100);
    toggleImageLoader();
    readImageUrl(url);
}

/**
 * Handles value changes
 * @param {string} textureData the texture data
 * @param {'nbt'|'val'|'tid'} element the element
 * @param {string} [fileName=null] the file name
 * @returns {void}
 */
function handleValChange(textureData, element, fileName = null) {
    textureData = atob(textureData);
    if (!textureData.match(/{\\&quot;/g))
        textureData = textureData.replace(/(\w+)(?=:)/g, (s) => {
            if (s.match(/http|https/g)) return s;
            else return `"${s}"`;
        });

    try {
        textureData = JSON.parse(textureData);
    } catch (error) {
        return nbtError('Error parsing texture data', element);
    }

    const url = textureData?.textures?.SKIN?.url;
    if (!url) return nbtError("Texture data doesn't contain skin url!", element);

    imgLink.download = 'Head Render.png';
    spriteLink.download = 'Sprite Render.png';
    handleTidChange(url, element, fileName);
}

/**
 * Loads texture ID changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onTidChanged(event) {
    clear();
    if (!mainElem.tid.value) return;

    const textureId = ((event.clipboardData || window.clipboardData)?.getData('text') || mainElem.tid.value).replace(/\W/g, '').toLowerCase();

    if (!/^[a-f0-9]{59,64}$/i.test(textureId)) return nbtError('Provided texture ID is invalid!', 'tid');

    handleTidChange(`https://textures.minecraft.net/texture/${textureId}`, 'tid');
}

/**
 * Loads value changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onValChanged(event) {
    clear();
    if (!mainElem.val.value) return;

    let textureData = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.val.value;

    if (textureData.match(/Value\s*:\s*"\s*([A-Za-z0-9]*)=*\s*"/g)) textureData = textureData.match(/(?<=Value\s*:\s*"\s*)([A-Za-z0-9]*)(?==*\s*")/g);
    else textureData = textureData.match(/(?<=\s*)([A-Za-z0-9]*)(?==*\s*)/g);

    if (textureData.length < 1) return nbtError('Not a valid Texture Value', 'val');

    handleValChange(textureData[0], 'val');
}

/**
 * Loads NBT changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {void}
 */
function onNbtChanged(event) {
    clear();
    const nbt = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.nbt.value;
    if (!nbt) return clearErrors();

    const json = parseNBT(nbt);
    if (!json) return nbtError('Error parsing nbt', 'nbt');

    const textureData = json?.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;
    if (!textureData) return nbtError('Invalid JSON format!', 'nbt');

    const fileName = (json?.tag?.display?.Name || 'unknown').replace(/§[0-9a-f]/, '');

    handleValChange(textureData, 'nbt', fileName);
}

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

/**
 * Fetches an image url and renders it
 * @param {string} url the url of the image to read
 */
async function readImageUrl(url) {
    try {
        const response = await fetch(`https://eejitstools.com/cors-anywhere?url=http://${url.split('//')[1]}`);
        if (!response.ok) throw new Error();

        createImageThenRender(URL.createObjectURL(await response.blob()));
    } catch {
        new Toast({ message: 'Render Unsuccessful: Invalid Texture ID', type: 'error', time: 3500 }).show();
        toggleImageLoader();
    }
}

/**
 * Shows NBT error
 * @param {string} error the error to show
 * @param {'nbt'|'val'|'tid'} element the element to show to error in
 */
function nbtError(error, element) {
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
export function toggleImageLoader() {
    if (loading.style.display === 'none') loading.style.display = 'unset';
    else loading.style.display = 'none';
}

// auto generation through search param
const params = new URLSearchParams(window.location.search);

if (params.has('texture-id')) {
    const textureId = params.get('texture-id');

    if (!/^[a-f0-9]{59,64}$/i.test(textureId)) nbtError('Provided texture ID is invalid!', 'tid');
    else handleTidChange(`https://textures.minecraft.net/texture/${textureId}`, 'tid');
}
