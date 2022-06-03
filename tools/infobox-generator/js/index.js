import { Toast } from '../../../js/toast.js';

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

window.settings = {'title': false};

function clear() {
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
        for (let i = 0; i < window.itemList.length; i++) {
            if (window.itemList[i][input_type].toLowerCase() == thing) {
                createInfobox(window.itemList[i]);
                break; 
            }
        }
    }
}

$('#copy-infobox').on('click', () => {
    copyText('#infobox');
});

$('#copy-essenceTable').on('click', () => {
    copyText('#essenceTable');
});

function copyText(selector) {
    const el = $(selector);
    try {
        window.navigator.clipboard.writeText(el.html());
        new Toast({
            message: 'Copied!',
            type: 'success',
            time: 2000,
        }).show();
        console.log(el.innerHTML);
    } catch (error) {
        console.error(error);
        new Toast({
            message: 'Could not copy. Please try again!',
            type: 'disallow',
            time: 4000,
        }).show();
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
                          'SHEARS': 'item',
                          'PICKAXE': 'item',
                          'FISHING_ROD': 'fishing rod',
                         };
        infobox += categories[itemData['category']];
    } else {
        infobox += 'item';
    }
    infobox += '<br>';
    if (window.settings['title']) {
        infobox += '|title = ' + itemData['name'] + '<br>';
        infobox += '|image = ' + itemData['name'] + '.png<br>';
        infobox += '|slot_item = ' + itemData['name'] + '<br>';
    }
    if (itemData['tier']) {
        infobox += '|rarity = ' + itemData['tier'].toLowerCase() + '<br>';
    }
    infobox += '|id = ' + itemData['id'] + '<br>';
    let percentages = {'attack_speed': true,
                           'critical_chance': true,
                           'critical_damage': true,
                           'sea_creature_chance': true,
                          };
    if (itemData['stats']) {
        const stat_keys = Object.keys(itemData['stats']);
        for (let i = 0; i < stat_keys.length; i++) {
            if (stat_keys[i] == 'WALK_SPEED') {
                infobox += '|speed = ' + itemData['stats'][stat_keys[i]] + '<br>';
            } else {
                let percent = '';
                if (percentages[stat_keys[i].toLowerCase()]) {
                    percent = '%';
                }
                infobox += '|' + stat_keys[i].toLowerCase() + ' = ' + itemData['stats'][stat_keys[i]] + percent + '<br>';
            }
        }
    }
    if (itemData['tiered_stats']) {
        const stat_keys = Object.keys(itemData['tiered_stats']);
        for (let i = 0; i < stat_keys.length; i++) {
            let a = itemData['tiered_stats'][stat_keys[i]][0];
            let b = itemData['tiered_stats'][stat_keys[i]][itemData['tiered_stats'][stat_keys[i]].length - 1];
            let stat;
            if (a == b) {
                stat = a.toString();
            } else {
                if (a < b) {
                    stat = a.toString() + '-' + b.toString();
                } else {
                    stat = b.toString() + '-' + a.toString();
                }
            }
            if (stat_keys[i] == 'WALK_SPEED') {
                infobox += '|speed = ' + stat + '<br>';
            } else {
                let percent = '';
                if (percentages[stat_keys[i].toLowerCase()]) {
                    percent = '%';
                }
                infobox += '|' + stat_keys[i].toLowerCase() + ' = ' + stat + percent + '<br>';
            }
        }
    }
    if (itemData['gemstone_slots']) {
        infobox += '|gemstone_slots = <br>';
        for (let a = 0; a < itemData['gemstone_slots'].length; a++) {
            infobox += '1* ' + toTitleCase(itemData['gemstone_slots'][a]['slot_type']);
            if (itemData['gemstone_slots'][a]['costs']) {
                infobox += ' &'
                let len = itemData['gemstone_slots'][a]['costs'].length;
                for (let b = 0; b < len; b++) {
                    let cost =  itemData['gemstone_slots'][a]['costs'][b];
                    if ('coins' in cost) {
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
            infobox += '<br>';
        }
    }
    if (itemData['requirements'] || itemData['catacombs_requirements']) {
        let requirements;
        if (itemData['requirements']) {
            requirements = Object.assign(itemData['requirements'], itemData['catacombs_requirements']);
        } else {
            requirements = itemData['catacombs_requirements'];
        }
        if ('skill' in requirements) {
            let s_l = requirements['skill'];
            if (s_l['type'].toLowerCase() == 'combat') {
                infobox += '|combat_level_requirement = {{Skl|combat|' + s_l['level'] + '}}<br>';
            } else {
                infobox += '|other_level_requirement = {{Skl|' + s_l['type'].toLowerCase() + '|' + s_l['level'] + '}}<br>';
            }
        }
        if ('slayer' in requirements) {
            let s_l = requirements['slayer'];
            infobox += '|slayer_level_requirement = ' + toTitleCase(s_l['slayer_boss_type']) + ' Slayer ' + s_l['level'].toString() + '<br>';
        }
        if ('dungeon' in requirements) {
            let d_l = requirements['dungeon'];
            infobox += '|dungeon_level_requirement = {{Skl|' + d_l['type'].toLowerCase() + '|' + d_l['level'] + '}}';
            if (itemData['dungeon_item_conversion_cost']) {
                infobox += ' (when dungeonized)';
            }
            infobox += '<br>';
        }
        if ('dungeon_completion' in requirements) {
            let d_c = requirements['dungeon_completion'];
            infobox += '|dungeon_floor_clearing_requirement = ' + toTitleCase(d_c['type'].replace('_', ' ')) + ' Floor ' + romanize(d_c['tier']);
            if (itemData['dungeon_item_conversion_cost']) {
                infobox += ' (when dungeonized)';
            }
            infobox += '<br>';
        }
    }
    if (itemData['category'] != 'REFORGE_STONE' && itemData['category'] != 'ACCESSORY') {
        infobox += '|enchant = u<br>|reforge = u<br>';
    }
    if (window.bazaarList[itemData['id']]) {
        infobox += '|auctionable = No<br>';
    } else {
        if (itemData['soulbound']) {
            infobox += '|auctionable = No<br>';
        } else {
            infobox += '|auctionable = u<br>';
        }
    }
    if (itemData['soulbound']) {
        if (itemData['soulbound'].toLowerCase() == 'coop') {
            infobox += '|tradeable = {{No|text=y}}<br>(Except to Co-op members)<br>';
        } else {
            infobox += '|tradeable = No<br>';
        }
    } else {
        infobox += '|tradeable = u<br>';
    }
    if ('museum' in itemData) {
        if (itemData['museum'] == true) {
            infobox += '|museum = Yes<br>';
        } else {
            infobox += '|museum = No<br>';
        }
    } else {
        infobox += '|museum = u<br>';
    }
    if (itemData['npc_sell_price']) {
        infobox += '|salable = Yes<br>';
        infobox += '|sell = ' + itemData['npc_sell_price'].toString() + '<br>';
    } else {
        infobox += '|salable = No<br>';
    }
    if (window.bazaarList[itemData['id']]) {
        infobox += '|bazaar = ' + itemData['id'] + '<br>';
    }
    if ('color' in itemData) {
        let color = itemData['color'].split(',');
        let hex = '';
        for (let i = 0; i < 3; i++) {
            hex += Number(color[i]).toString(16);
        }
        infobox += '|color = ' + hex + '<br>';
    }
    infobox += '}}';
    $('#copy-infobox').prop('disabled', false);
    $('#infobox').parent().removeClass('unselectable');
    console.log(infobox);
    document.getElementById('infobox').innerHTML = infobox;
    if (itemData['upgrade_costs']) {
        createEssenceTable(itemData);
    }
}

function createEssenceTable(itemData) {
    //Create essence table here
}
