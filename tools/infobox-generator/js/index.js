async function fetchItems() {
    const itemData = await fetch('https://api.hypixel.net/resources/skyblock/items');   
    window.itemList = await itemData.json();
    window.itemList = window.itemList['items'];
    console.log(window.itemList);
}

fetchItems();

const $loading = $('#loading');
const $warning = $('#warning');

function clear() {
    $('#nbtInfo').html('');
    $imgLink.attr('href', '');
    $imgLink.attr('download', '');
    $imgLink.addClass('hidden');
    $spriteLink.attr('href', '');
    $spriteLink.attr('download', '');
    $spriteLink.addClass('hidden');
    $img.attr('src', '');
    $sprite.attr('src', '');
    $warning.html('');
    $('.sec-err').html('');
}

const mainElem = {
    name: $('#name'),
    id: $('#id'),
};
const subElem = {
    name: $('#nameSubmit'),
    id: $('#idSubmit'),
};
const errElem = {
    name: $('#nameError'),
    id: $('#idError'),
};
const toStr = {
    name: 'name',
    id: 'item ID',
};

mainElem.name.on('paste', onNameChanged);
mainElem.name.on('input', onNameChanged);
subElem.name.on('click', onNameChanged);
mainElem.id.on('paste', onIdChanged);
mainElem.id.on('input', onIdChanged);
subElem.id.on('click', onIdChanged);

function onNameChanged(event) {
    onChanged('name');
}

function onIdChanged(event) {
    onChanged('id');
}

function onChanged(input_type) {
    console.log('This is being called');
    if (!window.itemList) {
        console.log('Hello');
        //Send an issue here saying data not yet loaded.
    } else {
        const thing = document.getElementById(input_type).value.toLowerCase();
        console.log(thing);
        for (let i = 0; i < window.itemList.length; i++) {
            if (window.itemList[i][input_type].toLowerCase() == thing) {
                create_infobox(window.itemList[i]);
                break; 
            }
        }
    }
}

function create_infobox(itemData) {
    console.log(itemData);
    let infobox = '{{Infobox ';
    if (itemData['category']) {
        let categories = {'SWORD': 'weapon',
                          'WAND': 'weapon',
                          'BOW': 'weapon',
                          'DEPLOYABLE': 'item',
                          'COSMETIC': 'item',
                          'TRAVEL_SCROLL': 'item',
                          'ACCESSORY': 'accessory',
                          'HELMET': 'armor',
                          'CHESTPLATE': 'armor',
                          'LEGGINGS': 'armor',
                          'BOOTS': 'boots',
                          'PET_ITEM': 'item',
                          'ARROW_POISON': 'item',
                          'GAUNTLET': 'item',
                          'BELT': 'item',
                          'BRACELET': 'item',
                          'CLOAK': 'item',
                          'GLOVES': 'item',
                          'NECKLACE': 'item',
                          'DUNGEON_PASS': 'item',
                          'REFORGE_STONE': 'reforge stone',
                          'BAIT': 'item',
                          'AXE': 'item',
                          'HOE': 'item',
                          'SPADE': 'item',
                          'PICKAXE': 'item',
                          'FISHING_ROD': 'fishing rod',
                         }
        infobox += categories[itemData['category']];
    } else {
        infobox += 'item';
    }
    infobox += '\n|rarity = ';
    infobox += itemData['tier'].toLowerCase() + '\n';
    if (itemData['stats']) {
        const stat_keys = Object.keys(itemData['stats']);
        for (let i = 0; i < stat_keys.length; i++) {
            infobox += '|' + stat_keys[i].toLowerCase() + ' = ' + itemData['stats'][stat_keys[i]];
        }
    }
    console.log(infobox);
    //Not done yet. I will finish some time in the future.
}
