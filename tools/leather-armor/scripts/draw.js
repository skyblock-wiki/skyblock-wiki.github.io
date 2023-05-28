import { allCanvas, allContexts, assets, colorHash, itemScale, state } from './index.js';

/**
 * Draws the armor pieces
 */
export function draw() {
    if (state !== 'active') return;

    drawPiece(allCanvas.h, allContexts.h, 'helmet', assets, false, colorHash);
    drawPiece(allCanvas.c, allContexts.c, 'chestplate', assets, false, colorHash);
    drawPiece(allCanvas.l, allContexts.l, 'leggings', assets, false, colorHash);
    drawPiece(allCanvas.b, allContexts.b, 'boots', assets, false, colorHash);

    drawPiece(allCanvas.h, allContexts.h, 'helmet', assets, true, colorHash);
    drawPiece(allCanvas.c, allContexts.c, 'chestplate', assets, true, colorHash);
    drawPiece(allCanvas.l, allContexts.l, 'leggings', assets, true, colorHash);
    drawPiece(allCanvas.b, allContexts.b, 'boots', assets, true, colorHash);
}

/**
 * Draws a singular armor piece
 * @param {HTMLCanvasElement} canvas the canvas
 * @param {CanvasRenderingContext2D} ctx the canvas context
 * @param {string} name the name of the armor piece
 * @param {string} color the color to set the armor piece
 */
function drawPiece(canvas, ctx, name, assets, isLatest, color) {
    const { file, x, y, scale } = { file: assets.files[`${name[0]}${isLatest ? '_latest' : ''}`], x: 0, y: 0, scale: itemScale };
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

    const { file2, x2, y2, scale2 } = { x2: 0, y2: 0, scale2: itemScale, file2: assets.files[`${name[0]}${isLatest ? '_latest' : ''}_overlay`] };
    const { asset: asset2, width: width2, height: height2 } = file2;

    ctx.drawImage(asset2, x2, y2, width2 * scale2, height2 * scale2);

    document.querySelector(`.minecraft${isLatest ? '-latest' : ''} .${name}_img`).src = canvas.toDataURL('image/png');
    document.querySelector(`.minecraft${isLatest ? '-latest' : ''} .${name}_lnk`).href = canvas.toDataURL('image/png');
    document.querySelector(`.minecraft${isLatest ? '-latest' : ''} .${name}_lnk`).download = `Dyed ${name} ${color}.png`;
}
