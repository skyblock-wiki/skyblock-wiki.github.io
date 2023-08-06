import downloads from '../data/downloads.js';
import { linkImages, linkNames } from '../data/other.js';

const allDownloadElements = [];

downloads.forEach((download) => {
    const links = [];

    download.links.forEach((link, index) => {
        let content = linkImages[link.type] || linkNames[link.type];

        if (content === 'text') content = link.text;

        links.push(
            `<a class="link" href="${link.type === 'download' ? '/files/downloads/' : ''}${link.link}"${link.link.match(/^https?:\/\//) ? ' target=_blank' : ''}${
                link.type === 'download' ? ' download' : ''
            }>${content}</a>`,
        );
        if (index === 0) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<a ${download.largeThumbnail ? ' style="width: 100%"' : ''} href="${download.links[0].type === 'download' ? '/files/downloads/' : ''}${download.links[0].link}"${
            download.links[0].link.match(/^https?:\/\//) ? ' target=_blank' : ''
        }${download.links[0].type === 'download' ? ' download' : ''}>`,
        `<img src="/files/images/download-thumbnails/${download.thumbnail}.png" alt="${download.name} logo">`,
        '</a>',
        '<hr>',
        `<h4>${download.name}</h4>`,
        `<p>${download.description}</p>`,
        '<div class="links">',
        links.join(''),
        '</div>',
        '</li>',
    ].join('');

    allDownloadElements.push(element);
});

document.querySelector('section.downloads > ul').innerHTML = allDownloadElements.join('');
