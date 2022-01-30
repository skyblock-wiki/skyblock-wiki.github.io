import { ITEM_SCALE, allCTX, allCanvas, assets, colorHash, state } from './index.js';

export function draw() {
    if (state != 'active') return;

    const color = colorHash;

    _drawPiece(allCanvas.h, allCTX.h, 'helmet', color);
    _drawPiece(allCanvas.c, allCTX.c, 'chestplate', color);
    _drawPiece(allCanvas.l, allCTX.l, 'leggings', color);
    _drawPiece(allCanvas.b, allCTX.b, 'boots', color);
}

function _drawPiece(canvas, ctx, name, color) {
    const { file, x, y, scale } = {
        file: assets.files[name],
        x: 0,
        y: 0,
        scale: ITEM_SCALE,
    };
    const { asset, width, height } = file;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prevents blur
    ctx.imageSmoothingEnabled = false;

    /*
     * https://stackoverflow.com/a/45201094/1411473
     * step 1: draw in original image
     */
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(asset, x, y, width * scale, height * scale);

    // step 2: multiply color
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * scale, height * scale);

    // step 4: in our case, we need to clip as we filled the entire area
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(asset, x, y, width * scale, height * scale);

    // step 5: reset comp mode to default
    ctx.globalCompositeOperation = 'source-over';

    const { file2, x2, y2, scale2 } = {
        x2: 0,
        y2: 0,
        scale2: ITEM_SCALE,
        file2: assets.files[`${name}_overlay`],
    };
    const { asset: asset2, width: width2, height: height2 } = file2;

    ctx.drawImage(asset2, x2, y2, width2 * scale2, height2 * scale2);

    $(`#${name}_img`).attr('src', canvas.toDataURL('image/png'));
    $(`#${name}_lnk`).attr('href', canvas.toDataURL('image/png'));
    $(`#${name}_lnk`).attr('download', `Dyed ${name} ${color}.png`);
}
