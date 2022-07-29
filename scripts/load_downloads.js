import { downloads } from '../data/downloads.js';
import { linkImages, linkNames } from '../data/other.js';

const allDownloadElements = [];

downloads.forEach((download) => {
    const links = [];

    download.links.forEach((link) => {
        let content = linkImages[link.type] || linkNames[link.type];

        if (content === 'text') content = link.text;

        links.push(`<a class="link" href="${link.type === 'download' ? '/files/downloads/' : ''}${link.link}"${link.link.match(/^https?:\/\//) ? ' target=_blank' : ''}${link.type === 'download' ? ' download' : ''}>${content}</a>`);
        if (link.border) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<img src="/files/images/download-thumbnails/${download.thumbnail}.png"${download.largeThumbnail ? ' style="width: 100%"' : ''} alt="${download.name} logo">`,
        '<hr>',
        `<h4>${download.name}</h4>`,
        `<p>${download.description}</p>`,
        '<div class="links">',
        links.join(''),
        '</div>',
        '</li>'
    ].join('');

    allDownloadElements.push(element);
});

document.querySelector('section.downloads > ul').innerHTML = allDownloadElements.join('');
