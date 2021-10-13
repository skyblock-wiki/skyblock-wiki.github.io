import { Toast } from "../../../js/toast.js";
import { createImageThenRender } from "./draw.js";

export var context = $("#canvas").get(0).getContext("2d");
context.canvas.width = 64;
context.canvas.height = 16;
export var spriteCanvas = $("#spriteCanvas").get(0).getContext("2d");
spriteCanvas.canvas.width = 64;
spriteCanvas.canvas.height = 64;

export const $img = $("#drawn");
export const $imgLink = $("#drawnLink");
export const $sprite = $("#sprite");
export const $spriteLink = $("#spriteLink");

const $loading = $("#loading");
const $warning = $("#warning");

function clear() {
	$("#nbtInfo").html("");
	$imgLink.attr("href", "");
	$imgLink.attr("download", "");
	$imgLink.addClass("hidden");
	$spriteLink.attr("href", "");
	$spriteLink.attr("download", "");
	$spriteLink.addClass("hidden");
	$img.attr("src", "");
	$sprite.attr("src", "");
	$warning.html("");
	$(".sec-err").html("");
}

// ////////////////////////////
// Obtain texture from upload
// ////////////////////////////
$("#fileUpload").on("change", readImage);

function readImage() {
	clear();
	toggleImageLoader();
	if (this.files && this.files[0]) {
		const FR = new FileReader();

		FR.onload = function(e) {
			createImageThenRender(e.target.result);
		};
		FR.readAsDataURL(this.files[0]);
	}
	// var timestamp = new Date().toLocaleString("en-UK",{ hour12: false }).replace(/[\/:]/g, "-").replace(/,/g,"");
	const filename = this.files[0].name.replace(/\.[a-z]{2,4}$/, "").trim();

	$imgLink.attr("download", `${ filename } Head Render.png`.trim());
	$spriteLink.attr("download", `${ filename } Sprite Render.png`.trim());
	showImageLoader();
}

// ////////////////////////////
// Obtain texture from nbt data
// ////////////////////////////
const mainElem = {
	nbt: $("#nbt"),
	val: $("#val"),
	tid: $("#tid"),
};
const subElem = {
	nbt: $("#nbtSubmit"),
	val: $("#valSubmit"),
	tid: $("#tidSubmit"),
};
const errElem = {
	nbt: $("#nbtError"),
	val: $("#valError"),
	tid: $("#tidError"),
};const toStr = {
	nbt: "NBT Data",
	val: "command",
	tid: "texture ID",
};

mainElem.nbt.on("paste", onNbtChanged);
mainElem.nbt.on("input", onNbtChanged);
subElem.nbt.on("click", onNbtChanged);
mainElem.val.on("paste", onValChanged);
mainElem.val.on("input", onValChanged);
subElem.val.on("click", onValChanged);
mainElem.tid.on("paste", onTidChanged);
mainElem.tid.on("input", onTidChanged);
subElem.tid.on("click", onTidChanged);

$("#copy-id").on("click", () => {
	copyText("#textureID");
});
$("#copy-template").on("click", () => {
	copyText("#textureTemplate");
});
$("#open-id").on("click", () => {
	openTexture("#textureID");
});

function copyText(selector) {
	const el = $(selector);

	el.select();
	document.execCommand("copy");
	el.blur();
	document.getSelection().removeAllRanges();
	new Toast({
		message: "Copied!",
		type: "success",
		time: 2000,
	}).show();
}

function openTexture(selector) {
	const ID = $(selector).val();

	openLink(`http://textures.minecraft.net/texture/${ ID }`);
}

function openLink(url) {
	// source: https://stackoverflow.com/questions/19851782/how-to-open-a-url-in-a-new-tab-using-javascript-or-jquery
	const tab = window.open(url, "_blank");

	if (tab)
		// Browser has allowed it to be opened
		tab.focus();
	 else
		// Browser has blocked it
		new Toast({
			message: "Could not copy. Please allow popups for this website!",
			type: "disallow",
			time: 4000,
		}).show();
}

function updateNBTInfo(ID) {
	$("#textureID").val(ID);
	$("#textureTemplate").val(`{{HeadRender|${ ID }}}`);
	$(".nbtInfo button").prop("disabled", false);
}

function _onTidChanged(url, elm, filename = null) {
	$imgLink.attr("download", `${ filename? filename.trim(): "" } Head Render.png`.trim());
	$spriteLink.attr("download", `${ filename? filename.trim(): "" } Sprite Render.png`.trim());
	updateNBTInfo(url.split("/texture/")[1]);
	$warning.html(`If it keeps loading without showing a render, the ${ toStr[elm] } is most likely invalid.`);

	// Now fetch image data and then load/render it!
	clrError();
	setTimeout(() => {
		// Clear it so it's easier to paste next data if there is any
		mainElem[elm].val("");
	}, 100);
	toggleImageLoader();
	readImageUrl(url);
}

