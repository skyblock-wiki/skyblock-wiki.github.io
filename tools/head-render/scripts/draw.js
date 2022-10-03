/* global THREE */

/**
 * Fetches texture image and passes image to rendering
 * @param {'url'|'textureId'} url url or texture ID
 * @param {string} renderType render output type (HEAD/SPRITE)
 */
 export async function beginWebRender(url, renderType) {
    return new Promise(async (resolve, reject) => {
        if (!url.match("//textures\.minecraft\.net"))
            url = `https://textures.minecraft.net/texture/${url}`;
        try {
            // fetch image from web
            const response = await fetch(`https://eejitstools.com/cors-anywhere?url=http://${url.split('//')[1]}`);
            if (!response.ok)
                throw new Error();
            beginImageRender(URL.createObjectURL(await response.blob()), renderType).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        } catch {
            return reject('Render Unsuccessful: Invalid Texture ID');
        }
    });
}

/**
 * Creates image element and starts rendering
 * @param {string} imageSrc the image source
 * @param {string} renderType render output type (HEAD/SPRITE)
 */
 export async function beginImageRender(imageSrc, renderType) {
    return new Promise((resolve, reject) => {
        if (!["HEAD", "SPRITE"].includes(renderType))
            return reject('Unknown renderType to beginImageRender');
        // create image element
        const image = document.createElement('img');
        image.src = imageSrc;
        // start rendering
        image.addEventListener('load', () => {
            try {
                let result = (renderType == "HEAD") ? renderHead(image) :
                    (renderType == "SPRITE") ? renderSprite(image) :
                    "";
                return resolve(result);
            }
            catch (exceptionVar) {
                return reject(exceptionVar);
            }
        });
    });
}

// Renders 3D block
const frontFace = [new THREE.Vector2(0.125, 0), new THREE.Vector2(0.25, 0), new THREE.Vector2(0.25, 0.5), new THREE.Vector2(0.125, 0.5)];
const leftFace = [new THREE.Vector2(0.25, 0), new THREE.Vector2(0.375, 0), new THREE.Vector2(0.375, 0.5), new THREE.Vector2(0.25, 0.5)];
const backFace = [new THREE.Vector2(0.375, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.5, 0.5), new THREE.Vector2(0.375, 0.5)];
const bottomFace = [new THREE.Vector2(0.25, 0.5), new THREE.Vector2(0.375, 0.5), new THREE.Vector2(0.375, 1), new THREE.Vector2(0.25, 1)];
const rightFace = [new THREE.Vector2(0, 0), new THREE.Vector2(0.125, 0), new THREE.Vector2(0.125, 0.5), new THREE.Vector2(0, 0.5)];
const topFace = [new THREE.Vector2(0.125, 0.5), new THREE.Vector2(0.25, 0.5), new THREE.Vector2(0.25, 1), new THREE.Vector2(0.125, 1)];
const frontHat = [new THREE.Vector2(0.625, 0), new THREE.Vector2(0.75, 0), new THREE.Vector2(0.75, 0.5), new THREE.Vector2(0.625, 0.5)];
const backHat = [new THREE.Vector2(0.875, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.5), new THREE.Vector2(0.875, 0.5)];
const leftHat = [new THREE.Vector2(0.75, 0), new THREE.Vector2(0.875, 0), new THREE.Vector2(0.875, 0.5), new THREE.Vector2(0.75, 0.5)];
const bottomHat = [new THREE.Vector2(0.75, 0.5), new THREE.Vector2(0.875, 0.5), new THREE.Vector2(0.875, 1), new THREE.Vector2(0.75, 1)];
const topHat = [new THREE.Vector2(0.625, 0.5), new THREE.Vector2(0.75, 0.5), new THREE.Vector2(0.75, 1), new THREE.Vector2(0.625, 1)];
const rightHat = [new THREE.Vector2(0.5, 0), new THREE.Vector2(0.625, 0), new THREE.Vector2(0.625, 0.5), new THREE.Vector2(0.5, 0.5)];

/**
 * Renders the image
 */
