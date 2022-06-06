const contributors = {
    joker876: ['Created the NBT Data parser', 'Converted the tool from JSFiddle to standalone website', 'Revamped the design', 'Owner of the Github repo', 'Created the contributors list'],
    Fewfre: ['Created the renderer from NBT Data', 'Created the texture ID info on the right', 'Helped with the creation of a private CORS proxy'],
    Pwign: ['Created the head rendering algorithm', 'Created the renderer from uploaded file'],
    MonkeysHK: ['Created the renderer from NameMC and texture ID', 'Integrated the sprite renderer into this tool'],
};

const contributorsList = Object.keys(contributors).map((name) => createContributor(name, contributors[name]));

document.getElementById('contrib-list').innerHTML = contributorsList.join('');

/**
 * Creates information for a contributor
 * @param {string} name the name of the contributor
 * @param {Array} list the list of tasks the contributor has done
 * @returns {string} the HTML string for the contributor
 */
function createContributor(name, list) {
    return [
        '<li>', //
        '<div class="tooltip">',
        '<span>',
        name,
        '</span>',
        '<span class="tooltip-text">',
        '<ul>',
        list.map((text) => `<li><span>${text}</span></li>`).join(''),
        '</ul>',
        '</span>',
        '</div>',
        '</li>',
    ].join('');
}

document.getElementById('contrib-list-div').style.display = 'none';

document.getElementById('show-contributors').addEventListener('click', () => {
    document.getElementById('contrib-list-div').classList.toggle('hidden-height');
    $('#contrib-list-div').toggle('slow');
});
