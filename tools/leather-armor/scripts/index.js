import { updateColorsList } from './color_models.js';
import { draw } from './draw.js';
import { loadColorFromModel, updatePH } from './color_import.js';
import { loadFromLocalStorage, saveToLocalStorage } from './local_storage.js';

const $canvasH = $('#helmet');
const $canvasC = $('#chestplate');
const $canvasL = $('#leggings');
const $canvasB = $('#boots');

export const allCanvas = {
    h: $canvasH.get(0),
    c: $canvasC.get(0),
    l: $canvasL.get(0),
    b: $canvasB.get(0),
};
export const allCTX = {
    h: $canvasH.get(0).getContext('2d'),
    c: $canvasC.get(0).getContext('2d'),
    l: $canvasL.get(0).getContext('2d'),
    b: $canvasB.get(0).getContext('2d'),
};

let $color, $sugg, updateCooldown;

export var colorPicker, state, colorHash, assets;

function updateColor(c) {
    if (!updateCooldown) {
        c = c.toUpperCase().replace('#', '');
        colorHash = `#${c}`;
        $color.val(colorHash);
        colorPicker.color.hexString = colorHash;
        $sugg[0].text = '';
        $sugg[1].text = '';
        updateColorsList();
        updateCooldown = true;
        setTimeout(() => {
            updateCooldown = false;
        }, 50);
    }
}

