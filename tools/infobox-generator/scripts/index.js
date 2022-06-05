import { Toast } from '../../../scripts/toast.js';

async function fetchItems() {
    const itemsData = await fetch('https://api.hypixel.net/resources/skyblock/items');
    window.itemList = await itemsData.json();
    window.itemList = window.itemList.items;
    const bazaarData = await fetch('https://api.hypixel.net/skyblock/bazaar');
    window.bazaarList = await bazaarData.json();
    window.bazaarList = window.bazaarList.products;
}

fetchItems();

window.settings = { title: false };

const mainElem = {
    name: document.getElementById('name'),
    id: document.getElementById('id'),
};

const subElem = {
    name: document.getElementById('nameSubmit'),
    id: document.getElementById('idSubmit'),
};

mainElem.name.addEventListener('input', () => {
    onChanged('name');
});
subElem.name.addEventListener('click', () => {
    onChanged('name');
});
mainElem.id.addEventListener('input', () => {
    onChanged('id');
});
subElem.id.addEventListener('click', () => {
    onChanged('id');
});

function onChanged(inputType) {
    if (!window.itemList) {
        new Toast({
            message: 'The item list has not yet loaded. Please wait or try refreshing the page!',
            type: 'disallow',
            time: 4000,
        }).show();
    } else {
        const thing = document.getElementById(inputType).value.toLowerCase();
        for (let i = 0; i < window.itemList.length; i++) {
            if (window.itemList[i][inputType].toLowerCase() === thing) {
                createInfobox(window.itemList[i]);
                break;
            }
        }
    }
}

document.getElementById('copy-infobox').addEventListener('click', () => {
    copyText('infobox');
});
document.getElementById('copy-essenceTable').addEventListener('click', () => {
    copyText('essenceTable');
});

function copyText(selector) {
    try {
        window.navigator.clipboard.writeText(document.getElementById(selector).innerHTML);
        new Toast({
            message: 'Copied!',
            type: 'success',
            time: 2000,
        }).show();
    } catch (error) {
        console.error(error);
        new Toast({
            message: 'Unable to copy, please try again!',
            type: 'disallow',
            time: 4000,
        }).show();
    }
}

function toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}

function gemstoneHelper(gemstone) {
    gemstone = gemstone.toLowerCase();
    gemstone = gemstone.replace('_gem', '');
    gemstone = gemstone.replace('_', ' ');
    return toTitleCase(gemstone);
}

//Stolen from: https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
function romanize(num) {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split('');
    const key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    let roman = '';
    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

function createInfobox(itemData) {
    let infobox = '{{Infobox ';
    if (itemData.category) {
        const categories = { SWORD: 'weapon', WAND: 'weapon', BOW: 'weapon', LONGSWORD: 'weapon', DEPLOYABLE: 'item', COSMETIC: 'item', TRAVEL_SCROLL: 'item', ACCESSORY: 'accessory', HELMET: 'armor', CHESTPLATE: 'armor', LEGGINGS: 'armor', BOOTS: 'boots', PET_ITEM: 'item', ARROW_POISON: 'item', GAUNTLET: 'item', BELT: 'item', BRACELET: 'item', CLOAK: 'item', GLOVES: 'item', NECKLACE: 'item', DUNGEON_PASS: 'item', REFORGE_STONE: 'reforge stone', BAIT: 'item', AXE: 'item', HOE: 'item', SPADE: 'item', SHEARS: 'item', PICKAXE: 'item', FISHING_ROD: 'fishing rod' };
        infobox += categories[itemData.category];
    } else {
        infobox += 'item';
    }
    infobox += '<br>';
    if (window.settings.title) {
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
            if (statKeys[i] === 'WALK_SPEED') {
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
                        infobox += cost.amount.toString() + ' ' + gemstoneHelper(cost.item_id);
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
    if (window.bazaarList[itemData.id]) {
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
    if (window.bazaarList[itemData.id]) {
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
    document.getElementById('copy-infobox').disabled = false;
    document.getElementById('infobox').parentElement.classList.remove('unselectable');
    document.getElementById('infobox').innerHTML = infobox;
    if (itemData.upgrade_costs) {
        createEssenceTable(itemData);
    } else {
        document.getElementById('essenceTable').innerHTML = '&ZeroWidthSpace;';
    }
}

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
                for (let i = 0; i < window.itemList.length; i++) {
                    if (window.itemList[i].id == itemData.upgrade_costs[a][b].item_id) {
                        itemName = window.itemList[i].name;
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
                for (let i = 0; i < window.itemList.length; i++) {
                    if (window.itemList[i].id === itemData.prestige.costs[a].item_id) {
                        itemName = window.itemList[i].name;
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
    document.getElementById('copy-essenceTable').disabled = false;
    document.getElementById('essenceTable').parentElement.classList.remove('unselectable');
    document.getElementById('essenceTable').innerHTML = essenceTable;
}
