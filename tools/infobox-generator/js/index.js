async function fetchItems() {
    const itemsData = await fetch('https://api.hypixel.net/resources/skyblock/items');   
    window.itemList = await itemsData.json();
    window.itemList = window.itemList['items'];
    console.log(window.itemList);
    const bazaarData = await fetch('https://api.hypixel.net/skyblock/bazaar');   
    window.bazaarList = await bazaarData.json();
    window.bazaarList = window.bazaarList['products'];
    console.log(window.bazaarList);
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

//Stolen from: https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
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
    infobox += '\n';
    if (itemData['tier']) {
        infobox += '|rarity = ' + itemData['tier'].toLowerCase() + '\n';
    }
    infobox += '|id = ' + itemData['id'] + '\n';
    //Future me implement tiered stats.
    if (itemData['stats']) {
        const stat_keys = Object.keys(itemData['stats']);
        for (let i = 0; i < stat_keys.length; i++) {
            if (stat_keys[i] == 'WALK_SPEED') {
                infobox += '|speed = ' + itemData['stats'][stat_keys[i]] + '\n';
            } else {
                infobox += '|' + stat_keys[i].toLowerCase() + ' = ' + itemData['stats'][stat_keys[i]] + '\n';
            }
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
    if (itemData['requirements'] || itemData['catacombs_requirements']) {
        let requirements = Object.assign(itemData['requirements'], itemData['catacombs_requirements']);
        if ('skill' in requirements) {
            if (requirements['skill']['type'].toLowerCase() == 'combat') {
                infobox += '|combat_level_requirement = {{Skl|combat|' + requirements['skill']['level'] + '}}\n';
            } else {
                infobox += '|other_level_requirement = {{Skl|' + requirements['skill']['type'].toLowerCase() + '|' + requirements['skill']['level'] + '}}\n';
            }
        }
        if ('slayer' in requirements) {
            infobox += '|slayer_level_requirement = ' + toTitleCase(requirements['slayer']['slayer_boss_type']) + ' Slayer ' + requirements['slayer']['level'].toString() + '\n';
        }
        if ('dungeon' in requirements) {
            infobox += '|dungeon_level_requirement = {{Skl|' + requirements['dungeon']['type'].toLowerCase() + '|' + requirements['dungeon']['level'] + '}}\n';
            if (itemData['dungeon_item_conversion_cost']) {
                infobox += ' (when dungeonized)';
            }
        }
        if ('dungeon_completion' in requirements) {
            let d_c = requirements['dungeon_completion'];
            infobox += '|dungeon_floor_clearing_requirement = ' + toTitleCase(d_c['type'].replace('_', ' ')) + ' Floor ' + romanize(d_c['tier']) + '\n';
            if (itemData['dungeon_item_conversion_cost']) {
                infobox += ' (when dungeonized)';
            }
        }
    }
    if (itemData['npc_sell_price']) {
        infobox += '|sell = ' + itemData['npc_sell_price'].toString() + '\n';
    }
    if (window.bazaarList[itemData['id']]) {
        infobox += '|bazaar = ' + toTitleCase(itemData['id']) + '\n';
    }
    console.log(infobox);
    //Not done yet. I will finish some time in the future.
    if (itemData['upgrade_costs']) {
        createEssenceTable(itemData);
    }
}

function createEssenceTable(itemData) {
    //Create essence table here
}
