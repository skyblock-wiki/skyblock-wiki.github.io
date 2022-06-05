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

const linkImages = {
    wiki: '<img src="/files/images/wiki-icon.png">',
    discord: '<img src="/files/images/link-icons/discord-icon.png">',
    website: '<img src="/files/images/link-icons/website-icon.png">',
    github: '<img src="/files/images/link-icons/github-icon.png">',
    curseForge: '<img src="/files/images/link-icons/curseforge-icon.png">',
};

const linkTitles = {
    wiki: 'Wiki userpage',
    discord: 'Discord Username',
    website: 'Personal Website',
    github: 'GitHub Profile',
    curseForge: 'CurseForge Profile',
};

const contributors = [
    {
        name: 'joker876',
        thumbnail: 'joker876.png',
        aka: [],
        tasks: ['Owner of the GitHub repository and organization', 'Created the main page', 'Helped create the Head Render Thingy', 'Helped create the Leather Armor Renderer'],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:Joker876',
                border: true,
            },
            {
                type: 'discord',
                value: 'joker876#8914',
            },
            {
                type: 'github',
                value: 'https://github.com/joker876',
            },
            {
                type: 'curseForge',
                value: 'https://www.curseforge.com/members/joker876xd8',
            },
        ],
    },
    {
        name: 'Fewfre',
        thumbnail: 'fewfre.png',
        aka: [],
        tasks: ['Helped create the Head Render Thingy', 'Helped create the Leather Armor Renderer', 'Helped with many other issues'],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:Fewfre',
                border: true,
            },
            {
                type: 'discord',
                value: 'fewfre#9549',
            },
            {
                type: 'github',
                value: 'https://github.com/fewfre',
            },
        ],
    },
    {
        name: 'Thundercraft5',
        thumbnail: 'ruby.png',
        aka: ['Ruby'],
        tasks: ['Owner of the GitHub repository and organization', 'Maintains the Hypixel SkyBlock Wiki Bot', 'Added various enhancements to the site', "<span style='color: #f33; margin-left: 4px;'>No longer active!</span>"],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:Thundercraft5',
                border: true,
            },
            {
                type: 'discord',
                value: '💻Ruby#3280',
            },
            {
                type: 'github',
                value: 'https://github.com/Thundercraft5',
            },
        ],
    },
    {
        name: 'MonkeysHK',
        thumbnail: 'blank.png',
        aka: [],
        tasks: ['Member of the GitHub repository/organization', 'Helped create the Head Render Thingy', 'Helped create the Leather Armor Renderer'],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:MonkeysHK',
                border: true,
            },
            {
                type: 'github',
                value: 'https://github.com/MonkeysHK',
            },
            {
                type: 'curseForge',
                value: 'https://www.curseforge.com/members/MonkeysHK',
            },
        ],
    },
    {
        name: 'Pwign',
        thumbnail: 'pwign.png',
        aka: [],
        tasks: ['Helped create the Head Render Thingy', "<span style='color: #f33; margin-left: 4px;'>No longer active!</span>"],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:Pwign',
            },
        ],
    },
    {
        name: 'TheTrueShaman',
        thumbnail: 'shaman.png',
        aka: [],
        tasks: ['Helped create the Infobox Generator'],
        links: [
            {
                type: 'wiki',
                value: 'https://hypixel-skyblock.fandom.com/wiki/User:TheTrueShaman',
                border: true,
            },
            {
                type: 'discord',
                value: 'TheTrueShaman#9445',
            },
            {
                type: 'github',
                value: 'https://github.com/The-Shaman',
            },
        ],
    },
];

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
