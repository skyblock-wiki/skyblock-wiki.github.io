import contributors from '../data/page-contributors.js';
import tools from '../data/tools.js';

/* Add Contributors */
const thisToolName = window.location.pathname.replace(/\/tools\/|\/|index\.html|^\./g, '');
if (thisToolName in contributors) {
    const contributorsList = Object.keys(contributors[thisToolName]).map((name) => createContributor(name, contributors[thisToolName][name]));

    document.getElementById('contrib-list').innerHTML = contributorsList.join('');

    document.getElementById('show-contributors').addEventListener('click', () => {
        document.getElementById('contrib-list-div').classList.toggle('hidden');
    });
}

/* Add Version Number */
const versionElm = document.querySelector('header .version');
if (versionElm) {
    for (const tool of tools) {
        if (tool.version && tool.id === thisToolName) {
            versionElm.innerText = tool.version;
            break;
        }
    }
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
