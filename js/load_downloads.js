const linkTypes = {
    text: '%s',
    download: 'Download',
    website: '<img src="./img/website-icon.png">',
    github: '<img src="./img/github-icon.png">',
    curseforge: '<img src="./img/curseforge-icon.png">',
}
const downloads = [
    {
        name: 'Wikitools Mod',
        description: 'A mod that lets you render any entity (mob, player, NPC, item, anything) with a single click of a button. Requires Forge for Minecraft 1.8.x.',
        thumbnail: 'wikitools.png',
        links: [
            {
                type: 'download',
                link: 'wikitools-2.6.jar',
                border: true,
            },
            {
                type: 'github',
                link: 'https://github.com/Charzard4261/wikitools',
            },
        ]
    },
    {
        name: 'Mineshot Mod',
        description: 'A mod that lets you take isometric screenshots.',
        thumbnail: 'mineshot.png',
        largeThumbnail: true,
        links: [
            {
                type: 'download',
                link: 'Mineshot-v1.7-1.8.9.jar',
                border: true,
            },
            {
                type: 'website',
                link: 'http://www.9minecraft.net/mineshot-mod',
            },
            {
                type: 'github',
                link: 'https://github.com/ata4/mineshot',
            },
        ]
    },
    {
        name: 'World Downloader Mod',
        description: 'A mod that lets you download a world from multiplayer to singleplayer.',
        thumbnail: 'world-downloader.png',
        links: [
            {
                type: 'text',
                link: 'https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/2520465-world-downloader-mod-create-backups-of-your-builds#Downloads',
                text: 'Choose Version',
                border: true,
            },
            {
                type: 'github',
                link: 'https://github.com/Pokechu22/WorldDownloader/releases',
            },
        ]
    },
    {
        name: 'Enchanted Item Toolkit (PS)',
        description: 'A set of <span class="code">.psd</span> templates used to make images for enchanted items and blocks.',
        thumbnail: 'enchanted-items-ps.png',
        links: [
            {
                type: 'download',
                link: 'Enchantment_Glint_ps.zip',
                border: true,
            },
            {
                type: 'text',
                link: 'https://www.photoshop.com/en',
                text: 'Get Photoshop',
            },
        ]
    },
    {
        name: 'Enchanted Item Toolkit (GIMP)',
        description: 'A set of <span class="code">.xcf</span> templates used to make images for enchanted items and blocks.',
        thumbnail: 'enchanted-items-gimp.png',
        links: [
            {
                type: 'download',
                link: 'Enchantment_Glint_gimp.zip',
                border: true,
            },
            {
                type: 'text',
                link: 'https://www.gimp.org/',
                text: 'Get GIMP',
            },
        ]
    },
    {
        name: 'BlockRenderer Mod',
        description: 'A mod that allows quick rendering of any item, block and head.',
        thumbnail: 'blockrenderer.png',
        links: [
            {
                type: 'download',
                link: 'BlockRenderer-0.3.3.jar',
                border: true,
            },
            {
                type: 'curseforge',
                link: 'https://www.curseforge.com/minecraft/mc-mods/blockrenderer',
            },
            {
                type: 'github',
                link: 'https://github.com/unascribed/BlockRenderer',
            },
        ]
    },
];

let allDownloadElements = [];
downloads.forEach(el => {
    let links = [];
    el.links.forEach(link => {
        let text = linkTypes[link.type];
        if (link.type == 'text') {
            text = link.text;
        }
        links.push(`<a href="${link.type == "download" ? "./downloads/" : ''}${link.link}"${link.type == "download" ? ' download' : ''}>${text}</a>`);
        if (link.border) {
            links.push('<span class="line"></span>');
        }
    })
    let element = [
        '<li>',
            `<img src="./downloads/thumbnails/${el.thumbnail}"${el.largeThumbnail ? ' style="width: 100%"' : ''} alt="tool logo">`,
            '<hr>',
            `<h4>${el.name}</h4>`,
            `<p>${el.description}</p>`,
            '<div class="links">',
                links.join(''),
            '</div>',
        '</li>',
    ].join('')
    allDownloadElements.push(element);
})
$('section.downloads > ul').html(allDownloadElements);