$('#color').on('input', (e) => {
    let caretPosition = e.target.selectionStart;
    const el = $('#color');

    if (!el.val().match(/#/)) {
        el.val(el.val().replace(/(.*)/, '#$1'));
        caretPosition++;
    }
    if (el.val().match(/#.*#/)) {
        el.val(el.val().replace(/(#.*)#/, '$1'));
        caretPosition--;
    }
    const disallowedCharacters = /[^0-9#a-fA-F]/;

    if (el.val().match(disallowedCharacters)) {
        el.val(el.val().replace(disallowedCharacters, ''));
        caretPosition--;
    }
    el.val(el.val().toUpperCase());
    el[0].setSelectionRange(caretPosition, caretPosition);
});

export const ITEM_SCALE = 10;
const IMAGE = {
    helmet: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAT0lEQVQ4jWNgGJ4gODj4f3Bw8H9cfIKa3759i6F427Zt/01NTfEbAtOMywCChlDVAGQ/m5qa/ifJAGwBBjOEPgZgU0SUATBDcBlAUPMIBQCmcXrRa5Y27gAAAABJRU5ErkJggg==',
    chestplate:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAfUlEQVQ4jc2QwRHAIAgEaYpKrkKbuK6ogbx0iIrR5BNm/MDewijyuwLgAHy3PwBm5iRvcO2bmQNwVfUhTLJBJG9QFMzmAxC3zWZTQbwggrPeIMiu6AVpOJOUUprkMZx91vZ2ERFV/XZBL+jD24IK1wuOBBE+FlTJ6i3Db+oCbcOJaq/MgTUAAAAASUVORK5CYII=',
    leggings:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXElEQVQ4jc2R0QkAIQxDXSqTdNds1RnqV6EnVqnnh4FACe0DTWvPSURs5e2xqqYmaQByyFUAyY9LAD8CYABqAJ/jYpY/qN9PiJ84AsotHANihbt8CvDuR8Asv6IOLXjlEnbx8xQAAAAASUVORK5CYII=',
    boots: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGH4gODj4PwzjE8Op+e3bt/+3bdv239TU9D8h8VEDsIC3b9/+f/v2LU4FhORHwUABAHqxg8s2FvqIAAAAAElFTkSuQmCC',

    // Overlays
    helmet_overlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVQ4jWNgGN7ARFH0v4mi6H+yNRd56P0v8tAjz5CBNwBmCNma2VmY/yPjIWjAKCAeAAC9XiYhM+Id/gAAAABJRU5ErkJggg==',
    chestplate_overlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAEklEQVQ4jWNgGAWjYBSMAggAAAQQAAF/TXiOAAAAAElFTkSuQmCC',
    leggings_overlay: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAOUlEQVQ4jWNgGAXDEZgoiv43URT9T6w4hqKpcdb/izz0/iuK8v4nJI7VgCIPPawGYBOnvhdGAXkAAA+nJbnHlRzjAAAAAElFTkSuQmCC',
    boots_overlay:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVQ4jWNgGAWjgJrARFH0PzJbUZQXhY8uj6F5apz1f5jCIg89DAOKPPRwysMVwDCKJBQoivLiVgNzMgzj8iayGnzqhhgAAAgFNfwN37/qAAAAAElFTkSuQmCC',
};

$('#show-imports').on('click', (e) => {
    e.stopPropagation();
    showHideMenu($('.imports-list'));
});
$('.dimmer').on('click', (e) => {
    e.stopPropagation();
    showHideMenu($('.imports-list'), "hide");
})

$(window).scroll(() => {
    if (!$('.imports-list').hasClass('hidden') && !$('.imports-list').isInViewport()) showHideMenu($('.imports-list'));
});

export function showHideMenu(el, action) {
    el.add('.dimmer').removeClass('disallow-focusing');
    setTimeout(() => {
        el[action === 'hide' ? 'addClass' : action === 'show' ? 'removeClass' : 'toggleClass']('hidden');
        if (el.hasClass('hidden'))
            setTimeout(() => {
                el.add('.dimmer').addClass('disallow-focusing');
            }, 200);
    }, 50);
}
$.fn.isInViewport = function () {
    const elementTop = $(this).offset().top;
    const elementBottom = elementTop + $(this).outerHeight();
    const viewportTop = $(window).scrollTop();
    const viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$('.input-form').on('submit', loadColorFromModel);

$('.color-model #option1').change(() => {
    saveToLocalStorage('cur-color-model', 0);
});
$('.color-model #option2').change(() => {
    saveToLocalStorage('cur-color-model', 1);
});

function _allLoadingFinished() {
    state = 'active';

    $color = $('#color');
    $sugg = $('.text-input a.suggestion');
    draw();
    $color.on('input change', function () {
        let tColor = $(this).val();

        tColor = tColor.toUpperCase();
        $('.text-input .suggestions-label').addClass('hidden');
        $('.text-input .suggestions li').addClass('hidden');
        if (tColor.match(/[A-F0-9]{6}/g)) {
            $(this).val(tColor);
            updateColor(tColor);
            $color.removeClass('invalid');
            draw();
        } else if (tColor.match(/^#[A-F0-9]{1,5}$/g)) {
            const sugg1 = `#${'0'.repeat(7 - tColor.length)}${tColor.replace('#', '')}`;

            $($sugg[0]).attr('value', sugg1);
            $($sugg[0]).html(sugg1);
            $($sugg[1]).html('');
            $('.text-input .suggestions-label').removeClass('hidden');
            $('.text-input .suggestions li:nth-of-type(1)').removeClass('hidden');

            const addSecondSugg = (_sugg2) => {
                if (sugg1 != _sugg2) {
                    $($sugg[1]).attr('value', _sugg2);
                    $($sugg[1]).html(_sugg2);
                    $('.text-input .suggestions li:nth-of-type(2)').removeClass('hidden');
                }
            };

            if (tColor.length === 4) {
                const sugg2 = `#${tColor[1].repeat(2)}${tColor[2].repeat(2)}${tColor[3].repeat(2)}`;

                addSecondSugg(sugg2);
            } else if (tColor.length === 3) {
                const sugg2 = `#${(tColor[1] + tColor[2]).repeat(3)}`;

                addSecondSugg(sugg2);
            }
        } else {
            $color.addClass('invalid');
            $($sugg[0]).html('');
            $($sugg[1]).html('');
        }

        function setColor() {
            const c = $(this).attr('value');

            updateColor(c);
            $('.text-input .suggestions-label').addClass('hidden');
            $('.text-input .suggestions li').addClass('hidden');
        }
        $($sugg[0]).click(setColor);
        $($sugg[1]).click(setColor);
    });

    colorPicker = new iro.ColorPicker('#picker', { width: 180 });
    colorPicker.on('color:change', (color) => {
        updateColor(color.hexString);
        draw();
        state = 'timeout';
        setTimeout(() => {
            state = 'active';
        }, 50);
        $('.text-input .suggestions-label').addClass('hidden');
        $('.text-input .suggestions li').addClass('hidden');
    });
    colorPicker.on('input:end', (color) => {
        state = 'active';
        draw();
    });
    updateColor('FF0000');

    const selectedColorModel = Number(loadFromLocalStorage('cur-color-model'));

    $('.color-model input').each((index, el) => {
        if (index == selectedColorModel) el.checked = true;
        else el.checked = false;
    });

    $('#button-model-rgb, #button-model-int').click(updatePH);
    updatePH();
}

$(() => {
    assets = new AssetManager();

    state = 'loading';

    assets
        .loadUris([
            ['helmet', IMAGE.helmet],
            ['chestplate', IMAGE.chestplate],
            ['leggings', IMAGE.leggings],
            ['boots', IMAGE.boots],

            ['helmet_overlay', IMAGE.helmet_overlay],
            ['chestplate_overlay', IMAGE.chestplate_overlay],
            ['leggings_overlay', IMAGE.leggings_overlay],
            ['boots_overlay', IMAGE.boots_overlay],
        ])
        .then(_allLoadingFinished);
});

var AssetManager = (function () {
    function AssetManager() {
        this.files = {};
    }
    AssetManager.prototype.load = function (pArray) {
        return Promise.all(
            pArray.map(([url]) => {
                const [, tName, tType] = /(?:\/+)(?!.*\/)(.*)\.(.*)/g.exec(url);

                return this._addFile(tName, url);
            })
        );
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
                    height: tImg.height,
                };
                tImg = null;
                resolve(this.files[name]);
            };
            tImg.src = src;
        });
    };

    return AssetManager;
})();
