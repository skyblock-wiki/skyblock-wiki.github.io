const tools = [
    {
        link: './tools/head-render/index.html',
        thumbnail: './tools/head-render/favicon.png',
        name: 'Head Render Thingy',
        version: 'v4.0',
        description: 'Render custom player heads from various different data models.',
    },
    {
        link: './tools/leather-armor/index.html',
        thumbnail: './tools/leather-armor/favicon.png',
        name: 'Leather Armor Generator',
        version: 'v3.0',
        description: 'Render colored leather armor images. Requires no assets.',
    },
    {
        link: 'https://jsfiddle.net/Fewfre/sg5bqo2j/',
        thumbnail: './tools/thumbnails/sprite-maker.png',
        name: 'NPC Sprite Maker',
        version: 'v1.1',
        description: 'Render NPC sprites.',
    },
    {
        link: 'https://jsfiddle.net/MonkeysHK/nb2csh1a/',
        thumbnail: './tools/thumbnails/ui-parser.png',
        name: 'UI Generator',
        version: null,
        description: 'Generate UIs from NBT Data.',
    },
    {
        link: 'https://mcstacker.bimbimma.com/mcstacker1.10.php',
        thumbnail: './tools/thumbnails/mcstacker.png',
        name: '1.8 Command Generator',
        version: null,
        description: 'Generate any 1.8 command effortlessly.',
    },
    {
        link: 'https://sky.shiiyu.moe/',
        thumbnail: './tools/thumbnails/shiiyu.svg',
        name: 'Sky Shiiyu Moe',
        version: null,
        description: 'Obtain texture IDs for heads normally not obtainable (from player inventories).',
    },
    {
        link: 'https://github.com/Moulberry/NotEnoughUpdates-REPO/find/master',
        thumbnail: './tools/thumbnails/neu.png',
        name: '<abbr title="Not Enough Updates">NEU</abbr> Repository',
        version: null,
        description: 'Repository for information about public SkyBlock items.',
    },
];
const allElements = [];

tools.forEach((el) => {
    const element = [
        '<li>',
        `<img src="${el.thumbnail}" alt="tool logo">`,
        '<hr>',
        `<h4>${el.name}</h4>`,
        `<span class="version">${el.version ? el.version : '&nbsp;'}</span>`,
        `<p>${el.description}</p>`,
        '<div class="links">',
        `<a class="link" href="${el.link}"${el.link.match(/^https?:\/\//) ? ' target=_blank' : ''}>Open</a>`,
        '</div>',
        '</li>',
    ].join('');

    allElements.push(element);
});
$('section.tools > ul').html(allElements);
