import { Toast } from '../../../js/toast.js';

var context = $("#canvas").get(0).getContext("2d");
context.canvas.width = 64;
context.canvas.height = 16;
var spriteCanvas = $("#spriteCanvas").get(0).getContext("2d");
spriteCanvas.canvas.width = 64;
spriteCanvas.canvas.height = 64;

const textureCanvas = $("canvas").get(0).getContext('2d');
textureCanvas.canvas.width = 64;
textureCanvas.canvas.height = 16;

let $img = $("#drawn");
let $imgLink = $("#drawnLink");
let $sprite = $("#sprite");
let $spriteLink = $("#spriteLink");

function clear() {
    $("#nbtInfo").html("");
    $imgLink.attr("href", "");
    $imgLink.attr("download", "");
    $imgLink.addClass('hidden');
    $spriteLink.attr("href", "");
    $spriteLink.attr("download", "");
    $spriteLink.addClass('hidden');
    $img.attr("src", "");
    $sprite.attr("src", "");
    $("#warning").html("");
    $(".sec-err").html("");
}

//////////////////////////////
// Obtain texture from upload
//////////////////////////////
$("#fileUpload").on("change", readImage, false);

function readImage() {
    clear();
    if (this.files && this.files[0]) {
        var FR = new FileReader();
        FR.onload = function (e) {
            createImageThenRender(e.target.result);
        };
        FR.readAsDataURL(this.files[0]);
    }
    // var timestamp = new Date().toLocaleString("en-UK",{ hour12: false }).replace(/[\/:]/g, "-").replace(/,/g,"");
    let filename = this.files[0].name.replace(/\.[a-z]{2,4}$/, '').trim();
    $imgLink.attr("download" ,`${filename} Head Render.png`.trim());
    $spriteLink.attr("download" ,`${filename} Sprite Render.png`.trim());
    showImageLoader();
}

//////////////////////////////
// Obtain texture from nbt data
//////////////////////////////
const mainElem = {
    nbt: $("#nbt"),
    val: $("#val"),
    tid: $("#tid"),
}
const subElem = {
    nbt: $("#nbtSubmit"),
    val: $("#valSubmit"),
    tid: $("#tidSubmit"),
}
const errElem = {
    nbt: $("#nbtError"),
    val: $("#valError"),
    tid: $("#tidError"),
}

const toStr = {
    nbt: "NBT Data",
    val: "command",
    tid: "texture ID",
}

mainElem.nbt.on("paste", onNbtChanged);
mainElem.nbt.on("input", onNbtChanged);
subElem.nbt.on("click", onNbtChanged);
mainElem.val.on("paste", onValChanged);
mainElem.val.on("input", onValChanged);
subElem.val.on("click", onValChanged);
mainElem.tid.on("paste", onTidChanged);
mainElem.tid.on("input", onTidChanged);
subElem.tid.on("click", onTidChanged);

$('#copy-id').on('click', () => {
    copyText('#textureID')
});
$('#copy-template').on('click', () => {
    copyText('#textureTemplate')
});
$('#open-id').on('click', () => {
    openTexture('#textureID')
});

function copyText(selector) {
    let el = $(selector);
    el.select();
    document.execCommand('copy');
    el.blur();
    document.getSelection().removeAllRanges();
    new Toast({
        message: "Copied!",
        type: "success",
        time: 2000
    }).show();
}

function openTexture(selector) {
    let ID = $(selector).val();
    openLink(`http://textures.minecraft.net/texture/${ID}`);
}

function openLink(url) {
    //source: https://stackoverflow.com/questions/19851782/how-to-open-a-url-in-a-new-tab-using-javascript-or-jquery
    var tab = window.open(url, '_blank');
    if (tab) {
        //Browser has allowed it to be opened
        tab.focus();
    } else {
        //Browser has blocked it
        new Toast({
            message: "Could not copy. Please allow popups for this website!",
            type: "disallow",
            time: 4000
        }).show();
    }
}

function updateNBTInfo(ID) {
    $('#textureID').val(ID);
    $('#textureTemplate').val(`{{HeadRender|${ID}}}`);
    $('.nbtInfo button').prop("disabled", false);
}

function _onTidChanged(url, elm, filename = null) {
    $imgLink.attr("download", `${filename? filename.trim(): ''} Head Render.png`.trim());
    $spriteLink.attr("download", `${filename? filename.trim(): ''} Sprite Render.png`.trim());
    updateNBTInfo(url.split('/texture/')[1]);
    $("#warning").html("If it keeps loading without showing a render, the " + toStr[elm] + " is most likely invalid.");

    // Now fetch image data and then load/render it!
    clrError();
    setTimeout(function () {
        // Clear it so it's easier to paste next data if there is any
        mainElem[elm].val("");
    }, 100);
    showImageLoader();
    readImageUrl(url);
}

