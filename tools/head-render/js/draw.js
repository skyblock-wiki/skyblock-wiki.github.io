import { Toast } from '../../../js/toast.js';
import { context, spriteCanvas, toggleImageLoader } from './index.js'
import { $img, $imgLink, $sprite, $spriteLink } from './index.js'

//////////////////////////////
// Pre-Render
//////////////////////////////
export function createImageThenRender(imageSrc) {
    var $textureImage = $('<img>');
    $textureImage.attr("src", imageSrc);

    $textureImage.on("load", function () {
        let _img = $textureImage.get(0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(_img, 0, 0);

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(_img, 0, 0);

        render();
        makeSprite();
        new Toast({
            message: `Rendering...`,
            type: "info",
            time: 1000
        }).show();
    });
}

//////////////////////////////
// Rendering 3D block
//////////////////////////////

var frontface = [
    new THREE.Vector2(0.125, 0),
    new THREE.Vector2(0.25, 0),
    new THREE.Vector2(0.25, 0.5),
    new THREE.Vector2(0.125, 0.5)
];

var leftface = [
    new THREE.Vector2(0.25, 0),
    new THREE.Vector2(0.375, 0),
    new THREE.Vector2(0.375, 0.5),
    new THREE.Vector2(0.25, 0.5)
];

var backface = [
    new THREE.Vector2(0.375, 0),
    new THREE.Vector2(0.5, 0),
    new THREE.Vector2(0.5, 0.5),
    new THREE.Vector2(0.375, 0.5)
];

var bottomface = [
    new THREE.Vector2(0.25, 0.5),
    new THREE.Vector2(0.375, 0.5),
    new THREE.Vector2(0.375, 1),
    new THREE.Vector2(0.25, 1)
];

var rightface = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(0.125, 0),
    new THREE.Vector2(0.125, 0.5),
    new THREE.Vector2(0, 0.5)
];

var topface = [
    new THREE.Vector2(0.125, 0.5),
    new THREE.Vector2(0.25, 0.5),
    new THREE.Vector2(0.25, 1),
    new THREE.Vector2(0.125, 1)
];

var fronthat = [
    new THREE.Vector2(0.625, 0),
    new THREE.Vector2(0.75, 0),
    new THREE.Vector2(0.75, 0.5),
    new THREE.Vector2(0.625, 0.5)
];

var backhat = [
    new THREE.Vector2(0.875, 0),
    new THREE.Vector2(1, 0),
    new THREE.Vector2(1, 0.5),
    new THREE.Vector2(0.875, 0.5)
];

var lefthat = [
    new THREE.Vector2(0.75, 0),
    new THREE.Vector2(0.875, 0),
    new THREE.Vector2(0.875, 0.5),
    new THREE.Vector2(0.75, 0.5)
];

var bottomhat = [
    new THREE.Vector2(0.75, 0.5),
    new THREE.Vector2(0.875, 0.5),
    new THREE.Vector2(0.875, 1),
    new THREE.Vector2(0.75, 1)
];

var tophat = [
    new THREE.Vector2(0.625, 0.5),
    new THREE.Vector2(0.75, 0.5),
    new THREE.Vector2(0.75, 1),
    new THREE.Vector2(0.625, 1)
];

var righthat = [
    new THREE.Vector2(0.5, 0),
    new THREE.Vector2(0.625, 0),
    new THREE.Vector2(0.625, 0.5),
    new THREE.Vector2(0.5, 0.5)
];


