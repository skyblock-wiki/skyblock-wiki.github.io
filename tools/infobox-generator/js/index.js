async function fetchItems() {
    const itemData = await fetch('https://api.hypixel.net/resources/skyblock/items');   
    window.itemList = await itemData.json();
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

mainElem.name.on('paste', onChanged('name'));
mainElem.name.on('input', onChanged('name'));
subElem.name.on('click', onChanged('name'));
mainElem.id.on('paste', onChanged('id'));
mainElem.id.on('input', onChanged('id'));
subElem.id.on('click', onChanged('id'));

function onChanged(input_type) {
    if (!window.itemList) {
        console.log('Hello');
        //Send an issue here saying data not yet loaded.
    }
}
