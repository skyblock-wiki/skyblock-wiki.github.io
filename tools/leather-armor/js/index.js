import { updateColorsList } from './color_models.js';
import { draw } from './draw.js';
import { loadColorFromModel } from './color_import.js';
import { saveToLocalStorage, loadFromLocalStorage } from './local_storage.js';

let canvasH = document.querySelector("#helmet");
let canvasC = document.querySelector("#chestplate");
let canvasL = document.querySelector("#leggings");
let canvasB = document.querySelector("#boots");

export let allCanvas = {
    h: document.querySelector("#helmet"),
    c: document.querySelector("#chestplate"),
    l: document.querySelector("#leggings"),
    b: document.querySelector("#boots"),
}
export let allCTX = {
    h: canvasH.getContext("2d"),
    c: canvasC.getContext("2d"),
    l: canvasL.getContext("2d"),
    b: canvasB.getContext("2d"),
}

var colorElem, suggestElem;
export var colorPicker, state, colorHash, assets

function updateColor(c, mode = "") {
    c = c.toUpperCase().replace("#", "");
    colorHash = "#" + c;
    if (mode !== "p") colorElem.value = colorHash;
    if (mode !== "e") colorPicker.color.hexString = colorHash;
    suggestElem[0].text = "";
    suggestElem[1].text = "";
}

