import { contributors } from '../data/contributors.js';
import { linkImages, linkTitles } from '../data/other.js';
import { Toast } from './toast.js';

/**
 * Processes discord tooltips
 */
function processToDiscordTooltips() {
    document.querySelectorAll('.discord-tooltip').forEach((el) => {
        el.style.left = `${el.offsetWidth / -2 + el.parentElement.offsetHeight / 2}px`;
        el.style.bottom = `${el.parentElement.offsetWidth + 3}px`;

        el.addEventListener('click', () => {
            const toCopy = el.getAttribute('copy-value');
            if (toCopy) {
                navigator.clipboard.writeText(toCopy);
                new Toast({
                    message: 'Copied!',
                    type: 'success',
                    time: 2000
                }).show();
            }
        });
    });
}

const allCOntributorElements = [];

/**
 * Creates a link
 * @param {object} link the link object to create
 * @returns {string} the HTML string for the link
 */
function makeLink(link) {
    if (link.type === 'discord') return makeDiscordElement(link.value);

    const image = linkImages[link.type];
    const title = linkTitles[link.type];

    return `<a class="link" href="${link.value}"${link.value.match(/^https?:\/\//) ? ' target=_blank' : ''} title="${title}">${image}</a>`;
}

/**
 * Creates a discord element
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
        '</button>'
    ].join('');
}

contributors.forEach((contrib) => {
    const links = [];

    contrib.links.forEach((link) => {
        links.push(makeLink(link));
        if (link.border) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<a href="${contrib.links[0].value}">`,
        `<img src="/files/images/user-icons/${contrib.thumbnail || 'default_icon'}.png" alt="${contrib.name} logo">`,
        '</a>',
        '<hr>',
        `<h4>${contrib.name}</h4>`,
        '<ul class="task-list">',
        contrib.owner ? '<li>Owner of the GitHub repository and organization</li>' : '',
        contrib.member ? '<li>Member of the GitHub repository and organization</li>' : '',
        contrib.tasks.map((task) => `<li>${task}</li>`).join(''),
        contrib.inactive ? '<li><span style="color: #f33; margin-left: 4px;">No longer active!</span></li>' : '',
        '</ul>',
        '<div class="links">',
        links.join(''),
        '</div>',
        '</li>'
    ].join('');

    allCOntributorElements.push(element);
});

document.querySelector('section.contributors > ul').innerHTML = allCOntributorElements.join('');

processToDiscordTooltips();
