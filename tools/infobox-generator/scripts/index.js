import { Toast } from '../../../scripts/toast.js';

const itemsData = (await (await fetch('https://api.hypixel.net/resources/skyblock/items')).json()).items;
const bazaarData = (await (await fetch('https://api.hypixel.net/skyblock/bazaar')).json()).products;

let includeExtra = false;

const nameInput = document.getElementById('name');
const nameSubmitButton = document.getElementById('name-submit');
const nameClearButton = document.getElementById('name-clear');

const idInput = document.getElementById('id');
const idSubmitButton = document.getElementById('id-submit');
const idClearButton = document.getElementById('id-clear');

const includeExtraCheckbox = document.getElementById('include-extra');

const infoboxElement = document.getElementById('infobox');
const copyInfoboxButton = document.getElementById('copy-infobox');

const essenceTableElement = document.getElementById('essence-table');
const copyEssenceTableButton = document.getElementById('copy-essence-table');

nameSubmitButton.addEventListener('click', () => {
    triggerCreation('name', nameInput.value);
});

nameClearButton.addEventListener('click', () => {
    nameInput.value = '';
    infoboxElement.innerHTML = '&ZeroWidthSpace;';
    copyInfoboxButton.disabled = true;
    essenceTableElement.innerHTML = '&ZeroWidthSpace;';
    copyEssenceTableButton.disabled = true;
    new Toast({
        message: 'Cleared!',
        type: 'success',
        time: 1000,
    }).show();
});

idSubmitButton.addEventListener('click', () => {
    triggerCreation('id', idInput.value);
});

idClearButton.addEventListener('click', () => {
    idInput.value = '';
    infoboxElement.innerHTML = '&ZeroWidthSpace;';
    copyInfoboxButton.disabled = true;
    essenceTableElement.innerHTML = '&ZeroWidthSpace;';
    copyEssenceTableButton.disabled = true;
    new Toast({
        message: 'Cleared!',
        type: 'success',
        time: 1000,
    }).show();
});

includeExtraCheckbox.addEventListener('input', () => {
    includeExtra = includeExtraCheckbox.checked;
});

copyInfoboxButton.addEventListener('click', () => {
    copyText('infobox');
});

copyEssenceTableButton.addEventListener('click', () => {
    copyText('essence-table');
});

/**
 * Handles the creation input
 * @param {'name'|'id'} inputType the type of input
 * @param {string} inputValue the value of the input
 * @returns {void}
 */
function triggerCreation(inputType, inputValue) {
    if (!itemsData) {
        new Toast({
            message: 'The item list has not yet loaded. Please wait or try refreshing the page!',
            type: 'disallow',
            time: 4000,
        }).show();
    } else {
        for (const index in itemsData) {
            const item = itemsData[index];
            if (inputValue.toLowerCase() === item[inputType].toLowerCase()) {
                return createInfobox(item);
            }
        }

        new Toast({
            message: 'The item you entered does not exist!',
            type: 'disallow',
            time: 2000,
        }).show();
    }
}

/**
 * Copies an element's innerHTML to the clipboard
 * @param {string} id the id of the element to copy
 */
function copyText(id) {
    try {
        window.navigator.clipboard.writeText(document.getElementById(id).innerHTML.replaceAll('<br>', '\n'));
        new Toast({
            message: 'Copied!',
            type: 'success',
            time: 2000,
        }).show();
    } catch (error) {
        new Toast({
            message: 'Unable to copy, please try again!',
            type: 'disallow',
            time: 4000,
        }).show();
    }
}

/**
 * Converts a string to title case
 * @param {string} str the string to convert
 * @returns {string} the converted string
 */
function toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

/**
 * Converts a number to roman numerals
 * @param {number} num the number to convert
 * @returns {string} the converted number
 * @see https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
 */
