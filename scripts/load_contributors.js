import { contributors } from '../data/contributors.js';
import { linkImages, linkTitles } from '../data/other.js';
import { Toast } from './toast.js';

function processToDiscordTooltips() {
    document.querySelectorAll('.discordtip').forEach((el) => {
        el.style.left = `${el.offsetWidth / -2 + el.parentElement.offsetHeight / 2}px`;
        el.style.bottom = `${el.parentElement.offsetWidth + 3}px`;

        el.addEventListener('click', () => {
            const toCopy = el.getAttribute('copy-value');
            if (toCopy) {
                navigator.clipboard.writeText(toCopy);
                new Toast({
                    message: 'Copied!',
                    type: 'success',
                    time: 2000,
                }).show();
            }
        });
    });
}

const allCOntributorElements = [];

function makeLink(link) {
    if (link.type == 'discord') return makeDiscordElement(link.value);

    const image = linkImages[link.type];
    const title = linkTitles[link.type];

    return `<a class="link" href="${link.value}"${link.value.match(/^https?:\/\//) ? ' target=_blank' : ''} title="${title}">${image}</a>`;
}

function makeDiscordElement(usertag) {
    return [
        '<button class="discord link">', //
        `${linkImages.discord}`,
        `<div class="discordtip" copy-value="${usertag}">`,
        `<span>${usertag}</span>`,
        '<small class="copy-text">click to copy</small>',
        '<small class="copy-popup">copied!</small>',
        '</div>',
        '</button>',
    ].join('');
}

contributors.forEach((el) => {
    const links = [];

    el.links.forEach((link) => {
        links.push(makeLink(link));
        if (link.border) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<a href="${el.links[0].value}">`,
        `<img src="/files/images/user-icons/${el.thumbnail}" alt="user logo">`,
        '</a>',
        '<hr>',
        `<h4>${el.name}</h4>`,
        '<ul class="tasklist">',
        el.tasks.map((task) => `<li>${task}</li>`).join(''),
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
