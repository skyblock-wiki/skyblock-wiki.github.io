import { loadFromLocalStorage, saveToLocalStorage } from './local-storage.js';

const fileUpload = document.getElementById('file-upload');
const drawnImage = document.getElementById('drawn-img');
const drawnLink = document.getElementById('drawn-lnk');

const canvas = document.getElementById('drawn-cvs');
const ctx = canvas.getContext('2d');

const uploadForm = document.getElementById('upload-form');

// Assets
let overlayBlocks300Image, overlayItems160Image;
let overlayBlocks300 = "data:image/png;base64,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";
let overlayItems160 = "data:image/png;base64,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";

// Pre-loading assets
function getFile(src) {
    return new Promise((resolve) => {
        let tImg = new Image();
        tImg.addEventListener('load', () => {
            resolve(tImg);
        });
        tImg.src = src;
    });
}
// Start pre-loading immediately
Promise.all([
    getFile(overlayBlocks300),
    getFile(overlayItems160)
]).then((values) => {
    overlayBlocks300Image = values[0];
    overlayItems160Image = values[1];
    programReady();
});

// Initialize Program After Pre-loading Assets
function programReady() {
    fileUpload.addEventListener('input', () => {
        // Obtain texture from upload
        if (fileUpload.files[0]) {
            const fileReader = new FileReader();
            const filename = fileUpload.files[0].name.replace(/\.[a-z]{2,4}$/, '').trim();

            fileReader.addEventListener('load', (event) => {
                const imageFile = event.target.result;
                switch(Number(loadFromLocalStorage('glint-format') || 0)) {
                    case 0:
                        startRendering(filename, imageFile, overlayBlocks300Image, 300, 300);
                        break;
                    case 1:
                        startRendering(filename, imageFile, overlayItems160Image, 160, 160);
                        break;
                }
            });
            fileReader.readAsDataURL(fileUpload.files[0]);
        }
    });

    const selectedColorModel = Number(loadFromLocalStorage('glint-format'));
    document.querySelectorAll('#options-form input').forEach((element, index) => {
        if (index === selectedColorModel) element.checked = true;
        else element.checked = false;
    });

    // Buttons
    document.querySelector('#options-form #blocks-300').addEventListener('change', () => {
        saveToLocalStorage('glint-format', 0);
        uploadForm.reset();
    });
    document.querySelector('#options-form #items-160').addEventListener('change', () => {
        saveToLocalStorage('glint-format', 1);
        uploadForm.reset();
    });
}

// Rendering
function startRendering(name, originalFile, overlayImage, width, height) {
    getFile(originalFile).then((image) => {
        const x = 0,
            y = 0;

        // Set canvas width and height
        canvas.width = width;
        canvas.height = height;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prevents blur
        ctx.imageSmoothingEnabled = false;

        // Draw original image
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(image, x, y, width, height);

        // Set multiply and add glint
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(overlayImage, x, y, width, height);

        // Destination-in the original image (i.e. crop to original image)
        ctx.globalCompositeOperation = 'destination-in';
        ctx.drawImage(image, x, y, width, height);

        // Reset comp mode to default
        ctx.globalCompositeOperation = 'source-over';

        // Finalize image output
        drawnImage.src = canvas.toDataURL('image/png');
        drawnLink.href = canvas.toDataURL('image/png');
        drawnLink.download = `Enchanted ${name}.png`;
    });
}