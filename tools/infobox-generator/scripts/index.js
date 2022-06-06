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

nameInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') nameSubmitButton.click();
});

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

idInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') idSubmitButton.click();
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
        new Toast({ message: 'The item list has not yet loaded. Please wait or try refreshing the page!', type: 'disallow', time: 2000 }).show();
    } else {
        const input = inputValue.toLowerCase();
        for (const item of itemsData) {
            if (input === item[inputType].toLowerCase()) return createInfobox(item);
        }
        // To do: add support for armor sets
        if (input.substring(input.length-5) === 'armor') {
            if (inputType === 'id' && input.substring(input.length-6) === '_armor') {
                const armor = input.substring(0, input.length-6);
                console.log(armor);
                for (const item of itemsData) {
                    if (item.id.toLowerCase().match(`^${armor}_(?:helmet|chestplate|leggings|boots)$`)) console.log(item.id.toLowerCase());
                }
            } else if (inputType === 'name' && input.substring(input.length-6) === ' armor') {
                const armor = input.substring(0, input.length-6);
                console.log(armor);
                for (const item of itemsData) {
                    if (item.name.toLowerCase().match(`^${armor} (?:helmet|chestplate|leggings|boots)$`)) console.log(item.name.toLowerCase());
                }
            }
        }
        new Toast({ message: 'The item you entered does not exist!', type: 'disallow', time: 2000 }).show();
    }
}

/**
 * Copies an element's innerHTML to the clipboard
 * @param {string} id the id of the element to copy
 */
