import contributors from '../data/contributors.js';
import { linkImages, linkTitles } from '../data/other.js';
import { Toast } from './toast.js';

/**
 * Processes discord tooltips
 */
function processToDiscordTooltips() {
    document.querySelectorAll('.discord-tooltip').forEach((element) => {
        element.addEventListener('click', () => {
            const toCopy = element.getAttribute('copy-value');
            if (toCopy) {
                navigator.clipboard.writeText(toCopy);
                new Toast({ message: 'Copied!', type: 'success', time: 2000 }).show();
            }
        });
    });
}

const allCOntributorElements = [];

/**
 * Creates a link
 * @param {string} type the type of link
 * @param {string} value the value of the link
 * @returns {string} the HTML string for the link
 */
function makeLink(type, value) {
    if (type === 'discord') return makeDiscordElement(value);

    if (type === 'wiki') value = `https://hypixel-skyblock.fandom.com/wiki/User:${value}`;
    else if (type === 'github') value = `https://github.com/${value}`;
    else if (type === 'curseForge') value = `https://www.curseforge.com/members/${value}`;

    return `<a class="link" href="${value}"${value.match(/^https?:\/\//) ? ' target=_blank' : ''} title="${linkTitles[type]}">${linkImages[type]}</a>`;
}

/**
 * Creates a Discord element
 * @param {string} userTag the tag of the user to create
 * @returns {string} the HTML string for the user
 */
function makeDiscordElement(userTag) {
    return [
        '<button class="discord link">', //
        `${linkImages.discord}`,
        `<div class="discord-tooltip" copy-value="${userTag}">`,
        `<span>${userTag}</span>`,
        '<small class="copy-text">click to copy</small>',
        '<small class="copy-popup">copied!</small>',
        '</div>',
        '</button>',
    ].join('');
}

contributors.forEach((contributor) => {
    const links = [];

    Object.entries(contributor.links).forEach(([type, value], index) => {
        links.push(makeLink(type, value));
        if (index === 0 && Object.keys(contributor.links).length > 1) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<a href="https://hypixel-skyblock.fandom.com/wiki/User:${contributor.links.wiki}">`,
        `<img src="/files/images/user-icons/${contributor.thumbnail || 'default_icon'}.png" alt="${contributor.name} logo">`,
        '</a>',
        '<hr>',
        `<h4>${contributor.name}</h4>`,
        '<ul class="task-list">',
        contributor.githubOwner ? '<li>Owner of the GitHub repository and organization</li>' : '',
        contributor.githubMember ? '<li>Member of the GitHub repository and organization</li>' : '',
        contributor.tasks.map((task) => `<li>${task}</li>`).join(''),
        contributor.inactive ? '<li><span style="color: #f33; margin-left: 4px;">No longer active!</span></li>' : '',
        '</ul>',
        '<div class="links">',
        links.join(''),
        '</div>',
        '</li>',
    ].join('');

    allCOntributorElements.push(element);
});

document.querySelector('section.contributors > ul').innerHTML = allCOntributorElements.join('');

processToDiscordTooltips();