function render() {

    const texture = new THREE.CanvasTexture(context.canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;


    // Initialize scene
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const main_object = new THREE.Object3D();
    const back_layer = new THREE.Object3D();

    var width = 512;
    var height = 512;

    // Initilalize camera
    var viewSize = 253;

    var aspectRatio = width / height;
    var camera = new THREE.OrthographicCamera(
        (-aspectRatio * viewSize) / 2,
        (aspectRatio * viewSize) / 2,
        viewSize / 2,
        -viewSize / 2,
        -1000,
        1000
    );

    camera.position.set(viewSize, viewSize * 0.8168, viewSize); // Isometric position
    camera.lookAt(scene.position);

    camera.left = (-aspectRatio * viewSize) / 2;
    camera.right = (aspectRatio * viewSize) / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();

    //Initialize renderer
    var renderer = new THREE.WebGLRenderer({
        canvas: $("#render").get(0),
        antialias: false,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setClearColor(0xffffff, 0);
    /* renderer.setPixelRatio(window.devicePixelRatio); */
    renderer.shadowMap.enabled = true;
    renderer.setSize(width, height);
    renderer.autoClear = false; // important!
    $('body').append(renderer.domElement);

    /* var headAspectRatio = 15.9; // MC WIKI */
    var headAspectRatio = 14.67; // Ingame Item
    back_layer.scale.set(headAspectRatio, headAspectRatio, headAspectRatio);
    main_object.scale.set(headAspectRatio, headAspectRatio, headAspectRatio);

    scene2.add(back_layer);
    scene.add(main_object);

    //Light
    const dirLight = new THREE.DirectionalLight(0xffffff);
    // dirLight.intensity = 0.435;
    // dirLight.intensity = 0.46;
    dirLight.intensity = 0.9;
    /* dirLight.position.set(-1, 2.25, 1.24).normalize(); */
    dirLight.position.set(-4, 3, 1)
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    var d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    var ambientLight = new THREE.AmbientLight(0xfcfcff);
    ambientLight.intensity = 0.48;
    scene.add(ambientLight);

    var backAmbientLight = new THREE.AmbientLight(0xfcfcff);
    backAmbientLight.intensity = 0.40;
    scene2.add(backAmbientLight);

    const backLight = new THREE.DirectionalLight(0xffffff);
    // dirLight.intensity = 0.435;
    // dirLight.intensity = 0.46;
    backLight.intensity = 0.5;
    /* dirLight.position.set(-1, 2.25, 1.24).normalize(); */
    backLight.position.set(2, 0, 2)
    backLight.shadow.mapSize.width = 2048;
    backLight.shadow.mapSize.height = 2048;
    var d = 50;
    backLight.shadow.camera.left = -d;
    backLight.shadow.camera.right = d;
    backLight.shadow.camera.top = d;
    backLight.shadow.camera.bottom = -d;
    backLight.shadow.camera.far = 3500;
    backLight.shadow.bias = -0.0001;
    scene2.add(backLight);

    // Back Hat

    function renderBackHat() {

        var backHatOverlay = new THREE.BoxGeometry(8.5, 8.5, 8.5);

        // Material
        var backHatMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            alphaTest: 0.1,
            transparent: true,
            side: THREE.BackSide,
        });

        backHatOverlay.faceVertexUvs[0][0] = [fronthat[3], fronthat[0], fronthat[2]];
        backHatOverlay.faceVertexUvs[0][1] = [fronthat[0], fronthat[1], fronthat[2]];

        backHatOverlay.faceVertexUvs[0][2] = [backhat[3], backhat[0], backhat[2]];
        backHatOverlay.faceVertexUvs[0][3] = [backhat[0], backhat[1], backhat[2]];

        backHatOverlay.faceVertexUvs[0][4] = [tophat[2], tophat[3], tophat[1]];
        backHatOverlay.faceVertexUvs[0][5] = [tophat[3], tophat[0], tophat[1]];

        backHatOverlay.faceVertexUvs[0][6] = [bottomhat[3], bottomhat[2], bottomhat[0]];
        backHatOverlay.faceVertexUvs[0][7] = [bottomhat[2], bottomhat[1], bottomhat[0]];

        backHatOverlay.faceVertexUvs[0][8] = [righthat[3], righthat[0], righthat[2]];
        backHatOverlay.faceVertexUvs[0][9] = [righthat[0], righthat[1], righthat[2]];

        backHatOverlay.faceVertexUvs[0][10] = [lefthat[3], lefthat[0], lefthat[2]];
        backHatOverlay.faceVertexUvs[0][11] = [lefthat[0], lefthat[1], lefthat[2]];

        var backHatCube = new THREE.Mesh(backHatOverlay, backHatMaterial);

        backHatCube.visible = true;
        back_layer.add(backHatCube);
    }

    // Head
    function renderHead() {

        var headCube = new THREE.BoxGeometry(8, 8, 8);

        // Material
        var headMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            alphaTest: 0.5,
            transparent: true,
            side: THREE.DoubleSide,
        });

        headCube.faceVertexUvs[0][0] = [frontface[3], frontface[0], frontface[2]];
        headCube.faceVertexUvs[0][1] = [frontface[0], frontface[1], frontface[2]];

        headCube.faceVertexUvs[0][2] = [backface[3], backface[0], backface[2]];
        headCube.faceVertexUvs[0][3] = [backface[0], backface[1], backface[2]];

        headCube.faceVertexUvs[0][4] = [topface[2], topface[3], topface[1]];
        headCube.faceVertexUvs[0][5] = [topface[3], topface[0], topface[1]];

        headCube.faceVertexUvs[0][6] = [bottomface[3], bottomface[2], bottomface[0]];
        headCube.faceVertexUvs[0][7] = [bottomface[2], bottomface[1], bottomface[0]];

        headCube.faceVertexUvs[0][8] = [rightface[3], rightface[0], rightface[2]];
        headCube.faceVertexUvs[0][9] = [rightface[0], rightface[1], rightface[2]];

        headCube.faceVertexUvs[0][10] = [leftface[3], leftface[0], leftface[2]];
        headCube.faceVertexUvs[0][11] = [leftface[0], leftface[1], leftface[2]];

        var head = new THREE.Mesh(headCube, headMaterial);

        head.visible = true;
        main_object.add(head);
    }

    // Front Hat
    function renderFrontHat() {

        var frontHatOverlay = new THREE.BoxGeometry(8.5, 8.5, 8.5);

        // Material
        var frontHatMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            alphaTest: 0.1,
            transparent: true,
            side: THREE.FrontSide,
        });

        frontHatOverlay.faceVertexUvs[0][0] = [fronthat[3], fronthat[0], fronthat[2]];
        frontHatOverlay.faceVertexUvs[0][1] = [fronthat[0], fronthat[1], fronthat[2]];

        frontHatOverlay.faceVertexUvs[0][2] = [backhat[3], backhat[0], backhat[2]];
        frontHatOverlay.faceVertexUvs[0][3] = [backhat[0], backhat[1], backhat[2]];

        frontHatOverlay.faceVertexUvs[0][4] = [tophat[2], tophat[3], tophat[1]];
        frontHatOverlay.faceVertexUvs[0][5] = [tophat[3], tophat[0], tophat[1]];

        frontHatOverlay.faceVertexUvs[0][6] = [bottomhat[3], bottomhat[2], bottomhat[0]];
        frontHatOverlay.faceVertexUvs[0][7] = [bottomhat[2], bottomhat[1], bottomhat[0]];

        frontHatOverlay.faceVertexUvs[0][8] = [righthat[3], righthat[0], righthat[2]];
        frontHatOverlay.faceVertexUvs[0][9] = [righthat[0], righthat[1], righthat[2]];

        frontHatOverlay.faceVertexUvs[0][10] = [lefthat[3], lefthat[0], lefthat[2]];
        frontHatOverlay.faceVertexUvs[0][11] = [lefthat[0], lefthat[1], lefthat[2]];

        var frontHatCube = new THREE.Mesh(frontHatOverlay, frontHatMaterial);

        frontHatCube.visible = true;
        main_object.add(frontHatCube);
    }

    /* back_layer.rotation.x -= 2;
    main_object.rotation.x -= 2; */

    renderBackHat();
    renderHead();
    renderFrontHat();

    var animate = function () {
        requestAnimationFrame(animate);

        /* back_layer.rotation.y -= 0.01;
        back_layer.rotation.x -= 0.01;
        main_object.rotation.x -= 0.01;
        main_object.rotation.y -= 0.01; */


        renderer.clear();
        renderer.setViewport(0, 0, width, height);
        renderer.render(scene2, camera);

        renderer.clearDepth(); // important! clear the depth buffer
        renderer.setViewport(0, 0, width, height);
        renderer.render(scene, camera);

    };

    animate();
    renderImageUrl(renderer.domElement.toDataURL());
}

function renderImageUrl(uri) {
    $img.attr("src", uri);
    $imgLink.attr("href", uri);
    $imgLink.removeClass('hidden');
    toggleImageLoader();
}

function makeSprite() {
    const scale = 8;
    spriteCanvas.clearRect(0, 0, spriteCanvas.canvas.width, spriteCanvas.canvas.height);
    let cnv = context.canvas
    spriteCanvas.imageSmoothingEnabled = false;
    spriteCanvas.drawImage(cnv, -8 * scale, -8 * scale, cnv.width * scale, cnv.height * scale);
    spriteCanvas.drawImage(cnv, -40 * scale, -8 * scale, cnv.width * scale, cnv.height * scale);

    renderSpriteUrl(spriteCanvas.canvas.toDataURL("image/png"));
}

function renderSpriteUrl(uri) {
    $sprite.attr("src", uri);
    $spriteLink.attr("href", uri.replace("image/png", "image/octet-stream"));
    $spriteLink.removeClass('hidden');
}