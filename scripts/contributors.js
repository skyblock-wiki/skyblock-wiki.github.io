import { contributors } from '../data/page-contributors.js';

const tool = window.location.pathname.replace(/\/tools\/|\/|index\.html/g, '');

if (tool in contributors) {
    const contributorsList = Object.keys(contributors[tool]).map((name) => createContributor(name, contributors[tool][name]));

    document.getElementById('contrib-list').innerHTML = contributorsList.join('');

    document.getElementById('show-contributors').addEventListener('click', () => {
        document.getElementById('contrib-list-div').classList.toggle('hidden');
    });
}

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
