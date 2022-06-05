const tools = [
    {
        link: './tools/head-render/index.html',
        thumbnail: 'head-render.png',
        name: 'Head Render Thingy',
        version: 'v4.0',
        description: 'Render custom player heads and NPC sprites from various different data models.',
    },
    {
        link: './tools/leather-armor/index.html',
        thumbnail: 'leather-armor.png',
        name: 'Leather Armor Generator',
        version: 'v3.0',
        description: 'Render colored leather armor images. Requires no assets.',
    },
    {
        link: './tools/infobox-generator/index.html',
        thumbnail: 'infobox-generator.png',
        name: 'Infobox Generator',
        version: 'v1.0',
        description: "Creates basic infoboxes and essence crafting tables from an item's API data.",
    },
    {
        link: 'https://jsfiddle.net/MonkeysHK/nb2csh1a/',
        thumbnail: 'ui-parser.png',
        name: 'UI Generator',
        version: null,
        description: 'Generate UIs from NBT Data.',
    },
    {
        link: 'https://legacy.mcstacker.net/mcstacker1.10.php',
        thumbnail: 'mcstacker.png',
        name: '1.8 Command Generator',
        version: null,
        description: 'Generate any 1.8 command effortlessly.',
    },
    {
        link: 'https://sky.shiiyu.moe/',
        thumbnail: 'shiiyu.svg',
        name: 'Sky Shiiyu Moe',
        version: null,
        description: 'Obtain texture IDs for heads normally not obtainable (from player inventories).',
    },
    {
        link: 'https://github.com/Moulberry/NotEnoughUpdates-REPO/find/master',
        thumbnail: 'neu.png',
        name: '<abbr title="Not Enough Updates">NEU</abbr> Repository',
        version: null,
        description: 'Repository for information about public SkyBlock items.',
    },
];

const allElements = tools.map((tool) =>
    [
        '<li>', //
        `<img src="/files/images/tool-icons/${tool.thumbnail}" alt="tool logo">`,
        '<hr>',
        `<h4>${tool.name}</h4>`,
        `<span class="version">${tool.version ? tool.version : '&nbsp;'}</span>`,
        `<p>${tool.description}</p>`,
        '<div class="links">',
        `<a class="link" href="${tool.link}"${tool.link.match(/^https?:\/\//) ? ' target=_blank' : ''}>Open</a>`,
        '</div>',
        '</li>',
    ].join('')
);

document.querySelector('section.tools > ul').innerHTML = allElements.join('');
