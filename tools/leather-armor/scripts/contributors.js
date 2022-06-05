const contributors = {
    joker876: ['Converted the tool from JSFiddle to standalone website', 'Revamped the design', 'Owner of the Github repo', 'Created the contributors list', 'Created the color imports menu'],
    MonkeysHK: ['Added the fancy color picker', 'Made the output images update automatically'],
    Fewfre: ['Created armor base and overlay images', 'Created the original script for drawing armor pieces with specific color'],
};

const contributorsList = Object.keys(contributors).map((name) => constructSingleContributor(name, contributors[name]));

document.getElementById('contrib-list').innerHTML = contributorsList.join('');

function constructSingleContributor(name, list) {
    return [
        '<li>', //
        '<div class="tooltip">',
        '<span>',
        name,
        '</span>',
        '<span class="tooltiptext">',
        '<ul>',
        list.map((text) => `<li><span>${text}</span></li>`).join(''),
        '</ul>',
        '</span>',
        '</div>',
        '</li>',
    ].join('');
}

document.getElementById('contrib-list-div').style.display = 'none';

document.getElementById('show-contribs').addEventListener('click', () => {
    document.getElementById('contrib-list-div').classList.toggle('hidden-height');
    $('#contrib-list-div').toggle('slow');
});
