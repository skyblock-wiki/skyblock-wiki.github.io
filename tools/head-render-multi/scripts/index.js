/* global JSZip, saveAs */

import { Toast } from '../../../scripts/toast.js';
import { beginWebRender } from '../../head-render/scripts/draw.js';

/* Declare Elements */

const loading = document.getElementById('loading');
const loadingC = document.getElementById('loading-count');
const loadingT = document.getElementById('loading-total');
const warning = document.getElementById('warning');

const mainElem = document.getElementById('input');
const subElem = document.getElementById('input-submit');
const errElem = document.getElementById('input-error');
const clrElem = document.getElementById('input-clear');
const listElem = document.getElementById('render-list');
const validElem = document.getElementById('validator-input');
const validRstElem = document.getElementById('validator-result');

/* Set Event Listeners */
mainElem.addEventListener('input', onInputChange);
document.getElementById('input-gen').addEventListener('click', onInputChange);
subElem.addEventListener('click', onRender);
document.getElementById('input-dup').addEventListener('click', markDuplicates);
validElem.addEventListener('input', runValidator);
document.getElementById('validator-button').addEventListener('click', runValidator);
clrElem.addEventListener('click', () => {
    mainElem.value = '';
    clear();
});

/* Functions */

/**
 * Parse list and start render
 */
async function onRender() {
    subElem.disabled = true;
    clearErrors();
    let parsedContent = onInputChange();
    parsedContent = parsedContent.filter((r) => !!r.id);
    if (parsedContent.length < 1) return;

    loadingC.innerText = String(0);
    loadingT.innerText = String(parsedContent.length);
    toggleImageLoader();
    new Toast({ message: 'Rendering...', type: 'info', time: 1000 }).show();

    // run tasks - render 20 images at a time
    const failed = [];
    // eslint-disable-next-line no-async-promise-executor
    await new Promise(async (resolve) => {
        for (let i = 0; i < parsedContent.length; i += 20) {
            const segment = parsedContent.slice(i, Math.min(i + 20, parsedContent.length));
            const promisesHead = segment.map((r, j) => {
                return beginWebRender(r.id, 'HEAD')
                    .then((result) => {
                        parsedContent[i + j].head = result;
                    })
                    .catch((err) => {
                        new Toast({ message: err, type: 'error', time: 3500 }).show();
                        console.error(err); // eslint-disable-line no-console
                        parsedContent[i + j].error = err.toString();
                        failed.push(i + j);
                    });
            });
            await Promise.allSettled(promisesHead); // eslint-disable-line no-await-in-loop
            const promisesSprite = segment.map((r, j) => {
                return beginWebRender(r.id, 'SPRITE')
                    .then((result) => {
                        parsedContent[i + j].sprite = result;
                    })
                    .catch((err) => {
                        new Toast({ message: err, type: 'error', time: 3500 }).show();
                        console.error(err); // eslint-disable-line no-console
                        parsedContent[i + j].error = err.toString();
                        failed.push(i + j);
                    });
            });
            await Promise.allSettled(promisesSprite); // eslint-disable-line no-await-in-loop
            loadingC.innerText = String(Math.min(i + 20, parsedContent.length));
        }
        resolve();
    });
    // create files when all done
    const zip = new JSZip();
    const headsFolder = zip.folder('heads');
    const spritesFolder = zip.folder('sprites');
    for (let i = 0; i < parsedContent.length; i++) {
        if (parsedContent[i].head) {
            const filename = parsedContent[i].name || parsedContent[i].id + ' Head Render.png';
            headsFolder.file(filename, parsedContent[i].head.split('base64,')[1], { base64: true });
        }
        if (parsedContent[i].sprite) {
            const filename =
                (parsedContent[i].name && parsedContent[i].name.match('^(.*).png$')[1] + ' Sprite.png') ||
                parsedContent[i].id + ' Sprite Render.png';
            spritesFolder.file(filename, parsedContent[i].sprite.split('base64,')[1], { base64: true });
        }
    }
    // create log and save when all done
    const badlist = parsedContent.filter((v, i) => failed.includes(i));
    const goodlist = parsedContent.filter((v, i) => !failed.includes(i));
    const header = `Head Render Multi Log on ${new Date().toString()}`;
    const logContent =
        `${'='.repeat(header.length)}\n${header}\n${'='.repeat(header.length)}\n\n` +
        `FAILED (${badlist.length}):\n` +
        badlist.map((v) => `${v.name || ''}\n${v.id || ''}\nError: ${v.error || ''}`).join('\n') +
        '\n\n' +
        `SUCCESS (${goodlist.length}):\n` +
        goodlist.map((v) => `${v.name || ''}\n${v.id || ''}`).join('\n');
    zip.file('log.txt', logContent);
    zip.generateAsync({ type: 'blob' }).then((content) => saveAs(content, 'Render Output.zip'));
    toggleImageLoader();
    subElem.disabled = false;
}

