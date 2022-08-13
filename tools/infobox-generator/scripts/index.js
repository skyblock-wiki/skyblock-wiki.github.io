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

const helmet_matches = new RegExp('(helmet|hat|cap|fedora|hood)');
const chestplate_matches = /(chestplate|tunic|shirt|polo|jacket|robes)/;
const leggings_matches = /(leggings|pants|trousers)/;
const boots_matches = /(boots|shoes|sandals|slippers|galoshes|oxfords|shoes)/;
const all_matches = /(helmet|hat|cap|fedora|hood|chestplate|tunic|shirt|polo|jacket|robes|leggings|pants|trousers|boots|shoes|sandals|slippers|galoshes|oxfords|shoes)/;

nameInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') nameSubmitButton.click();
});

nameSubmitButton.addEventListener('click', () => {
    triggerCreation('name', nameInput.value);
});

nameClearButton.addEventListener('click', () => {
    nameInput.value = '';
    infoboxElement.value = '';
    infoboxElement.style.height = 'unset';
    copyInfoboxButton.disabled = true;
    essenceTableElement.value = '';
    essenceTableElement.style.height = 'unset';
    copyEssenceTableButton.disabled = true;
    new Toast({ message: 'Cleared!', type: 'success', time: 1000 }).show();
});

idInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') idSubmitButton.click();
});

idSubmitButton.addEventListener('click', () => {
    triggerCreation('id', idInput.value);
});

