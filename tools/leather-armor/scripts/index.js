/* global iro */

import { loadColorFromModel, updatePlaceholder } from './color-import.js';
import { updateColorsList } from './color-models.js';
import { draw } from './draw.js';
import { loadFromLocalStorage, saveToLocalStorage } from './local-storage.js';

const helmCanvas = document.getElementById('helmet');
const chestCanvas = document.getElementById('chestplate');
const legsCanvas = document.getElementById('leggings');
const bootsCanvas = document.getElementById('boots');

const colorInput = document.getElementById('color');

const params = new URL(document.location).searchParams;
const colorParam = params.get('color');

export const allCanvas = {
    h: helmCanvas,
    c: chestCanvas,
    l: legsCanvas,
    b: bootsCanvas
};
export const allContexts = {
    h: helmCanvas.getContext('2d'),
    c: chestCanvas.getContext('2d'),
    l: legsCanvas.getContext('2d'),
    b: bootsCanvas.getContext('2d')
};

let color, suggestions, updateCooldown;

export let colorPicker, state, colorHash, assets;

/**
 * Updates the displayed color
 * @param {string} color color
 */
function updateColor(color) {
    if (!updateCooldown) {
        color = color.toUpperCase().replace('#', '');
        colorHash = `#${color}`;
        colorInput.value = colorHash;
        colorPicker.color.hexString = colorHash;
        suggestions[0].text = '';
        suggestions[1].text = '';
        updateColorsList();
        updateCooldown = true;
        setTimeout(() => {
            updateCooldown = false;
        }, 50);
    }
}

