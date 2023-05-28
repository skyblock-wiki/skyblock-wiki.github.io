import { tools } from '../data/tools.js';

const allElements = tools.map((tool) =>
    [
        `<li class="${tool.issitetool ? "sitetool" : ""}">`, //
        `<img src="/files/images/tool-icons/${tool.thumbnail}.png" alt="tool logo">`,
        '<hr>',
        `<h4>${tool.name}</h4>`,
        `<span class="version">${tool.version ? tool.version : '&nbsp;'}</span>`,
        `<p>${tool.description}</p>`,
        '<div class="links">',
        `<a class="link" href="${tool.link}"${tool.link.match(/^https?:\/\//) ? ' target=_blank' : ''}>Open</a>`,
        '</div>',
        '</li>'
    ].join('')
);

document.querySelector('section.tools > ul').innerHTML = allElements.join('');