function renderHead(image) {
    const canvas = document.createElement('canvas');
    canvas.id = "drawjs-canvas-head";
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 16;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);

    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;

    // Initialize scene
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const mainObject = new THREE.Object3D();
    const backLayer = new THREE.Object3D();
    const width = 300;
    const height = 300;

    // Initialize camera
    const viewSize = 253;
    const aspectRatio = width / height;
    const camera = new THREE.OrthographicCamera((-aspectRatio * viewSize) / 2, (aspectRatio * viewSize) / 2, viewSize / 2, -viewSize / 2, -1000, 1000);

    camera.position.set(viewSize, viewSize * 0.8168, viewSize); // Isometric position
    camera.lookAt(scene.position);

    camera.left = (-aspectRatio * viewSize) / 2;
    camera.right = (aspectRatio * viewSize) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();

    // Initialize renderer
    const rendererCv = document.createElement("canvas");
    let renderer = new THREE.WebGLRenderer({ canvas: rendererCv, antialias: false, alpha: true, preserveDrawingBuffer: true });

    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.autoClear = false;

    const headAspectRatio = 14.67; // In-game item (15.9 on Minecraft Wiki)

    backLayer.scale.set(headAspectRatio, headAspectRatio, headAspectRatio);
    mainObject.scale.set(headAspectRatio, headAspectRatio, headAspectRatio);

    scene2.add(backLayer);
    scene.add(mainObject);

    // Light
    const dirLight = new THREE.DirectionalLight(0xffffff);

    dirLight.intensity = 0.9;
    dirLight.position.set(-4, 3, 1);
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xfcfcff);

    ambientLight.intensity = 0.48;
    scene.add(ambientLight);

    const backAmbientLight = new THREE.AmbientLight(0xfcfcff);

    backAmbientLight.intensity = 0.4;
    scene2.add(backAmbientLight);

    const backLight = new THREE.DirectionalLight(0xffffff);

    backLight.intensity = 0.5;
    backLight.position.set(2, 0, 2);
    backLight.shadow.mapSize.width = 2048;
    backLight.shadow.mapSize.height = 2048;

    backLight.shadow.camera.left = -d;
    backLight.shadow.camera.right = d;
    backLight.shadow.camera.top = d;
    backLight.shadow.camera.bottom = -d;
    backLight.shadow.camera.far = 3500;
    backLight.shadow.bias = -0.0001;
    scene2.add(backLight);

    /**
     * Render back hat
     */
    function renderBackHat() {
        const backHatOverlay = new THREE.BoxGeometry(8.5, 8.5, 8.5);
        const backHatMaterial = new THREE.MeshLambertMaterial({ map: texture, alphaTest: 0.1, transparent: true, side: THREE.BackSide });

        backHatOverlay.faceVertexUvs[0][0] = [frontHat[3], frontHat[0], frontHat[2]];
        backHatOverlay.faceVertexUvs[0][1] = [frontHat[0], frontHat[1], frontHat[2]];

        backHatOverlay.faceVertexUvs[0][2] = [backHat[3], backHat[0], backHat[2]];
        backHatOverlay.faceVertexUvs[0][3] = [backHat[0], backHat[1], backHat[2]];

        backHatOverlay.faceVertexUvs[0][4] = [topHat[2], topHat[3], topHat[1]];
        backHatOverlay.faceVertexUvs[0][5] = [topHat[3], topHat[0], topHat[1]];

        backHatOverlay.faceVertexUvs[0][6] = [bottomHat[3], bottomHat[2], bottomHat[0]];
        backHatOverlay.faceVertexUvs[0][7] = [bottomHat[2], bottomHat[1], bottomHat[0]];

        backHatOverlay.faceVertexUvs[0][8] = [rightHat[3], rightHat[0], rightHat[2]];
        backHatOverlay.faceVertexUvs[0][9] = [rightHat[0], rightHat[1], rightHat[2]];

        backHatOverlay.faceVertexUvs[0][10] = [leftHat[3], leftHat[0], leftHat[2]];
        backHatOverlay.faceVertexUvs[0][11] = [leftHat[0], leftHat[1], leftHat[2]];

        const backHatCube = new THREE.Mesh(backHatOverlay, backHatMaterial);

        backHatCube.visible = true;
        backLayer.add(backHatCube);
    }

    /**
     * Render head
     */
    function renderHead() {
        const headCube = new THREE.BoxGeometry(8, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ map: texture, alphaTest: 0.5, transparent: true, side: THREE.DoubleSide });

        headCube.faceVertexUvs[0][0] = [frontFace[3], frontFace[0], frontFace[2]];
        headCube.faceVertexUvs[0][1] = [frontFace[0], frontFace[1], frontFace[2]];

        headCube.faceVertexUvs[0][2] = [backFace[3], backFace[0], backFace[2]];
        headCube.faceVertexUvs[0][3] = [backFace[0], backFace[1], backFace[2]];

        headCube.faceVertexUvs[0][4] = [topFace[2], topFace[3], topFace[1]];
        headCube.faceVertexUvs[0][5] = [topFace[3], topFace[0], topFace[1]];

        headCube.faceVertexUvs[0][6] = [bottomFace[3], bottomFace[2], bottomFace[0]];
        headCube.faceVertexUvs[0][7] = [bottomFace[2], bottomFace[1], bottomFace[0]];

        headCube.faceVertexUvs[0][8] = [rightFace[3], rightFace[0], rightFace[2]];
        headCube.faceVertexUvs[0][9] = [rightFace[0], rightFace[1], rightFace[2]];

        headCube.faceVertexUvs[0][10] = [leftFace[3], leftFace[0], leftFace[2]];
        headCube.faceVertexUvs[0][11] = [leftFace[0], leftFace[1], leftFace[2]];

        const head = new THREE.Mesh(headCube, headMaterial);

        head.visible = true;
        mainObject.add(head);
    }

    /**
     * Render front hat
     */
    function renderFrontHat() {
        const frontHatOverlay = new THREE.BoxGeometry(8.5, 8.5, 8.5);
        const frontHatMaterial = new THREE.MeshLambertMaterial({ map: texture, alphaTest: 0.1, transparent: true, side: THREE.FrontSide });

        frontHatOverlay.faceVertexUvs[0][0] = [frontHat[3], frontHat[0], frontHat[2]];
        frontHatOverlay.faceVertexUvs[0][1] = [frontHat[0], frontHat[1], frontHat[2]];

        frontHatOverlay.faceVertexUvs[0][2] = [backHat[3], backHat[0], backHat[2]];
        frontHatOverlay.faceVertexUvs[0][3] = [backHat[0], backHat[1], backHat[2]];

        frontHatOverlay.faceVertexUvs[0][4] = [topHat[2], topHat[3], topHat[1]];
        frontHatOverlay.faceVertexUvs[0][5] = [topHat[3], topHat[0], topHat[1]];

        frontHatOverlay.faceVertexUvs[0][6] = [bottomHat[3], bottomHat[2], bottomHat[0]];
        frontHatOverlay.faceVertexUvs[0][7] = [bottomHat[2], bottomHat[1], bottomHat[0]];

        frontHatOverlay.faceVertexUvs[0][8] = [rightHat[3], rightHat[0], rightHat[2]];
        frontHatOverlay.faceVertexUvs[0][9] = [rightHat[0], rightHat[1], rightHat[2]];

        frontHatOverlay.faceVertexUvs[0][10] = [leftHat[3], leftHat[0], leftHat[2]];
        frontHatOverlay.faceVertexUvs[0][11] = [leftHat[0], leftHat[1], leftHat[2]];

        const frontHatCube = new THREE.Mesh(frontHatOverlay, frontHatMaterial);

        frontHatCube.visible = true;
        mainObject.add(frontHatCube);
    }

    renderBackHat();
    renderHead();
    renderFrontHat();

    renderer.clear();
    renderer.setViewport(0, 0, width, height);
    renderer.render(scene2, camera);

    renderer.clearDepth();
    renderer.setViewport(0, 0, width, height);
    renderer.render(scene, camera);

    return renderer.domElement.toDataURL();
}

/**
 * Makes the head sprite
 */
function renderSprite(image) {
    const canvas = document.createElement('canvas');
    canvas.id = "drawjs-canvas-sprite";
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;

    context.imageSmoothingEnabled = false;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 8, 8, 8, 8, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
}
