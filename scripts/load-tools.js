import tools from '../data/tools.js';

const allElements = tools.map((tool) => {
    if (tool.isSiteTool) tool.link = `/tools/${tool.id}/index.html`;
    return [
        `<li class="${tool.isSiteTool ? 'sitetool' : ''}">`, //
        `<a href="${tool.link}"${!tool.isSiteTool ? ' target=_blank' : ''}>`,
        `<img src="/files/images/tool-icons/${tool.id || tool.thumbnail}.png" alt="tool logo">`,
        '</a>',
        '<hr>',
        `<h4>${tool.name}</h4>`,
        `<span class="version">${tool.version ? tool.version : '&nbsp;'}</span>`,
        `<p>${tool.description}</p>`,
        '<div class="links">',
        `<a class="link" href="${tool.link}"${!tool.isSiteTool ? ' target=_blank' : ''}>Open</a>`,
        '</div>',
        '</li>',
    ].join('');
});

document.querySelector('section.tools > ul').innerHTML = allElements.join('');