function copyText(id) {
    try {
        window.navigator.clipboard.writeText(document.getElementById(id).innerHTML.replaceAll('<br>', '\n'));
        new Toast({ message: 'Copied!', type: 'success', time: 2000 }).show();
    } catch (error) {
        new Toast({ message: 'Unable to copy!', type: 'disallow', time: 4000 }).show();
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

const categories = { SWORD: 'weapon', WAND: 'weapon', BOW: 'weapon', LONGSWORD: 'weapon', DEPLOYABLE: 'item', COSMETIC: 'item', TRAVEL_SCROLL: 'item', ACCESSORY: 'accessory', HELMET: 'armor', CHESTPLATE: 'armor', LEGGINGS: 'armor', BOOTS: 'boots', PET_ITEM: 'item', ARROW_POISON: 'item', GAUNTLET: 'item', BELT: 'item', BRACELET: 'item', CLOAK: 'item', GLOVES: 'item', NECKLACE: 'item', DUNGEON_PASS: 'item', REFORGE_STONE: 'reforge stone', BAIT: 'item', AXE: 'item', HOE: 'item', SPADE: 'item', SHEARS: 'item', PICKAXE: 'item', FISHING_ROD: 'fishing rod' };

/**
 * Creates the infobox for the item
 * @param {object} itemData the item data
 */
function createInfobox(itemData) {
    let infobox = '{{Infobox ';

    if (itemData.category) infobox += categories[itemData.category] || 'item';
    else infobox += 'item';

    infobox += '<br>';

    if (includeExtra) {
        infobox += [
            `|title = ${itemData.name}`, //
            `|image = ${itemData.name}.png`,
            `|slot_item = ${itemData.name}`,
        ].join('<br>');
    }

    if (itemData.tier) infobox += `|rarity = ${itemData.tier.toLowerCase()}<br>`;

    infobox += '|id = ' + itemData.id + '<br>';
    const percentages = { attack_speed: true, critical_chance: true, critical_damage: true, sea_creature_chance: true }; // eslint-disable-line camelcase
    // To do: Add support for "fragged" items (called "STARRED_itemname" by the api).
    if (itemData.stats) {
        const statKeys = Object.keys(itemData.stats);
        for (const key of statKeys) {
            if (key === 'WEAPON_ABILITY_DAMAGE') continue;
            else if (key === 'WALK_SPEED') infobox += `|speed = ${itemData.stats[key]}<br>`;
            else infobox += `|${key.toLowerCase()} = ${itemData.stats[key]}${percentages[key.toLowerCase()] ? '%' : ''}<br>`;
        }
    }

    if (itemData.tiered_stats) {
        const statKeys = Object.keys(itemData.tiered_stats);
        for (const key of statKeys) {
            const min = itemData.tiered_stats[key][0];
            const max = itemData.tiered_stats[key][itemData.tiered_stats[key].length - 1];

            let stat;
            if (min === max) stat = min.toString();
            else if (min < max) stat = min.toString() + '-' + max.toString();
            else stat = max.toString() + '-' + min.toString();

            if (key === 'WEAPON_ABILITY_DAMAGE') continue;
            else if (key === 'WALK_SPEED') infobox += '|speed = ' + stat + '<br>';
            else infobox += `|${key.toLowerCase()} = ${stat}${percentages[key.toLowerCase()] ? '%' : ''}<br>`;
        }
    }

    if (itemData.gemstone_slots) {
        infobox += '|gemstone_slots = <br>';

        for (const gemstone of itemData.gemstone_slots) {
            infobox += '*1 ' + toTitleCase(gemstone.slot_type);
            if (gemstone.costs) {
                infobox += ' &';

                infobox += gemstone.costs
                    .map((cost) => {
                        if ('coins' in cost) return cost.coins.toString();
                        else return cost.amount.toString() + ' ' + toTitleCase(cost.item_id.toLowerCase().replace('_gem', '').replace('_', ' '));
                    })
                    .join(', ');

                infobox += '&';
            }
            infobox += '<br>';
        }
    }
    if (itemData.requirements || itemData.catacombs_requirements) {
        const requirements = { ...itemData.requirements, ...itemData.catacombs_requirements };

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

    if (itemData.category !== 'REFORGE_STONE' && itemData.category !== 'ACCESSORY') infobox += '|enchant = unknown<br>|reforge = unknown<br>';

    if (bazaarData[itemData.id]) infobox += '|auctionable = no<br>';
    else if (itemData.soulbound) infobox += '|auctionable = no<br>';
    else infobox += '|auctionable = unknown<br>';

    if (itemData.soulbound) {
        if (itemData.soulbound.toLowerCase() === 'coop') {
            infobox += '|tradeable = {{No|text=y}}<br>(Except to Co-op members)<br>|soulbound = Co-op<br>';
        } else {
            infobox += '|tradeable = no<br>|soulbound = Player<br>';
        }
    } else {
        infobox += '|tradeable = unknown<br>';
    }

    if ('museum' in itemData) {
        if (itemData.museum) infobox += '|museum = yes<br>';
        else infobox += '|museum = no<br>';
    } else {
        infobox += '|museum = unknown<br>';
    }

    if (itemData.npc_sell_price) {
        infobox += '|salable = yes<br>';
        infobox += `|sell = ${itemData.npc_sell_price}<br>`;
    } else {
        infobox += '|salable = no<br>';
    }

    if (bazaarData[itemData.id]) infobox += `|bazaar = ${itemData.id}<br>`;

    if ('color' in itemData) {
        const hex = itemData.color
            .split(',')
            .map((color) => Number(color).toString(16))
            .join('');

        infobox += `|color = ${hex}<br>`;
    }

    infobox += '}}';

    copyInfoboxButton.disabled = false;
    infoboxElement.parentElement.classList.remove('unselectable');
    infoboxElement.innerHTML = infobox;
    if (itemData.upgrade_costs) createEssenceTable(itemData);
    else essenceTableElement.innerHTML = '&ZeroWidthSpace;';
}

/**
 * Creates the essence table for the item
 * @param {object} itemData the item data
 */
function createEssenceTable(itemData) {
    let essenceTable = '{{Essence Crafting<br>|type = weapon<br>';

    for (const cost of itemData.upgrade_costs[0]) {
        if ('essence_type' in cost) {
            essenceTable += `|essence = ${toTitleCase(cost.essence_type)}<br>`;
            break;
        } else if (cost === itemData.upgrade_costs[itemData.upgrade_costs.length - 1]) essenceTable += '|essence = none<br>';
    }

    if ('dungeon_item_conversion_cost' in itemData) essenceTable += `|convert = ${itemData.dungeon_item_conversion_cost.amount} Essence<br>`;

    for (const costs of itemData.upgrade_costs) {
        let costs_copy = costs.map((x) => x);
        essenceTable += '|';

        for (const tierCost of costs_copy) {
            essenceTable += tierCost.amount.toString() + ' ';
            if ('essence_type' in tierCost) essenceTable += 'Essence';
            else if ('item_id' in tierCost) {
                let itemName;
                for (const item of itemsData) {
                    if (tierCost.item_id === item.id) {
                        itemName = item.name;
                        break;
                    }
                }
                essenceTable += itemName;
            }

            if (tierCost === costs_copy[costs_copy.length - 1]) essenceTable += '<br>';
            else essenceTable += '; ';
        }
    }

    if ('prestige' in itemData) {
        essenceTable += '|prestige = ';

        for (const cost of itemData.prestige.costs) {
            essenceTable += cost.amount + ' ';

            if ('essence_type' in cost) essenceTable += 'Essence';
            else if ('item_id' in cost) {
                let itemName;
                for (const item of itemsData) {
                    if (cost.item_id === item.id) {
                        itemName = item.name;
                        break;
                    }
                }
                essenceTable += itemName;
            }

            if (cost === itemData.prestige.costs[itemData.prestige.costs.length - 1]) essenceTable += '<br>';
            else essenceTable += '; ';
        }
    }

    essenceTable += '}}';

    copyEssenceTableButton.disabled = false;
    essenceTableElement.parentElement.classList.remove('unselectable');
    essenceTableElement.innerHTML = essenceTable;
}

function createArmorInfobox(helmet, chestplate, leggings, boots) {
    console.log(helmet);
}