/**
 * Marks duplicate texture IDs
 */
function markDuplicates() {
    let placeholder = 0;
    const parsedContentIds = onInputChange().map((v) => v.id || --placeholder);
    let ls = new Array();
    for (let i = 0; i < parsedContentIds.length; i++) {
        const j = parsedContentIds.indexOf(parsedContentIds[i]);
        if (j !== i) ls.push(i, j);
    }
    ls = [...new Set(ls)];
    const domRows = document.querySelectorAll('#render-list tr');
    for (let row = 0; row < domRows.length; row++) {
        if (ls.indexOf(row) > -1) domRows[row].classList.add('warning-dup');
        else domRows[row].classList.remove('warning-dup');
    }
    new Toast({ message: `${ls.length} repeated values marked in green.`, type: 'info', time: 5000 }).show();
}

/**
 * Loads texture ID changes
 * @returns {Array<{ id: string, name: string }>}
 */
function onInputChange() {
    clear();
    if (!mainElem.value) return [];
    const lines = mainElem.value.split('\n');
    const parsedContent = [];
    let storedName;
    for (const i in lines) {
        const line = lines[i].trim();
        if (line !== '') {
            if (/^[a-f0-9]{56,64}$/i.test(line)) {
                if (storedName) {
                    parsedContent.push({ id: line, name: storedName });
                    storedName = null;
                } else parsedContent.push({ id: line });
            } else {
                if (storedName) {
                    parsedContent.push({ name: storedName });
                }
                storedName = line.match('.png$') ? line : line + '.png';
            }
        }
    }
    // leftover storedName
    if (storedName) parsedContent.push({ name: storedName });

    listElem.innerHTML = parsedContent
        .map((r) => {
            return `<tr class="${!r.name ? 'warning-name' : !r.id ? 'warning-id' : ''}">
        <td>${r.name || 'No name: will use ID as name'}</td>
        <td>${(r.id && r.id.substr(0, 24) + '...' + r.id.substr(-2)) || 'Missing ID: will ignore entry'}</td>
        </tr>`;
        })
        .join('');

    return parsedContent;
}

/**
 * Clears all error messages
 */
function clearErrors() {
    errElem.innerHTML = '';
}

/**
 * Clears all outputs and errors
 */
function clear() {
    listElem.innerHTML = '';
    clearErrors();
}

/**
 * Toggles the image loader
 */
function toggleImageLoader() {
    if (loading.style.display === 'none') loading.style.display = 'unset';
    else loading.style.display = 'none';
}

/**
 * Validator
 */
function runValidator() {
    const v = validElem.value.trim();
    const l = v.length;
    if (l < 1) validRstElem.value = '';
    else if (/^[a-f0-9]{56,64}$/i.test(v)) validRstElem.value = 'Valid';
    else if (/[^a-f0-9]/i.test(v)) validRstElem.value = 'Bad character (Allow: A-F and 0-9)';
    else if (l < 56 || l > 64) validRstElem.value = `Bad length ${l} (Allow: 59-64)`;
    else validRstElem.value = 'Invalid';
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
    warning.innerText =
        'WebGL is not supported on this browser. To make sure there is no unexpected error, please enable WebGL before using this tool.';
}