idClearButton.addEventListener('click', () => {
    idInput.value = '';
    infoboxElement.value = '';
    infoboxElement.style.height = 'unset';
    copyInfoboxButton.disabled = true;
    essenceTableElement.value = '';
    essenceTableElement.style.height = 'unset';
    copyEssenceTableButton.disabled = true;
    new Toast({ message: 'Cleared!', type: 'success', time: 1000 }).show();
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
        if (input.substring(input.length - 5) === 'armor') {
            if (inputType === 'id' && input.substring(input.length - 6) === '_armor') {
                const armor = input.substring(0, input.length - 6);
                const armorSet = {};
                let exists = false;
                for (const item of itemsData) {
                    if (item.id.toLowerCase().match(`^${armor}_(helmet|chestplate|leggings|boots)$`)) {
                        exists = true;
                        if (item.id.toLowerCase().match(`^${armor}_helmet$`)) armorSet.helmet = item;
                        else if (item.id.toLowerCase().match(`^${armor}_chestplate$`)) armorSet.chest = item;
                        else if (item.id.toLowerCase().match(`^${armor}_leggings$`)) armorSet.legs = item;
                        else armorSet.boots = item;
                    }
                }
                const sortedArmor = {};
                if (armorSet.helmet) sortedArmor.helmet = armorSet.helmet;
                if (armorSet.chest) sortedArmor.chest = armorSet.chest;
                if (armorSet.legs) sortedArmor.legs = armorSet.legs;
                if (armorSet.boots) sortedArmor.boots = armorSet.boots;
                if (exists) return createArmorInfobox(sortedArmor);
            } else if (inputType === 'name' && input.substring(input.length - 6) === ' armor') {
                const armor = input.substring(0, input.length - 6);
                const armorSet = {};
                let exists = false;
                //To do: Add a list of all known matches, such as robes, oxfords, and more.
                for (const item of itemsData) {
                    if (item.name.toLowerCase().match(`^${armor} (helmet|hat|cap|fedora|hood|chestplate|tunic|shirt|polo|jacket|robes|leggings|pants|trousers|boots|shoes|sandals|slippers|galoshes|oxfords|shoes)$`)) {
                        console.log(item.name);
                        exists = true;
                        if (item.name.toLowerCase().match(new RegExp(`^${armor} ${helmet_matches}$`))) armorSet.helmet = item;
                        else if (item.name.toLowerCase().match(`^${armor} ${chestplate_matches}$`)) armorSet.chest = item;
                        else if (item.name.toLowerCase().match(`^${armor} ${leggings_matches}$`)) armorSet.legs = item;
                        else armorSet.boots = item;
                        console.log(armorSet);
                    }
                }
                const sortedArmor = {};
                if (armorSet.helmet) sortedArmor.helmet = armorSet.helmet;
                if (armorSet.chest) sortedArmor.chest = armorSet.chest;
                if (armorSet.legs) sortedArmor.legs = armorSet.legs;
                if (armorSet.boots) sortedArmor.boots = armorSet.boots;
                if (exists) return createArmorInfobox(sortedArmor);
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
        window.navigator.clipboard.writeText(document.getElementById(id).value);
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

/**
 * Checks if either given object contains `essence_type`
 * @param {object} a the first object
 * @param {object} b the second object
 * @returns {-1|1|0} -1 if `essence_type` in `a`, 1 if `essence_type` in `b`, 0 if neither
 */
function compare(a, b) {
    if ('essence_type' in a) return -1;
    else if ('essence_type' in b) return 1;
    else return 0;
}

/**
 * Checks if all items in the given array are equal
 * @param {Array} array the array to check
 * @returns {boolean} true if all items are equal, false if not
 */
function allAreEqual(array) {
    return array.every((element) => element === array[0]);
}

const categories = { SWORD: 'weapon', WAND: 'weapon', BOW: 'weapon', LONGSWORD: 'weapon', DEPLOYABLE: 'item', COSMETIC: 'item', TRAVEL_SCROLL: 'item', ACCESSORY: 'accessory', HELMET: 'armor', CHESTPLATE: 'armor', LEGGINGS: 'armor', BOOTS: 'boots', PET_ITEM: 'item', ARROW_POISON: 'item', GAUNTLET: 'item', BELT: 'item', BRACELET: 'item', CLOAK: 'item', GLOVES: 'item', NECKLACE: 'item', DUNGEON_PASS: 'item', REFORGE_STONE: 'reforge stone', BAIT: 'item', AXE: 'item', HOE: 'item', SPADE: 'item', SHEARS: 'item', PICKAXE: 'item', FISHING_ROD: 'fishing rod' };
const replace = { CRITICAL_CHANCE: 'crit_chance', CRITICAL_DAMAGE: 'crit_damage', WALK_SPEED: 'speed' };

/**
 * Creates the infobox for the item
 * @param {object} itemData the item data
 */
function createInfobox(itemData) {
    let infobox = '{{Infobox ';

    if (itemData.category) infobox += categories[itemData.category] || 'item';
    else infobox += 'item';

    infobox += '\n';

    if (includeExtra) {
        infobox += [`|title = ${itemData.name}`, `|image = ${itemData.name}.png`, `|slot_item = ${itemData.name}\n`].join('\n');
    }

    let starredItem = false;
    if (itemData.id.match('STARRED_')) {
        for (const item of itemsData) {
            if (item.id.match(`^${itemData.id.replace('STARRED_', '')}$`)) {
                starredItem = itemData;
                itemData = item;
                break;
            }
        }
    } else {
        for (const item of itemsData) {
            if (item.id.match(`^STARRED_${itemData.id}$`)) {
                starredItem = item;
                break;
            }
        }
    }

    if (itemData.tier) {
        if (!starredItem) infobox += `|rarity = ${itemData.tier.toLowerCase().replace('_', ' ')}\n`;
        else if (starredItem.tier !== itemData.tier) infobox += `|rarity = {{r|${itemData.tier.toLowerCase()}}} ({{r|${starredItem.tier.toLowerCase()}}} with frags)\n`;
        else infobox += `|rarity = ${itemData.tier.toLowerCase()}\n`;
    } else {
        itemData.tier = 'COMMON';
        infobox += `|rarity = ${itemData.tier.toLowerCase()}\n`;
    }

    infobox += `|id = ${itemData.id}`;
    if (starredItem) infobox += `<br>${starredItem.id}`;
    infobox += '\n';
    const percentages = { attack_speed: true, critical_chance: true, critical_damage: true, sea_creature_chance: true }; // eslint-disable-line camelcase

    if (itemData.stats) {
        const statKeys = Object.keys(itemData.stats);
        for (const key of statKeys) {
            if (key === 'WEAPON_ABILITY_DAMAGE') continue;
            else infobox += `|${replace[key] || key.toLowerCase()} = ${itemData.stats[key]}${percentages[key.toLowerCase()] ? '%' : ''}`;
            if (starredItem) {
                if (starredItem.stats[key] && starredItem.stats[key] !== itemData.stats[key]) {
                    infobox += ` (${starredItem.stats[key]} with frags)`;
                }
            }
            infobox += '\n';
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
            else infobox += `|${replace[key] || key.toLowerCase()} = ${stat}${percentages[key.toLowerCase()] ? '%' : ''}\n`;
        }
    }

    if (itemData.gemstone_slots) {
        infobox += '|gemstone_slots = \n';

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
            infobox += '\n';
        }

        if (starredItem && starredItem.gemstone_slots !== itemData.gemstone_slots) {
            infobox += '|gemstone_slots_fragged = \n';

            for (const gemstone of starredItem.gemstone_slots) {
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
                infobox += '\n';
            }
        }
    }

    if (itemData.requirements || itemData.catacombs_requirements) {
        const requirements = { ...itemData.requirements, ...itemData.catacombs_requirements };

        if ('skill' in requirements) {
            const skillLvl = requirements.skill;
            if (skillLvl.type.toLowerCase() === 'combat') {
                infobox += '|combat_level_requirement = {{Skl|combat|' + skillLvl.level + '}}\n';
            } else {
                infobox += '|other_level_requirement = {{Skl|' + skillLvl.type.toLowerCase() + '|' + skillLvl.level + '}}\n';
            }
        }

        if ('slayer' in requirements) {
            const slayerLvl = requirements.slayer;
            infobox += '|slayer_level_requirement = ' + toTitleCase(slayerLvl.slayer_boss_type) + ' Slayer ' + slayerLvl.level.toString() + '\n';
        }

        if ('dungeon' in requirements) {
            const dungeonLvl = requirements.dungeon;
            infobox += '|dungeon_level_requirement = {{Skl|' + dungeonLvl.type.toLowerCase() + '|' + dungeonLvl.level + '}}';
            if (itemData.dungeon_item_conversion_cost) {
                infobox += ' (when dungeonized)';
            }
            infobox += '\n';
        }

        if ('dungeon_completion' in requirements) {
            const dungeonComp = requirements.dungeon_completion;
            infobox += '|dungeon_floor_clearing_requirement = ' + toTitleCase(dungeonComp.type.replace('_', ' ')) + ' Floor ' + romanize(dungeonComp.tier);
            if (itemData.dungeon_item_conversion_cost) {
                infobox += ' (when dungeonized)';
            }
            infobox += '\n';
        }
    }

    if (itemData.category !== 'REFORGE_STONE' && itemData.category !== 'ACCESSORY') infobox += '|enchant = unknown\n|reforge = unknown\n';

    if (bazaarData[itemData.id]) infobox += '|auctionable = no\n';
    else if (itemData.soulbound) infobox += '|auctionable = no\n';
    else infobox += '|auctionable = unknown\n';

    if (itemData.soulbound) {
        if (itemData.soulbound.toLowerCase() === 'coop') {
            infobox += '|tradeable = {{No|text=y}}\n(Except to Co-op members)\n|soulbound = Co-op\n';
        } else {
            infobox += '|tradeable = no\n|soulbound = Player\n';
        }
    } else {
        infobox += '|tradeable = unknown\n';
    }

    if ('museum' in itemData) {
        if (itemData.museum) infobox += '|museum = yes\n';
        else infobox += '|museum = no\n';
    } else {
        infobox += '|museum = unknown\n';
    }

    if (itemData.npc_sell_price) {
        infobox += '|salable = yes\n';
        infobox += `|sell = ${itemData.npc_sell_price}\n`;
    } else {
        infobox += '|salable = no\n';
    }

    if (bazaarData[itemData.id]) infobox += `|bazaar = ${itemData.id}\n`;

    if ('color' in itemData) {
        const hex = itemData.color
            .split(',')
            .map((color) => (Number(color).toString(16).length === 1 ? '0' : '') + Number(color).toString(16))
            .join('');

        infobox += `|color = ${hex}\n`;
    }

    infobox += '}}';

    copyInfoboxButton.disabled = false;
    infoboxElement.parentElement.classList.remove('unselectable');
    infoboxElement.value = infobox;
    infoboxElement.style.height = infoboxElement.scrollHeight + 3 + 'px';

    if (itemData.upgrade_costs) createEssenceTable(itemData);
    else essenceTableElement.value = '';
}

/**
 * Creates the essence table for the item
 * @param {object} itemData the item data
 */
function createEssenceTable(itemData) {
    let essenceTable = '{{Essence Crafting\n|type = weapon\n';

    for (const cost of itemData.upgrade_costs[0]) {
        if ('essence_type' in cost) {
            essenceTable += `|essence = ${toTitleCase(cost.essence_type)}\n`;
            break;
        } else if (cost === itemData.upgrade_costs[itemData.upgrade_costs.length - 1]) essenceTable += '|essence = none\n';
    }

    if ('dungeon_item_conversion_cost' in itemData) essenceTable += `|convert = ${itemData.dungeon_item_conversion_cost.amount} Essence\n`;

    for (const costs of itemData.upgrade_costs) {
        const costsCopy = costs;
        costsCopy.sort(compare);
        essenceTable += '|';

        for (const tierCost of costsCopy) {
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

            if (tierCost === costsCopy[costsCopy.length - 1]) essenceTable += '\n';
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

            if (cost === itemData.prestige.costs[itemData.prestige.costs.length - 1]) essenceTable += '\n';
            else essenceTable += '; ';
        }
    }

    essenceTable += '}}';

    copyEssenceTableButton.disabled = false;
    essenceTableElement.parentElement.classList.remove('unselectable');
    essenceTableElement.value = essenceTable;
    essenceTableElement.style.height = essenceTableElement.scrollHeight + 3 + 'px';
}

/**
 * Creates the infobox for the item
 * @param {object} armorData the armor data
 */
function createArmorInfobox(armorData) {
    let infobox = '{{Infobox armor\n';

    for (const piece in armorData) {
        if (armorData[piece].id.match('STARRED_')) {
            for (const item of itemsData) {
                if (item.id.match(`^${armorData[piece].id.replace('STARRED_', '')}$`)) {
                    const starred = armorData[piece];
                    armorData[piece] = item;
                    armorData[piece].starredItem = starred;
                    break;
                }
            }
        } else {
            for (const item of itemsData) {
                if (item.id.match(`^STARRED_${armorData[piece].id}$`)) {
                    armorData[piece].starredItem = item;
                    break;
                }
            }
        }
    }

    const itemData = armorData[Object.keys(armorData)[0]];
    //To do: Add a list of all known matches, such as robes, oxfords, and more.
    const setName = armorData[Object.keys(armorData)[0]].name.replace(/ (?:Helmet|Hat|Cap|Chestplate|Tunic|Shirt|Leggings|Pants|Boots|Shoes|Sandals)$/, ' Armor');
    if (includeExtra) {
        infobox += [`|title = ${setName}`, `|image = ${setName}.png\n`].join('\n');
        for (const piece in armorData) {
            infobox += `|slot_${piece} = ${armorData[piece].name}\n`;
        }
    }

    for (const piece in armorData) {
        infobox += `|${piece}_id = ${armorData[piece].id}`;
        if (armorData[piece].starredItem) infobox += `<br>${armorData[piece].starredItem.id}`;
        infobox += '\n';
    }

    const rarities = [];
    for (const piece in armorData) {
        if (!armorData[piece].tier) armorData[piece].tier = 'COMMON';
        rarities.push(armorData[piece].tier);
    }
    if (allAreEqual(rarities)) {
        if (!itemData.starredItem) infobox += `|rarity = ${itemData.tier.toLowerCase()}\n`;
        else if (itemData.starredItem.tier !== itemData.tier) infobox += `|rarity = {{r|${itemData.tier.toLowerCase()}}} ({{r|${itemData.starredItem.tier.toLowerCase()}}} with frags)\n`;
        else infobox += `|rarity = ${itemData.tier.toLowerCase()}\n`;
    } else infobox += '|rarity = Various\n';

    const percentages = { attack_speed: true, critical_chance: true, critical_damage: true, sea_creature_chance: true }; // eslint-disable-line camelcase
    const totalStats = {};
    for (const piece in armorData) {
        const pieceData = armorData[piece];

        if (pieceData.stats) {
            const statKeys = Object.keys(pieceData.stats);
            for (const key of statKeys) {
                if (key === 'WEAPON_ABILITY_DAMAGE') continue;
                else infobox += `|${piece}_${replace[key] || key.toLowerCase()} = ${pieceData.stats[key]}${percentages[key.toLowerCase()] ? '%' : ''}`;

                if (!totalStats[key]) totalStats[key] = { min: 0, max: 0 };
                totalStats[key].min += pieceData.stats[key];
                totalStats[key].max += pieceData.stats[key];
                if (pieceData.starredItem) {
                    if (!totalStats[key].starred) totalStats[key].starred = 0;
                    totalStats[key].starred += pieceData.starredItem.stats[key];
                    if (pieceData.starredItem.stats[key] !== pieceData.stats[key]) infobox += ` (${pieceData.starredItem.stats[key]} with frags)`;
                }

                infobox += '\n';
            }
        }

        if (pieceData.tiered_stats) {
            const statKeys = Object.keys(pieceData.tiered_stats);
            for (const key of statKeys) {
                const min = pieceData.tiered_stats[key][0];
                const max = pieceData.tiered_stats[key][pieceData.tiered_stats[key].length - 1];

                let stat;
                if (min === max) stat = min.toString();
                else if (min < max) stat = min.toString() + '-' + max.toString();
                else stat = max.toString() + '-' + min.toString();

                if (key === 'WEAPON_ABILITY_DAMAGE') continue;
                else infobox += `|${piece}_${replace[key] || key.toLowerCase()} = ${stat}${percentages[key.toLowerCase()] ? '%' : ''}\n`;

                if (!totalStats[key]) totalStats[key] = { min: 0, max: 0 };
                totalStats[key].min += min;
                totalStats[key].max += max;
            }
        }
    }

    for (const key in totalStats) {
        const { min, max } = totalStats[key];

        let stat;
        if (min === max) stat = min.toString();
        else if (min < max) stat = min.toString() + '-' + max.toString();
        else stat = max.toString() + '-' + min.toString();

        if (key === 'WEAPON_ABILITY_DAMAGE') continue;
        else infobox += `|${replace[key] || key.toLowerCase()} = ${stat}${percentages[key.toLowerCase()] ? '%' : ''}`;

        if (totalStats[key].starred && totalStats[key].starred !== min) if (totalStats[key].starred !== min) infobox += ` (${totalStats[key].starred} with frags)`;
        infobox += '\n';
    }

    let gemsSame = true;
    let starredGemsSame = true;
    const gemsArray = [];
    const starredGemsArray = [];
    for (const piece in armorData) {
        if (armorData[piece].gemstone_slots) gemsArray.push(armorData[piece].gemstone_slots);
        else gemsSame = false;
        if (armorData[piece].starredItem && armorData[piece].starredItem.gemstone_slots) starredGemsArray.push(armorData[piece].starredItem.gemstone_slots);
        else starredGemsSame = false;
    }

    if (gemsArray[0] && gemsSame) {
        for (let i; i < gemsArray.length; i++) {
            if (gemsArray[i] !== gemsArray[0]) {
                gemsSame = false;
                break;
            }
        }

        if (starredGemsArray[0] && starredGemsSame) {
            for (let i; i < starredGemsArray.length; i++) {
                if (starredGemsArray[i] !== starredGemsArray[0]) {
                    starredGemsSame = false;
                    break;
                }
            }
        }
    }

    if (gemsSame) {
        infobox += '|gemstone_slots = \n';

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
            infobox += '\n';
        }

        if (itemData.starredItem && itemData.starredItem.gemstone_slots !== itemData.gemstone_slots && starredGemsSame) {
            infobox += '|gemstone_slots_fragged = \n';

            for (const gemstone of itemData.starredItem.gemstone_slots) {
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
                infobox += '\n';
            }
        }
    }

    if (itemData.requirements || itemData.catacombs_requirements) {
        const requirements = { ...itemData.requirements, ...itemData.catacombs_requirements };

        if ('skill' in requirements) {
            const skillLvl = requirements.skill;
            if (skillLvl.type.toLowerCase() === 'combat') infobox += '|combat_level_requirement = {{Skl|combat|' + skillLvl.level + '}}\n';
            else infobox += '|other_level_requirement = {{Skl|' + skillLvl.type.toLowerCase() + '|' + skillLvl.level + '}}\n';
        }

        if ('slayer' in requirements) {
            const slayerLvl = requirements.slayer;
            infobox += '|slayer_level_requirement = ' + toTitleCase(slayerLvl.slayer_boss_type) + ' Slayer ' + slayerLvl.level.toString() + '\n';
        }

        if ('dungeon' in requirements) {
            const dungeonLvl = requirements.dungeon;
            infobox += '|dungeon_level_requirement = {{Skl|' + dungeonLvl.type.toLowerCase() + '|' + dungeonLvl.level + '}}';
            if (itemData.dungeon_item_conversion_cost) infobox += ' (when dungeonized)';

            infobox += '\n';
        }

        if ('dungeon_completion' in requirements) {
            const dungeonComp = requirements.dungeon_completion;
            infobox += '|dungeon_floor_clearing_requirement = ' + toTitleCase(dungeonComp.type.replace('_', ' ')) + ' Floor ' + romanize(dungeonComp.tier);
            if (itemData.dungeon_item_conversion_cost) infobox += ' (when dungeonized)';

            infobox += '\n';
        }
    }

    infobox += '|enchant = yes\n|reforge = yes\n';

    if (itemData.soulbound) infobox += '|auctionable = no\n';
    else infobox += '|auctionable = unknown\n';

    if (itemData.soulbound) {
        if (itemData.soulbound.toLowerCase() === 'coop') infobox += '|tradeable = {{No|text=y}}\n(Except to Co-op members)\n|soulbound = Co-op\n';
        else infobox += '|tradeable = no\n|soulbound = Player\n';
    } else infobox += '|tradeable = unknown\n';

    let sellPrice = 0;
    for (const piece in armorData) {
        if (armorData[piece].npc_sell_price) sellPrice += armorData[piece].npc_sell_price;
    }

    if (sellPrice !== 0) {
        infobox += '|salable = yes\n';
        infobox += `|sell = ${sellPrice}\n`;
    } else infobox += '|salable = no\n';

    const colors = [];
    for (const piece in armorData) {
        if ('color' in armorData[piece]) {
            const hex = armorData[piece].color
                .split(',')
                .map((color) => (Number(color).toString(16).length === 1 ? '0' : '') + Number(color).toString(16))
                .join('');

            colors.push(hex);
        } else colors.push(' ');
    }
    if (colors.length > 0 && !(colors[0] === ' ' && allAreEqual(colors))) {
        const colorsWithout = colors.filter((x) => x !== ' ');
        if (allAreEqual(colors)) infobox += `|color = ${colors[0]}\n|all_colors_the_same = true\n`;
        else if (allAreEqual(colorsWithout)) infobox += `|color = ${colorsWithout[0]}\n|all_colors_the_same = true\n`;
        else infobox += `|color = ${colors.join(',').replace(' ', '')}\n`;
    }

    infobox += '}}';

    copyInfoboxButton.disabled = false;
    infoboxElement.parentElement.classList.remove('unselectable');
    infoboxElement.value = infobox;
    infoboxElement.style.height = infoboxElement.scrollHeight + 3 + 'px';

    if (itemData.upgrade_costs) createArmorEssenceTable(armorData);
    else essenceTableElement.value = '';
}

/**
 * Creates the essence table for the armor
 * @param {object} armorData the armor data
 */
function createArmorEssenceTable(armorData) {
    let essenceTable = '{{Essence Crafting\n|type = armor\n';

    let allPiecesSameStats = true;
    const itemData = armorData[Object.keys(armorData)[0]];
    for (const piece in armorData) {
        if (armorData[piece].upgrade_costs) {
            if (JSON.stringify(itemData.upgrade_costs) !== JSON.stringify(armorData[piece].upgrade_costs)) {
                allPiecesSameStats = false;
                break;
            }
        }
        if (armorData[piece].dungeon_item_conversion_cost) {
            if (JSON.stringify(itemData.dungeon_item_conversion_cost) !== JSON.stringify(armorData[piece].dungeon_item_conversion_cost)) {
                allPiecesSameStats = false;
                break;
            }
        }
        if (armorData[piece].prestige) {
            if (JSON.stringify(itemData.prestige.costs) !== JSON.stringify(armorData[piece].prestige.costs)) {
                allPiecesSameStats = false;
                break;
            }
        }
    }

    if (allPiecesSameStats) {
        for (const cost of itemData.upgrade_costs[0]) {
            if ('essence_type' in cost) {
                essenceTable += `|essence = ${toTitleCase(cost.essence_type)}\n`;
                break;
            } else if (cost === itemData.upgrade_costs[itemData.upgrade_costs.length - 1]) essenceTable += '|essence = none\n';
        }

        if ('dungeon_item_conversion_cost' in itemData) essenceTable += `|convert = ${itemData.dungeon_item_conversion_cost.amount} Essence\n`;

        for (const costs of itemData.upgrade_costs) {
            const costsCopy = costs;
            costsCopy.sort(compare);
            essenceTable += '|';

            for (const tierCost of costsCopy) {
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

                if (tierCost === costsCopy[costsCopy.length - 1]) essenceTable += '\n';
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

                if (cost === itemData.prestige.costs[itemData.prestige.costs.length - 1]) essenceTable += '\n';
                else essenceTable += '; ';
            }
        }
    } else {
        for (const piece in armorData) {
            const itemData = armorData[piece];
            const prefix = piece[0];

            if ('dungeon_item_conversion_cost' in itemData) essenceTable += `|${prefix}_convert = ${itemData.dungeon_item_conversion_cost.amount} Essence\n`;

            let i = 0;
            for (const costs of itemData.upgrade_costs) {
                const costsCopy = costs;
                costsCopy.sort(compare);
                essenceTable += `|${prefix}${i}=`;

                for (const tierCost of costsCopy) {
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

                    if (tierCost === costsCopy[costsCopy.length - 1]) essenceTable += '\n';
                    else essenceTable += '; ';
                }
                i++;
            }

            if ('prestige' in itemData) {
                essenceTable += `|${prefix}_prestige = `;

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

                    if (cost === itemData.prestige.costs[itemData.prestige.costs.length - 1]) essenceTable += '\n';
                    else essenceTable += '; ';
                }
            }
        }

        for (const cost of armorData[Object.keys(armorData)[0]].upgrade_costs[0]) {
            if ('essence_type' in cost) {
                essenceTable += `|essence = ${toTitleCase(cost.essence_type)}\n`;
                break;
            } else if (cost === itemData.upgrade_costs[itemData.upgrade_costs.length - 1]) essenceTable += '|essence = none\n';
        }
    }

    essenceTable += '}}';

    copyEssenceTableButton.disabled = false;
    essenceTableElement.parentElement.classList.remove('unselectable');
    essenceTableElement.value = essenceTable;
    essenceTableElement.style.height = essenceTableElement.scrollHeight + 3 + 'px';
}