function romanize(num) {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '';
    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

/**
 * Creates the infobox for the item
 * @param {object} itemData the item data
 */
function createInfobox(itemData) {
    let infobox = '{{Infobox ';
    if (itemData.category) {
        const categories = { SWORD: 'weapon', WAND: 'weapon', BOW: 'weapon', LONGSWORD: 'weapon', DEPLOYABLE: 'item', COSMETIC: 'item', TRAVEL_SCROLL: 'item', ACCESSORY: 'accessory', HELMET: 'armor', CHESTPLATE: 'armor', LEGGINGS: 'armor', BOOTS: 'boots', PET_ITEM: 'item', ARROW_POISON: 'item', GAUNTLET: 'item', BELT: 'item', BRACELET: 'item', CLOAK: 'item', GLOVES: 'item', NECKLACE: 'item', DUNGEON_PASS: 'item', REFORGE_STONE: 'reforge stone', BAIT: 'item', AXE: 'item', HOE: 'item', SPADE: 'item', SHEARS: 'item', PICKAXE: 'item', FISHING_ROD: 'fishing rod' };
        infobox += categories[itemData.category];
    } else {
        infobox += 'item';
    }
    infobox += '<br>';
    if (includeExtra) {
        infobox += '|title = ' + itemData.name + '<br>';
        infobox += '|image = ' + itemData.name + '.png<br>';
        infobox += '|slot_item = ' + itemData.name + '<br>';
    }
    if (itemData.tier) {
        infobox += '|rarity = ' + itemData.tier.toLowerCase() + '<br>';
    }
    infobox += '|id = ' + itemData.id + '<br>';
    const percentages = { attack_speed: true, critical_chance: true, critical_damage: true, sea_creature_chance: true }; // eslint-disable-line camelcase
    if (itemData.stats) {
        const statKeys = Object.keys(itemData.stats);
        for (let i = 0; i < statKeys.length; i++) {
            if (statKeys[i] === 'WEAPON_ABILITY_DAMAGE') {
                continue;
            } else if (statKeys[i] === 'WALK_SPEED') {
                infobox += '|speed = ' + itemData.stats[statKeys[i]] + '<br>';
            } else {
                let percent = '';
                if (percentages[statKeys[i].toLowerCase()]) {
                    percent = '%';
                }
                infobox += '|' + statKeys[i].toLowerCase() + ' = ' + itemData.stats[statKeys[i]] + percent + '<br>';
            }
        }
    }
    if (itemData.tiered_stats) {
        const statKeys = Object.keys(itemData.tiered_stats);
        for (let i = 0; i < statKeys.length; i++) {
            const a = itemData.tiered_stats[statKeys[i]][0];
            const b = itemData.tiered_stats[statKeys[i]][itemData.tiered_stats[statKeys[i]].length - 1];
            let stat;
            if (a === b) {
                stat = a.toString();
            } else if (a < b) {
                stat = a.toString() + '-' + b.toString();
            } else {
                stat = b.toString() + '-' + a.toString();
            }
            if (statKeys[i] === 'WEAPON_ABILITY_DAMAGE') {
                continue;
            } else if (statKeys[i] === 'WALK_SPEED') {
                infobox += '|speed = ' + stat + '<br>';
            } else {
                let percent = '';
                if (percentages[statKeys[i].toLowerCase()]) {
                    percent = '%';
                }
                infobox += '|' + statKeys[i].toLowerCase() + ' = ' + stat + percent + '<br>';
            }
        }
    }
    if (itemData.gemstone_slots) {
        infobox += '|gemstone_slots = <br>';
        for (let a = 0; a < itemData.gemstone_slots.length; a++) {
            infobox += '1* ' + toTitleCase(itemData.gemstone_slots[a].slot_type);
            if (itemData.gemstone_slots[a].costs) {
                infobox += ' &';
                const len = itemData.gemstone_slots[a].costs.length;
                for (let b = 0; b < len; b++) {
                    const cost = itemData.gemstone_slots[a].costs[b];
                    if ('coins' in cost) {
                        infobox += cost.coins.toString();
                    } else {
                        infobox += cost.amount.toString() + ' ' + toTitleCase(cost.item_id.toLowerCase().replace('_gem', '').replace('_', ' '));
                    }
                    if (b !== len - 1) {
                        infobox += ', ';
                    }
                }
                infobox += '&';
            }
            infobox += '<br>';
        }
    }
    if (itemData.requirements || itemData.catacombs_requirements) {
        let requirements;
        if (itemData.requirements) {
            requirements = Object.assign(itemData.requirements, itemData.catacombs_requirements);
        } else {
            requirements = itemData.catacombs_requirements;
        }
        if ('skill' in requirements) {
            const skillLvl = requirements.skill;
            if (skillLvl.type.toLowerCase() === 'combat') {
                infobox += '|combat_level_requirement = {{Skl|combat|' + skillLvl.level + '}}<br>';
            } else {
                infobox += '|other_level_requirement = {{Skl|' + skillLvl.type.toLowerCase() + '|' + skillLvl.level + '}}<br>';
            }
        }
        if ('slayer' in requirements) {
            const slayerLvl = requirements.slayer;
            infobox += '|slayer_level_requirement = ' + toTitleCase(slayerLvl.slayer_boss_type) + ' Slayer ' + slayerLvl.level.toString() + '<br>';
        }
        if ('dungeon' in requirements) {
            const dungeonLvl = requirements.dungeon;
            infobox += '|dungeon_level_requirement = {{Skl|' + dungeonLvl.type.toLowerCase() + '|' + dungeonLvl.level + '}}';
            if (itemData.dungeon_item_conversion_cost) {
                infobox += ' (when dungeonized)';
            }
            infobox += '<br>';
        }
        if ('dungeon_completion' in requirements) {
            const dungeonComp = requirements.dungeon_completion;
            infobox += '|dungeon_floor_clearing_requirement = ' + toTitleCase(dungeonComp.type.replace('_', ' ')) + ' Floor ' + romanize(dungeonComp.tier);
            if (itemData.dungeon_item_conversion_cost) {
                infobox += ' (when dungeonized)';
            }
            infobox += '<br>';
        }
    }
    if (itemData.category !== 'REFORGE_STONE' && itemData.category !== 'ACCESSORY') {
        infobox += '|enchant = u<br>|reforge = u<br>';
    }
    if (bazaarData[itemData.id]) {
        infobox += '|auctionable = No<br>';
    } else if (itemData.soulbound) {
        infobox += '|auctionable = No<br>';
    } else {
        infobox += '|auctionable = u<br>';
    }
    if (itemData.soulbound) {
        if (itemData.soulbound.toLowerCase() === 'coop') {
            infobox += '|tradeable = {{No|text=y}}<br>(Except to Co-op members)<br>|soulbound = Co-op<br>';
        } else {
            infobox += '|tradeable = No<br>|soulbound = Player<br>';
        }
    } else {
        infobox += '|tradeable = u<br>';
    }
    if ('museum' in itemData) {
        if (itemData.museum === true) {
            infobox += '|museum = Yes<br>';
        } else {
            infobox += '|museum = No<br>';
        }
    } else {
        infobox += '|museum = u<br>';
    }
    if (itemData.npc_sell_price) {
        infobox += '|salable = Yes<br>';
        infobox += '|sell = ' + itemData.npc_sell_price.toString() + '<br>';
    } else {
        infobox += '|salable = No<br>';
    }
    if (bazaarData[itemData.id]) {
        infobox += '|bazaar = ' + itemData.id + '<br>';
    }
    if ('color' in itemData) {
        const color = itemData.color.split(',');
        let hex = '';
        for (let i = 0; i < 3; i++) {
            hex += Number(color[i]).toString(16);
        }
        infobox += '|color = ' + hex + '<br>';
    }
    infobox += '}}';
    copyInfoboxButton.disabled = false;
    infoboxElement.parentElement.classList.remove('unselectable');
    infoboxElement.innerHTML = infobox;
    if (itemData.upgrade_costs) {
        createEssenceTable(itemData);
    } else {
        essenceTableElement.innerHTML = '&ZeroWidthSpace;';
    }
}

/**
 * Creates the essence table for the item
 * @param {object} itemData the item data
 */
function createEssenceTable(itemData) {
    let essenceTable = '{{Essence Crafting<br>|type = weapon<br>';
    for (let i = 0; i < itemData.upgrade_costs[0].length; i++) {
        if ('essence_type' in itemData.upgrade_costs[0][i]) {
            essenceTable += '|essence = ' + toTitleCase(itemData.upgrade_costs[0][i].essence_type) + '<br>';
            break;
        } else if (i === itemData.upgrade_costs[0].length - 1) {
            essenceTable += '|essence = none<br>';
        }
    }
    if ('dungeon_item_conversion_cost' in itemData) {
        essenceTable += '|convert = ' + itemData.dungeon_item_conversion_cost.amount.toString() + ' Essence<br>';
    }
    for (let a = 0; a < itemData.upgrade_costs.length; a++) {
        itemData.upgrade_costs[a].reverse();
        essenceTable += '|';
        for (let b = 0; b < itemData.upgrade_costs[a].length; b++) {
            essenceTable += itemData.upgrade_costs[a][b].amount.toString() + ' ';
            if ('essence_type' in itemData.upgrade_costs[a][b]) {
                essenceTable += 'Essence';
            } else if ('item_id' in itemData.upgrade_costs[a][b]) {
                let itemName;
                for (let i = 0; i < itemsData.length; i++) {
                    if (itemsData[i].id === itemData.upgrade_costs[a][b].item_id) {
                        itemName = itemsData[i].name;
                        break;
                    }
                }
                essenceTable += itemName;
            }
            if (b === itemData.upgrade_costs[a].length - 1) {
                essenceTable += '<br>';
            } else {
                essenceTable += '; ';
            }
        }
    }
    if ('prestige' in itemData) {
        essenceTable += '|prestige = ';
        for (let a = 0; a < itemData.prestige.costs.length; a++) {
            essenceTable += itemData.prestige.costs[a].amount.toString() + ' ';
            if ('essence_type' in itemData.prestige.costs[a]) {
                essenceTable += 'Essence';
            } else if ('item_id' in itemData.prestige.costs[a]) {
                let itemName;
                for (let i = 0; i < itemsData.length; i++) {
                    if (itemsData[i].id === itemData.prestige.costs[a].item_id) {
                        itemName = itemsData[i].name;
                        break;
                    }
                }
                essenceTable += itemName;
            }
            if (a === itemData.prestige.costs.length - 1) {
                essenceTable += '<br>';
            } else {
                essenceTable += '; ';
            }
        }
    }
    essenceTable += '}}';
    copyEssenceTableButton.disabled = false;
    essenceTableElement.parentElement.classList.remove('unselectable');
    essenceTableElement.innerHTML = essenceTable;
}
