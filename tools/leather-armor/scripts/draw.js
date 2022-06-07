import { allCanvas, allContexts, assets, colorHash, itemScale, state } from './index.js';

/**
 * Draws the armor pieces
 */
export function draw() {
    if (state !== 'active') return;

    drawPiece(allCanvas.h, allContexts.h, 'helmet', colorHash);
    drawPiece(allCanvas.c, allContexts.c, 'chestplate', colorHash);
    drawPiece(allCanvas.l, allContexts.l, 'leggings', colorHash);
    drawPiece(allCanvas.b, allContexts.b, 'boots', colorHash);
}

/**
 * Draws a singular armor piece
 * @param {HTMLCanvasElement} canvas the canvas
 * @param {CanvasRenderingContext2D} ctx the canvas context
 * @param {string} name the name of the armor piece
 * @param {string} color the color to set the armor piece
 */
function drawPiece(canvas, ctx, name, color) {
    const { file, x, y, scale } = { file: assets.files[name], x: 0, y: 0, scale: itemScale };
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

    const { file2, x2, y2, scale2 } = { x2: 0, y2: 0, scale2: itemScale, file2: assets.files[`${name}_overlay`] };
    const { asset: asset2, width: width2, height: height2 } = file2;

    ctx.drawImage(asset2, x2, y2, width2 * scale2, height2 * scale2);

    document.getElementById(`${name}_img`).src = canvas.toDataURL('image/png');
    document.getElementById(`${name}_lnk`).href = canvas.toDataURL('image/png');
    document.getElementById(`${name}_lnk`).setAttribute('download', `Dyed ${name} ${color}.png`);
}
