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
    if (!window.itemList) {
        console.log('Hello');
        //Send an issue here saying data not yet loaded.
    } else {
        const thing = document.getElementById(input_type).value.toLowerCase();
        console.log(thing);
        for (let i = 0; i < window.itemList.length; i++) {
            if (window.itemList[i][input_type].toLowerCase() == thing) {
                createInfobox(window.itemList[i]);
                break; 
            }
        }
    }
}

function toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function gemstoneHelper(gemstone) {
    gemstone = gemstone.toLowerCase();
    gemstone = gemstone.replace("_gem", "");
    gemstone = gemstone.replace("_", " ");
    return toTitleCase(gemstone);
}

function createInfobox(itemData) {
    console.log(itemData);
    let infobox = '{{Infobox ';
    if (itemData['category']) {
        let categories = {'SWORD': 'weapon',
                          'WAND': 'weapon',
                          'BOW': 'weapon',
                          'LONGSWORD': 'weapon',
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
    infobox += '\n|rarity = ' + itemData['tier'].toLowerCase() + '\n';
    infobox += '|id = ' + itemData['id'] + '\n';
    if (itemData['stats']) {
        const stat_keys = Object.keys(itemData['stats']);
        for (let i = 0; i < stat_keys.length; i++) {
            infobox += '|' + stat_keys[i].toLowerCase() + ' = ' + itemData['stats'][stat_keys[i]] + '\n';
        }
    }
    if (itemData['gemstone_slots']) {
        infobox += '|gemstone_slots = \n';
        for (let a = 0; a < itemData['gemstone_slots'].length; a++) {
            infobox += '1* ' + toTitleCase(itemData['gemstone_slots'][a]['slot_type']);
            if (itemData['gemstone_slots'][a]['costs']) {
                infobox += ' &'
                let len = itemData['gemstone_slots'][a]['costs'].length;
                for (let b = 0; b < len; b++) {
                    let cost =  itemData['gemstone_slots'][a]['costs'][b];
                    let keys = Object.keys(cost);
                    if (keys == 'coins') {
                        infobox += cost['coins'].toString();
                    } else {
                        infobox += cost['amount'].toString() + ' ' + gemstoneHelper(cost['item_id']);
                    }
                    if (!(b == len - 1)) {
                        infobox += ', ';
                    }
                }
                infobox += '&';
            }
            infobox += '\n';
        }
    }
    console.log(infobox);
    //Not done yet. I will finish some time in the future.
    if (itemData['upgrade_costs']) {
        createEssenceTable(itemData);
    }
}

function createEssenceTable {
    //Create essence table here
}