$('#color').on('input', e => {
    let caretPosition = e.target.selectionStart;
    let el = $('#color');
    if (!el.val().match(/#/)) {
        el.val(el.val().replace(/(.*)/, '#$1'));
        caretPosition++;
    }
    if (el.val().match(/#.*#/)) {
        el.val(el.val().replace(/(#.*)#/, '$1'));
        caretPosition--;
    }
    let disallowedCharacters = /[^0-9#a-fA-F]/;
    if (el.val().match(disallowedCharacters)) {
        el.val((el.val().replace(disallowedCharacters, '')));
        caretPosition--;
    }
    el.val((el.val().toUpperCase()));
    el[0].setSelectionRange(caretPosition, caretPosition);
});

export const ITEM_SCALE = 10;
const IMAGE = {
    helmet: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4jWNgGJ4gODj4f3Bw8H9cfIKa3759i6F427Zt/01NTfEbAtOMywCChlDVAGQ/m5qa/ifJAGwBBjOEPgZgU0SUATBDcBlAUPMIBQCmcXrRa5Y27gAAAABJRU5ErkJggg==",
    chestplate: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfUlEQVQ4jc2QwRHAIAgEaYpKrkKbuK6ogbx0iIrR5BNm/MDewijyuwLgAHy3PwBm5iRvcO2bmQNwVfUhTLJBJG9QFMzmAxC3zWZTQbwggrPeIMiu6AVpOJOUUprkMZx91vZ2ERFV/XZBL+jD24IK1wuOBBE+FlTJ6i3Db+oCbcOJaq/MgTUAAAAASUVORK5CYII=",
    leggings: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jc2R0QkAIQxDXSqTdNds1RnqV6EnVqnnh4FACe0DTWvPSURs5e2xqqYmaQByyFUAyY9LAD8CYABqAJ/jYpY/qN9PiJ84AsotHANihbt8CvDuR8Asv6IOLXjlEnbx8xQAAAAASUVORK5CYII=",
    boots: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGH4gODj4PwzjE8Op+e3bt/+3bdv239TU9D8h8VEDsIC3b9/+f/v2LU4FhORHwUABAHqxg8s2FvqIAAAAAElFTkSuQmCC",

    // Overlays
    helmet_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4jWNgGN7ARFH0v4mi6H+yNRd56P0v8tAjz5CBNwBmCNma2VmY/yPjIWjAKCAeAAC9XiYhM+Id/gAAAABJRU5ErkJggg==",
    chestplate_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC",
    leggings_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGAXDEZgoiv43URT9T6w4hqKpcdb/izz0/iuK8v4nJI7VgCIPPawGYBOnvhdGAXkAAA+nJbnHlRzjAAAAAElFTkSuQmCC",
    boots_overlay: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVQ4jWNgGAWjgJrARFH0PzJbUZQXhY8uj6F5apz1f5jCIg89DAOKPPRwysMVwDCKJBQoivLiVgNzMgzj8iayGnzqhhgAAAgFNfwN37/qAAAAAElFTkSuQmCC",
};

function _allLoadingFinished() {
    state = "active";

    colorElem = document.querySelector("#color");
    suggestElem = $(".text-input a.suggestion");
    draw();
    colorElem.onchange = function () {
        var tColor = this.value;
        tColor = tColor.toUpperCase();
        $('.text-input .suggestions-label').addClass('hidden');
        $('.text-input .suggestions li').addClass('hidden');
        if (tColor.match(/[A-F0-9]{6}/g)) {
            this.value = tColor;
            updateColor(tColor, "p");
            updateColorsList();
            colorElem.classList.remove('invalid');
            draw();
        } else if (tColor.match(/^#[A-F0-9]{1,5}$/g)) {
            let sugg1 = "#" + "0".repeat(7 - tColor.length) + tColor.replace('#', '');
            $(suggestElem[0]).attr("value", sugg1);
            $(suggestElem[0]).html(sugg1);
            $(suggestElem[1]).html('');
            $('.text-input .suggestions-label').removeClass('hidden');
            $('.text-input .suggestions li:nth-of-type(1)').removeClass('hidden');

            var addSecondSugg = (_sugg2) => {
                if (sugg1 != _sugg2) {
                    $(suggestElem[1]).attr("value", _sugg2);
                    $(suggestElem[1]).html(_sugg2);
                    $('.text-input .suggestions li:nth-of-type(2)').removeClass('hidden');
                }
            }

            if (tColor.length === 4) {
                let sugg2 = '#' + tColor[1].repeat(2) + tColor[2].repeat(2) + tColor[3].repeat(2);
                addSecondSugg(sugg2)
            }
            else if (tColor.length === 3) {
                let sugg2 = '#' + (tColor[1] + tColor[2]).repeat(3);
                addSecondSugg(sugg2)
            }
        } else {
            colorElem.classList.add('invalid');
            $(suggestElem[0]).html('');
            $(suggestElem[1]).html('');
        }

        function setColor() {
            let c = this.getAttribute("value");
            updateColor(c);
            $('.text-input .suggestions-label').addClass('hidden');
            $('.text-input .suggestions li').addClass('hidden');
        }
        $(suggestElem[0]).click(setColor);
        $(suggestElem[1]).click(setColor);
    };
    colorElem.oninput = colorElem.onchange;

    colorPicker = new iro.ColorPicker('#picker', {
        width: 180,
    });
    colorPicker.on('color:change', function (color) {
        updateColor(color.hexString, "e");
        updateColorsList();
        draw();
        state = "timeout";
        setTimeout(function () {
            state = "active";
        }, 50);
        $('.text-input .suggestions-label').addClass('hidden');
        $('.text-input .suggestions li').addClass('hidden');
    });
    colorPicker.on('input:end', function (color) {
        state = "active";
        draw();
    });
    updateColor("FF0000");
}

$('#show-imports').on('click', (e) => {
    e.stopPropagation();
    showHideMenu($('.imports-list'));
});

$(window).scroll(function() {
    if (!$('.imports-list').hasClass('hidden') && !$('.imports-list').isInViewport()) {
        showHideMenu($('.imports-list'));
    }
});
// hide import menu when clicked outside
$(document).click(function() {
    if (!$('.imports-list').hasClass('hidden')) {
        showHideMenu($('.imports-list'));
    }
});
$('.imports-list').click(function(e) {
    e.stopPropagation();
});
$(".menuWraper").click(function(event) {
    alert('clicked inside');
    event.stopPropagation();
});
export function showHideMenu(el) {
    el.removeClass('disallow-focusing');
    setTimeout(() => {
        el.toggleClass('hidden');
        if (el.hasClass('hidden')) {
            setTimeout(() => {
                el.addClass('disallow-focusing');
            }, 200);
        }
    }, 50);
}
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$('#color-import-submit').click(loadColorFromModel)

$('.color-model #option1').change(() => {
    saveToLocalStorage('cur-color-model', 0);
})
$('.color-model #option2').change(() => {
    saveToLocalStorage('cur-color-model', 1);
})

$(function () {
    assets = new AssetManager();

    state = "loading";

    assets.loadUris([
            ["helmet", IMAGE.helmet],
            ["chestplate", IMAGE.chestplate],
            ["leggings", IMAGE.leggings],
            ["boots", IMAGE.boots],

            ["helmet_overlay", IMAGE.helmet_overlay],
            ["chestplate_overlay", IMAGE.chestplate_overlay],
            ["leggings_overlay", IMAGE.leggings_overlay],
            ["boots_overlay", IMAGE.boots_overlay],
        ])
        .then(_allLoadingFinished);
    
    let selectedColorModel = Number(loadFromLocalStorage('cur-color-model'));
    $('.color-model input').each((index, el) => {
        if (index == selectedColorModel) el.checked = true;
        else el.checked = false;
    });
    updatePH();
})

var AssetManager = (function () {
    function AssetManager() {
        this.files = {};
    }
    AssetManager.prototype.load = function (pArray) {
        return Promise.all(pArray.map(([url]) => {
            let [, tName, tType] = /(?:\/+)(?!.*\/)(.*)\.(.*)/g.exec(url);
            return this._addFile(tName, url);
        }));
    };
    AssetManager.prototype.loadUris = function (pArray, pCallback) {
        return Promise.all(pArray.map(([name, uri]) => this._addFile(name, uri)));
    };
    AssetManager.prototype._addFile = function (name, src) {
        return new Promise((resolve, reject) => {
            let tImg = new Image();
            tImg.onload = (e) => {
                this.files[name] = {
                    name,
                    asset: tImg,
                    width: tImg.width,
                    height: tImg.height
                };
                tImg = null;
                resolve(this.files[name]);
            };
            tImg.src = src;
        });
    }
    return AssetManager;
})();

$('#button-model-rgb, #button-model-int').click(updatePH);

function updatePH() {
    let isRGB
    if (this) isRGB = $(this).attr('id') === 'button-model-rgb';
    else isRGB = $('.color-model #option1').is(':checked');
    $('#color-import').attr('placeholder', `e.g. ${isRGB? '255,255,255': '16777215'}`);
}