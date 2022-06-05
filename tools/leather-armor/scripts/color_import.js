import { Toast } from '../../../scripts/toast.js';
import { colorPicker, showHideMenu } from './index.js';

export function loadColorFromModel(e) {
    if (e) e.preventDefault();

    const input = $('#color-import');
    const isRGB = $('.color-model #option1').is(':checked');

    if (isRGB) {
        const rgbRegex = /(\d{0,3}),\s*(\d{0,3}),\s*(\d{0,3})/;

        if (input.val().trim() == '')
            new Toast({
                message: 'Input box empty.',
                type: 'error',
            }).show(4000);
        else if (input.val().match(rgbRegex)) {
            const [, r, g, b] = input.val().match(rgbRegex);

            if (Number(r) < 256 && Number(g) < 256 && Number(b) < 256) {
                $('#color').val(RgbToHex(r, g, b));
                showHideMenu($('.imports-list'));
                colorPicker.color.hexString = RgbToHex(r, g, b);
                input.val('');
            } else
                new Toast({
                    message: 'Invalid RGB color format.',
                    type: 'error',
                }).show(4000);
        } else
            new Toast({
                message: 'Invalid RGB color format.',
                type: 'error',
            }).show(4000);
    } else if (input.val().trim() == '')
        new Toast({
            message: 'Input box empty.',
            type: 'error',
        }).show(4000);
    else if (!isNaN(Number(input.val())) && Number(input.val()) <= 16777215 && Number(input.val()) >= 0) {
        $('#color').val(IntToHex(input.val()));
        showHideMenu($('.imports-list'));
        colorPicker.color.hexString = IntToHex(input.val());
        input.val('');
        console.log(colorPicker.color.hexString);
    } else
        new Toast({
            message: 'Invalid color integer value.',
            type: 'error',
        }).show(4000);
}

function RgbToHex(r, g, b) {
    r = Number(r).toString(16);
    g = Number(g).toString(16);
    b = Number(b).toString(16);
    if (r.length === 1) r = `0${r}`;
    if (g.length === 1) g = `0${g}`;
    if (b.length === 1) b = `0${b}`;

    return `#${r}${g}${b}`.toUpperCase();
}

function IntToHex(int) {
    let ret = Number(int).toString(16);

    while (ret.length < 6) ret = `0${ret}`;
    ret = `#${ret.toUpperCase()}`;

    return ret;
}

export function updatePH() {
    let isRGB;

    if (this) isRGB = $(this).attr('id') === 'button-model-rgb';
    else isRGB = $('.color-model #option1').is(':checked');
    $('#color-import').attr('placeholder', `e.g. ${isRGB ? '255,255,255' : '16777215'}`);
}