function _onValChanged(textureData, elm, filename = null) {
    // The data in encoded, so decode from Base64 format
    textureData = atob(textureData);
    if (!textureData.match(/{\\&quot;/g)) {
        textureData = textureData.replace(/(\w+)(?=:)/g, s => {
            if (s.match(/http|https/g)) return s;
            else return `"${s}"`;
        });
    }
    // parse it as json as well
    try {
        textureData = JSON.parse(textureData);
    } catch (e) {
        console.log(e.toString());
        return nbtError("Error parsing texture data", elm);
    }
    //  Find url in texture data
    let url = textureData?.textures?.SKIN?.url;
    if (!url) {
        return nbtError("Texture data doesn't contain head url", elm);
    }

    $imgLink.attr("download" ,`Head Render.png`);
    $spriteLink.attr("download" ,`Sprite Render.png`);
    _onTidChanged(url, elm, filename);
}

function onTidChanged(event) {
    clear();
    if (!mainElem.tid.val()) return;
    let tidText = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.tid.val();
    tidText = tidText.replace(/\W/g, '').toLowerCase();
    if (!/^[a-f0-9]{59,64}$/i.test(tidText)) {
        return nbtError("Not a valid texture ID", "tid");
    }
    let url = "http://textures.minecraft.net/texture/" + tidText;
    _onTidChanged(url, "tid");
}

function onValChanged(event) {
    clear();
    if (!mainElem.val.val()) return;
    let textureData = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem["val"].val();
    if (textureData.match(/Value\s*:\s*"\s*([A-Za-z0-9]*)=*\s*"/g)) {
        textureData = textureData.match(/(?<=Value\s*:\s*"\s*)([A-Za-z0-9]*)(?==*\s*")/g);
    } else {
        textureData = textureData.match(/(?<=\s*)([A-Za-z0-9]*)(?==*\s*)/g)
    }
    if (textureData.length < 1) {
        return nbtError("Not a valid Texture Value", "val");
    }
    _onValChanged(textureData[0], "val");
}

function onNbtChanged(event) {
    clear();
    // Parse as json - if paste event copy from clipboard, otherwise grab from textarea itself
    let nbt = (event.clipboardData || window.clipboardData)?.getData('text') || mainElem.nbt.val();
    if (!nbt) {
        return clrError();
    }

    let json = parseNBT(nbt);
    if (!json) {
        return nbtError("Error parsing nbt", "nbt");
    }

    // Now find the data we need in json
    let textureData = json?.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;
    if (!textureData) {
        return nbtError("Json not in correct format for head data", "nbt");
    }
    const fileName = (json?.tag?.display?.Name || "undefined").replace(/§\w/, "");
    _onValChanged(textureData, "nbt", fileName);
}

$("#nbtClear").on("click", function () {
    mainElem.nbt.val("");
    clrError();
});
$("#valClear").on("click", function () {
    mainElem.val.val("");
    clrError();
});
$("#tidClear").on("click", function () {
    mainElem.tid.val("");
    clrError();
});

async function readImageUrl(url) {
    // Since canvas drawing requires CORS, we can get around this by passing it to a third party tool
    await fetch(`https://hsw-cors.herokuapp.com/${url.split("//")[1]}`).then((response) => {
        if (response.status >= 400 && response.status < 600) {
            throw new Error();
        }
        return response;
    }).then(b => b.blob()).then((blob) => {
        createImageThenRender(URL.createObjectURL(blob));
    }).catch((err) => {
        new Toast({
            message: `Render Unsuccessful: Unknown Texture ID`,
            type: "error",
            time: 3500
        }).show();
    });
}

function nbtError(error, elm) {
    errElem[elm].html(error);
}

function clrError() {
    Object.values(errElem).forEach(el => {
        el.html("");
    });
}

// Source: https://jsfiddle.net/joker876/ygm834cd
function parseNBT(nbt) {
    try {
        //actual parser here
        nbt = nbt.replace(/\n/g, '');
        nbt = nbt.replace(/([_a-zA-Z]+?): ?(["|\d|\{|\[])(?!\s*,\s*)/g, '"$1": $2');
        nbt = nbt.replace(/: ?(\d+?)[bsfl]/g, ': $1');
        nbt = nbt.replace(/\d+?\s*:\s*(["\{\[])/g, '$1');
        nbt = nbt.replace(/": ?1b/g, '": true');
        nbt = nbt.replace(/": ?0b/g, '": false');
        return JSON.parse(nbt);
    } catch (e) {
        $("#nbtInfo").html(`<table>${[
            ["NBT", nbt],
            ["Error", e]
        ].map(([th,td])=>`<tr><th>${th}: </th><td>${td}</td></tr>`).join("")}</table>`);
        return null;
    }
}


//////////////////////////////
// Pre-Render
//////////////////////////////
function showImageLoader() {
    $img.attr("src", "https://vignette.wikia.nocookie.net/dev/images/4/42/Loading.gif");
}

function createImageThenRender(imageSrc) {
    var $textureImage = $('<img>');
    $textureImage.attr("src", imageSrc);

    $textureImage.on("load", function () {
        let _img = $textureImage.get(0);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(_img, 0, 0);

        textureCanvas.clearRect(0, 0, context.canvas.width, context.canvas.height);
        textureCanvas.drawImage(_img, 0, 0);

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

    const texture = new THREE.CanvasTexture(textureCanvas.canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;


    // Initialize scene
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    const main_object = new THREE.Object3D();
    const back_layer = new THREE.Object3D();

    var width = 300;
    var height = 300;

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

function makeSprite() {
    const scale = 8;
    spriteCanvas.clearRect(0, 0, spriteCanvas.canvas.width, spriteCanvas.canvas.height);
    let cnv = textureCanvas.canvas
    spriteCanvas.imageSmoothingEnabled = false;
    spriteCanvas.drawImage(cnv, -8 * scale, -8 * scale, cnv.width * scale, cnv.height * scale);
    spriteCanvas.drawImage(cnv, -40 * scale, -8 * scale, cnv.width * scale, cnv.height * scale);

    renderSpriteUrl(spriteCanvas.canvas.toDataURL("image/png"));
}

function renderImageUrl(uri) {
    $img.attr("src", uri);
    $imgLink.attr("href", uri);
    $imgLink.removeClass('hidden');
}

function renderSpriteUrl(uri) {
    $sprite.attr("src", uri);
    $spriteLink.attr("href", uri.replace("image/png", "image/octet-stream"));
    $spriteLink.removeClass('hidden');
}