colorInput.addEventListener('input', (event) => {
    let caretPosition = event.target.selectionStart;

    if (!colorInput.value.match(/#/)) {
        colorInput.value = colorInput.value.replace(/(.*)/, '#$1');
        caretPosition++;
    }

    if (colorInput.value.match(/#.*#/)) {
        colorInput.value = colorInput.value.replace(/(#.*)#/, '$1');
        caretPosition--;
    }

    const disallowedCharacters = /[^0-9#a-fA-F]/;

    if (colorInput.value.match(disallowedCharacters)) {
        colorInput.value = colorInput.value.replace(disallowedCharacters, '');
        caretPosition--;
    }

    colorInput.value = colorInput.value.toUpperCase();
    colorInput.setSelectionRange(caretPosition, caretPosition);
});

export const itemScale = 10;
const images = {
    helmet: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4jWNgGJ4gODj4f3Bw8H9cfIKa3759i6F427Zt/01NTfEbAtOMywCChlDVAGQ/m5qa/ifJAGwBBjOEPgZgU0SUATBDcBlAUPMIBQCmcXrRa5Y27gAAAABJRU5ErkJggg==',
    chestplate: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfUlEQVQ4jc2QwRHAIAgEaYpKrkKbuK6ogbx0iIrR5BNm/MDewijyuwLgAHy3PwBm5iRvcO2bmQNwVfUhTLJBJG9QFMzmAxC3zWZTQbwggrPeIMiu6AVpOJOUUprkMZx91vZ2ERFV/XZBL+jD24IK1wuOBBE+FlTJ6i3Db+oCbcOJaq/MgTUAAAAASUVORK5CYII=',
    leggings: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jc2R0QkAIQxDXSqTdNds1RnqV6EnVqnnh4FACe0DTWvPSURs5e2xqqYmaQByyFUAyY9LAD8CYABqAJ/jYpY/qN9PiJ84AsotHANihbt8CvDuR8Asv6IOLXjlEnbx8xQAAAAASUVORK5CYII=',
    boots: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGH4gODj4PwzjE8Op+e3bt/+3bdv239TU9D8h8VEDsIC3b9/+f/v2LU4FhORHwUABAHqxg8s2FvqIAAAAAElFTkSuQmCC',

    helmetOverlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4jWNgGN7ARFH0v4mi6H+yNRd56P0v8tAjz5CBNwBmCNma2VmY/yPjIWjAKCAeAAC9XiYhM+Id/gAAAABJRU5ErkJggg==',
    chestplateOverlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC',
    leggingsOverlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGAXDEZgoiv43URT9T6w4hqKpcdb/izz0/iuK8v4nJI7VgCIPPawGYBOnvhdGAXkAAA+nJbnHlRzjAAAAAElFTkSuQmCC',
    bootsOverlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVQ4jWNgGAWjgJrARFH0PzJbUZQXhY8uj6F5apz1f5jCIg89DAOKPPRwysMVwDCKJBQoivLiVgNzMgzj8iayGnzqhhgAAAgFNfwN37/qAAAAAElFTkSuQmCC'
};

const importsList = document.querySelector('.imports-list');

document.getElementById('show-imports').addEventListener('click', (event) => {
    event.stopPropagation();
    showHideMenu(importsList);
});
document.querySelector('.dimmer').addEventListener('click', (event) => {
    event.stopPropagation();
    showHideMenu(importsList, 'hide');
});

/**
 * Checks if the given element is visible in the viewport
 * @param {HTMLElement} element the element to check
 * @returns {boolean} whether the element is visible
 */
function isInViewport(element) {
    const elementTop = element.offsetTop;
    const elementBottom = elementTop + element.offsetHeight;
    const viewportTop = window.visualViewport.pageTop;
    const viewportBottom = viewportTop + window.innerHeight;

    return elementBottom > viewportTop && elementTop < viewportBottom;
}

window.addEventListener('scroll', () => {
    if (!importsList.classList.contains('hidden') && !isInViewport(importsList)) showHideMenu(importsList, 'hide');
});

const dimmer = document.querySelector('.dimmer');

/**
 * Show or hide the menu
 * @param {HTMLElement} element the element to update
 * @param {'show'|'hide'} action the action to perform
 */
export function showHideMenu(element, action) {
    dimmer.classList.add('dimmer');
    dimmer.classList.remove('disallow-focusing');
    element.classList.remove('disallow-focusing');

    setTimeout(() => {
        if (action === 'hide') element.classList.add('hidden');
        else if (action === 'show') element.classList.remove('hidden');
        else element.classList.toggle('hidden');
        if (element.classList.contains('hidden'))
            setTimeout(() => {
                dimmer.classList.add('dimmer');
                dimmer.classList.add('disallow-focusing');
                element.classList.add('disallow-focusing');
            }, 200);
    }, 50);
}

document.querySelector('.input-form').addEventListener('submit', loadColorFromModel);

document.querySelector('.color-model #option1').addEventListener('change', () => {
    saveToLocalStorage('cur-color-model', 0);
});
document.querySelector('.color-model #option2').addEventListener('change', () => {
    saveToLocalStorage('cur-color-model', 1);
});

/**
 * When all loading is finished
 */
function _allLoadingFinished() {
    state = 'active';

    color = colorInput;
    suggestions = document.querySelectorAll('.text-input a.suggestion');
    draw();
    colorInput.addEventListener('input', () => {
        let tColor = colorInput.value;

        tColor = tColor.toUpperCase();
        document.querySelectorAll('.text-input .suggestions-label').forEach((element) => element.classList.add('hidden'));
        document.querySelectorAll('.text-input .suggestions li').forEach((element) => element.classList.add('hidden'));
        if (tColor.match(/[A-F0-9]{6}/g)) {
            colorInput.value = tColor;
            updateColor(tColor);
            color.removeClass('invalid');
            draw();
        } else if (tColor.match(/^#[A-F0-9]{1,5}$/g)) {
            const suggestion1 = `#${'0'.repeat(7 - tColor.length)}${tColor.replace('#', '')}`;

            suggestions[0].value = suggestion1;
            suggestions[0].innerHTML = suggestion1;
            suggestions[1].innerHTML = '';
            document.querySelectorAll('.text-input .suggestions-label').forEach((element) => element.classList.remove('hidden'));
            document.querySelector('.text-input .suggestions li:nth-of-type(1)').classList.remove('hidden');

            const addSecondSuggestion = (suggestion2) => {
                if (suggestion1 !== suggestion2) {
                    suggestions[1].value = suggestion2;
                    suggestions[1].innerHTML = suggestion2;
                    document.querySelector('.text-input .suggestions li:nth-of-type(2)').classList.remove('hidden');
                }
            };

            if (tColor.length === 4) {
                const suggestion2 = `#${tColor[1].repeat(2)}${tColor[2].repeat(2)}${tColor[3].repeat(2)}`;

                addSecondSuggestion(suggestion2);
            } else if (tColor.length === 3) {
                const suggestion2 = `#${(tColor[1] + tColor[2]).repeat(3)}`;

                addSecondSuggestion(suggestion2);
            }
        } else {
            color.classList.add('invalid');
            suggestions[0].innerHTML = '';
            suggestions[1].innerHTML = '';
        }

        /**
         * Sets the color
         */
        function setColor() {
            const color = this.value;

            updateColor(color);
            document.querySelectorAll('.text-input .suggestions-label').forEach((element) => element.classList.add('hidden'));
            document.querySelectorAll('.text-input .suggestions li').forEach((element) => element.classList.add('hidden'));
        }
        suggestions[0].addEventListener('click', setColor);
        suggestions[1].addEventListener('click', setColor);
    });

    colorPicker = new iro.ColorPicker('#picker', { width: 180 });
    colorPicker.on('color:change', (color) => {
        updateColor(color.hexString);
        draw();
        state = 'timeout';
        setTimeout(() => {
            state = 'active';
        }, 50);
        document.querySelector('.text-input .suggestions-label').classList.add('hidden');
        document.querySelector('.text-input .suggestions li').classList.add('hidden');
    });
    colorPicker.on('input:end', () => {
        state = 'active';
        draw();
    });
    updateColor('FF0000');
    
    console.log("Color Parameter: " + colorParam);
    // There should probably be verification of the validity of the color parameter.
    if (colorParam) {
        console.log("This has loaded");
        updateColor(colorParam);
    }

    const selectedColorModel = Number(loadFromLocalStorage('cur-color-model'));

    document.querySelectorAll('.color-model input').forEach((element, index) => {
        if (index === selectedColorModel) element.checked = true;
        else element.checked = false;
    });

    [document.getElementById('button-model-rgb'), document.getElementById('button-model-int')].forEach((element) => {
        element.addEventListener('click', () => updatePlaceholder(element));
    });

    updatePlaceholder();
}

const assetManager = (() => {
    /**
     * Manages the loading of assets
     */
    function assetManager() {
        this.files = {};
    }
    assetManager.prototype.load = (pArray) => {
        return Promise.all(
            pArray.map(([url]) => {
                const [, tName] = /(?:\/+)(?!.*\/)(.*)\.(.*)/g.exec(url);

                return this._addFile(tName, url);
            })
        );
    };
    assetManager.prototype.loadUris = function (pArray) {
        return Promise.all(pArray.map(([name, uri]) => this._addFile(name, uri)));
    };
    assetManager.prototype._addFile = function (name, src) {
        return new Promise((resolve) => {
            let tImg = new Image();

            tImg.addEventListener('load', () => {
                this.files[name] = { name, asset: tImg, width: tImg.width, height: tImg.height };
                tImg = null;
                resolve(this.files[name]);
            });
            tImg.src = src;
        });
    };

    return assetManager;
})();

assets = new assetManager(); // eslint-disable-line prefer-const

state = 'loading';

assets
    .loadUris([
        ['helmet', images.helmet],
        ['chestplate', images.chestplate],
        ['leggings', images.leggings],
        ['boots', images.boots],

        ['helmet_overlay', images.helmetOverlay],
        ['chestplate_overlay', images.chestplateOverlay],
        ['leggings_overlay', images.leggingsOverlay],
        ['boots_overlay', images.bootsOverlay]
    ])
    .then(_allLoadingFinished);
