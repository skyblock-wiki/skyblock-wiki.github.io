import { Toast } from '../../../scripts/toast.js';
import { beginWebRender } from '../../head-render/scripts/draw.js';

/* Declare Elements */

const loading = document.getElementById('loading');
const warning = document.getElementById("warning");

const mainElem = document.getElementById('input');
const genElem = document.getElementById('input-gen');
const subElem = document.getElementById('input-submit');
const errElem = document.getElementById('input-error');
const clrElem = document.getElementById('input-clear');
const listElem = document.getElementById('render-list');
const validElem = document.getElementById('validator-input');
const validBtnElem = document.getElementById('validator-button');
const validRstElem = document.getElementById('validator-result');

/* Set Event Listeners */
mainElem.addEventListener('input', onInputChange);
genElem.addEventListener('click', onInputChange);
subElem.addEventListener('click', onRender);
validElem.addEventListener('input', runValidator);
validBtnElem.addEventListener('click', runValidator);
clrElem.addEventListener('click', () => {
    mainElem.value = '';
    clear();
});

/* Functions */

/**
 * Parse list and start render
 */
function onRender() {
    clearErrors();
    let parsedContent = onInputChange();
    parsedContent = parsedContent.filter(r => !!r.id);
    if (parsedContent.length < 1)
        return;

    toggleImageLoader();
    new Toast({ message: 'Rendering...', type: 'info', time: 1000 }).show();

    // run tasks and generate promises
    const failed = [];
    const promisesHead = parsedContent.map((r, i) => {
        return beginWebRender(r.id, "HEAD").catch(err => {
            new Toast({ message: err, type: 'error', time: 3500 }).show();
            console.error(err);
            parsedContent[i].error = err.toString();
            failed.push(i);
        });
    });
    const promisesSprite = parsedContent.map((r, i) => {
        return beginWebRender(r.id, "SPRITE").catch(err => {
            new Toast({ message: err, type: 'error', time: 3500 }).show();
            console.error(err);
            parsedContent[i].error = err.toString();
            failed.push(i);
        });
    });
    // create files when all done
    const zip = new JSZip();
    const headsFolder = zip.folder("heads");
    const spritesFolder = zip.folder("sprites");
    const promiseAllHeads = Promise.allSettled(promisesHead).then(results => {
        // construct heads folder
        for (let i in results) {
            if (results[i].status != "rejected") {
                const filename = parsedContent[i].name || (parsedContent[i].id + " Head Render.png");
                headsFolder.file(filename, results[i].value.split("base64,")[1], { base64: true });
            }
        }
    });
    const promiseAllSprites = Promise.allSettled(promisesSprite).then(results => {
        // construct sprites folder
        for (let i in results) {
            if (results[i].status != "rejected") {
                const filename = parsedContent[i].name && (parsedContent[i].name.match("^(.*)\.png$")[1] + " Sprite.png") || (parsedContent[i].id + " Sprite Render.png");
                spritesFolder.file(filename, results[i].value.split("base64,")[1], { base64: true });
            }
        }
    });
    // create log and save when all done
    Promise.allSettled([promiseAllHeads, promiseAllSprites]).then(() => {
        console.log(failed)
        const badlist = parsedContent.filter((v, i) => failed.includes(i));
        const goodlist = parsedContent.filter((v, i) => !failed.includes(i));
        const header = `Head Render Multi Log on ${new Date().toString()}`;
        const logContent = `${"=".repeat(header.length)}\n${header}\n${"=".repeat(header.length)}\n\n` +
            `FAILED (${badlist.length}):\n` +
            badlist.map(v => `${v.name || ""}\n${v.id || ""}\nError: ${v.error || ""}`).join("\n") +
            "\n\n" +
            `SUCCESS (${goodlist.length}):\n` +
            goodlist.map(v => `${v.name || ""}\n${v.id || ""}`).join("\n");
        zip.file("log.txt", logContent);
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            saveAs(content, "Render Output.zip");
        });
        toggleImageLoader();
    });
}

/**
 * Loads texture ID changes
 * @param {ClipboardEvent|MouseEvent|Event} event the event
 * @returns {Array} an array of { id, name }
 */
function onInputChange(event) {
    clear();
    if (!mainElem.value) return;
    const lines = mainElem.value.split("\n");
    const parsedContent = [];
    let storedName;
    for (let i in lines) {
        let line = lines[i].trim();
        if (line != "") {
            if (/^[a-f0-9]{56,64}$/i.test(line)) {
                if (storedName) {
                    parsedContent.push({ id: line, name: storedName });
                    storedName = null;
                }
                else
                    parsedContent.push({ id: line });
            }
            else {
                if (storedName) {
                    parsedContent.push({ name: storedName });
                }
                storedName = line.match("\.png$") ? line : line + ".png";
            }
        }
    }
    // leftover storedName
    if (storedName)
        parsedContent.push({ name: storedName });

    listElem.innerHTML = parsedContent.map(r => {
        return `<tr class="${!r.name ? "warning-name" : !r.id ? "warning-id" : ""}">
        <td>${r.name || "No name: will use ID as name"}</td>
        <td>${r.id && r.id.substr(0, 24) + "..." + r.id.substr(-2) || "Missing ID: will ignore entry"}</td>
        </tr>`;
    }).join("");

    return parsedContent;
}

/**
 * Shows error
 * @param {string} error the error to show
 * @param {'nbt'|'val'|'input'} element the element to show to error in
 */
function showError(error) {
    errElem.innerHTML = error;
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
    listElem.innerHTML = "";
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
    if (l < 1)
        validRstElem.value = "";
    else if (/^[a-f0-9]{56,64}$/i.test(v))
        validRstElem.value = "Yes";
    else if (/[^a-f0-9]/i.test(v))
        validRstElem.value = "Bad character (Allow: A-F and 0-9)";
    else if (l < 56 || l > 64)
        validRstElem.value = `Bad length ${l} (Allow: 59-64)`;
    else
        validRstElem.value = "No";
}

// check if webGL enabled
function checkWebGL() {
    try {
        var canvas = document.createElement('canvas'); 
        return !!window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch(e) {
        return false;
    }
}
if (!checkWebGL()) {
    warning.style.display = 'inline';
    warning.innerText = 'WebGL is not supported on this browser. To make sure there is no unexpected error, please enable WebGL before using this tool.';
}
