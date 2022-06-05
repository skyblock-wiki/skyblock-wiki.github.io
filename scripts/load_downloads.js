import { downloads } from '../data/downloads.js';
import { linkImages, linkNames } from '../data/other.js';

const allDownloadElements = [];

downloads.forEach((el) => {
    const links = [];

    el.links.forEach((link) => {
        let content = linkImages[link.type] || linkNames[link.type];

        if (content === 'text') content = link.text;

        links.push(`<a class="link" href="${link.type == 'download' ? '/files/downloads' : ''}${link.link}"${link.link.match(/^https?:\/\//) ? ' target=_blank' : ''}${link.type == 'download' ? ' download' : ''}>${content}</a>`);
        if (link.border) links.push('<span class="line"></span>');
    });
    const element = [
        '<li>', //
        `<img src="/files/images/download-thumbnails/${el.thumbnail}"${el.largeThumbnail ? ' style="width: 100%"' : ''} alt="tool logo">`,
        '<hr>',
        `<h4>${el.name}</h4>`,
        `<p>${el.description}</p>`,
        '<div class="links">',
        links.join(''),
        '</div>',
        '</li>',
    ].join('');

    allDownloadElements.push(element);
});
$('section.downloads > ul').html(allDownloadElements);