function _onValChanged(textureData, elm, filename = null) {
	// The data in encoded, so decode from Base64 format
	textureData = atob(textureData);
	if (!textureData.match(/{\\&quot;/g))
		textureData = textureData.replace(/(\w+)(?=:)/g, s => {
			if (s.match(/http|https/g)) return s;
			else return `"${ s }"`;
		});

	// parse it as json as well
	try {
		textureData = JSON.parse(textureData);
	} catch (e) {
		console.log(e.toString());

		return nbtError("Error parsing texture data", elm);
	}
	//  Find url in texture data
	const url = textureData?.textures?.SKIN?.url;

	if (!url)
		return nbtError("Texture data doesn't contain head url", elm);


	$imgLink.attr("download", "Head Render.png");
	$spriteLink.attr("download", "Sprite Render.png");
	_onTidChanged(url, elm, filename);
}

function onTidChanged(event) {
	clear();
	if (!mainElem.tid.val()) return;
	let tidText = (event.clipboardData || window.clipboardData)?.getData("text") || mainElem.tid.val();

	tidText = tidText.replace(/\W/g, "").toLowerCase();
	if (!/^[a-f0-9]{59,64}$/i.test(tidText))
		return nbtError("Not a valid texture ID", "tid");

	const url = `http://textures.minecraft.net/texture/${ tidText }`;

	_onTidChanged(url, "tid");
}

function onValChanged(event) {
	clear();
	if (!mainElem.val.val()) return;
	let textureData = (event.clipboardData || window.clipboardData)?.getData("text") || mainElem.val.val();

	if (textureData.match(/Value\s*:\s*"\s*([A-Za-z0-9]*)=*\s*"/g))
		textureData = textureData.match(/(?<=Value\s*:\s*"\s*)([A-Za-z0-9]*)(?==*\s*")/g);
	 else
		textureData = textureData.match(/(?<=\s*)([A-Za-z0-9]*)(?==*\s*)/g);

	if (textureData.length < 1)
		return nbtError("Not a valid Texture Value", "val");

	_onValChanged(textureData[0], "val");
}

function onNbtChanged(event) {
	clear();
	// Parse as json - if paste event copy from clipboard, otherwise grab from textarea itself
	const nbt = (event.clipboardData || window.clipboardData)?.getData("text") || mainElem.nbt.val();

	if (!nbt)
		return clrError();


	const json = parseNBT(nbt);

	if (!json)
		return nbtError("Error parsing nbt", "nbt");


	// Now find the data we need in json
	const textureData = json?.tag?.SkullOwner?.Properties?.textures?.[0]?.Value;

	if (!textureData)
		return nbtError("Json not in correct format for head data", "nbt");

	const fileName = (json?.tag?.display?.Name || "undefined").replace(/§\w/, "");

	_onValChanged(textureData, "nbt", fileName);
}

$("#nbtClear").on("click", () => {
	mainElem.nbt.val("");
	clrError();
});
$("#valClear").on("click", () => {
	mainElem.val.val("");
	clrError();
});
$("#tidClear").on("click", () => {
	mainElem.tid.val("");
	clrError();
});

async function readImageUrl(url) {
	// Since canvas drawing requires CORS, we can get around this by passing it to a third party tool
	await fetch(`https://hsw-cors.herokuapp.com/${ url.split("//")[1] }`).then(response => {
		if (response.status >= 400 && response.status < 600)
			throw new Error();

		return response;
	}).then(b => b.blob()).then(blob => {
		createImageThenRender(URL.createObjectURL(blob));
	}).catch(err => {
		new Toast({
			message: "Render Unsuccessful: Unknown Texture ID",
			type: "error",
			time: 3500,
		}).show();
		toggleImageLoader();
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
		// actual parser here
		nbt = nbt.replace(/\n/g, "");
		nbt = nbt.replace(/([_a-zA-Z]+?): ?(["|\d|\{|\[])(?!\s*,\s*)/g, "\"$1\": $2");
		nbt = nbt.replace(/: ?(\d+?)[bsfl]/g, ": $1");
		nbt = nbt.replace(/\d+?\s*:\s*(["\{\[])/g, "$1");
		nbt = nbt.replace(/": ?1b/g, "\": true");
		nbt = nbt.replace(/": ?0b/g, "\": false");

		return JSON.parse(nbt);
	} catch (e) {
		$("#nbtInfo").html(`<table>${ [
			["NBT", nbt],
			["Error", e],
		].map(([th, td]) => `<tr><th>${ th }: </th><td>${ td }</td></tr>`).join("") }</table>`);

		return null;
	}
}

export function toggleImageLoader() {
	$loading.toggle();
	$warning.toggle();
}