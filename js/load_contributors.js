function processToDiscordTolltips() {
    $('.discordtip').each((index, el) => {
        $(el).css({
            //$(el).parent().outerWidth()/2
            left: ($(el).outerWidth()/(-2)+$(el).parent().outerWidth()/2)+"px",
            bottom: ($(el).parent().outerHeight()+3)+"px"
        })
    })
    $('.discordtip').click(function() {
        $(this).attr('copy-value').copyToClipboard();
    })
}
String.prototype.copyToClipboard = function() {
    let el = document.createElement('textarea');
    el.value = this;
    el.setAttribute('readonly', '');
    el.style = {display: "none"};
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 9999999);
    document.execCommand('copy');
    document.body.removeChild(el);
}

const linkImages = {
    text: '%s',
    wiki: '<img src="/WikiIcon.png">',
    discord: '<img src="./img/curseforge-icon.png">',
    website: '<img src="./img/website-icon.png">',
    github: '<img src="./img/github-icon.png">',
    curseforge: '<img src="./img/curseforge-icon.png">',
}
const linkTitles = {
    text: '',
    wiki: 'Userpage on the wiki',
    discord: '',
    website: 'Personal Website',
    github: 'GitHub Profile',
    curseforge: 'Curseforge Profile',
}
const contributors = [
    {
        name: "joker876",
        thumbnail: "joker876.png",
        aka: [],
        tasks: [
            "Owner of the GitHub repository and organization",
            "Created the main page",
            "Helped create the Head Render Thingy",
            "Helped create the Leather Armor Renderer",
        ],
        links: [
            {
                type: "wiki",
                value: "https://hypixel-skyblock.fandom.com/wiki/User:Joker876",
                border: true,
            },
            {
                type: "discord",
                value: "joker876#8914",
            },
            {
                type: "github",
                value: "https://github.com/joker876",
            },
            {
                type: "curseforge",
                value: "https://www.curseforge.com/members/joker876xd8",
            },
        ]
    },
    {
        name: "Fewfre",
        thumbnail: "fewfre.png",
        aka: [],
        tasks: [
            "Helped create the Head Render Thingy",
            "Helped create the Leather Armor Renderer",
            "Helped with many other issues",
        ],
        links: [
            {
                type: "wiki",
                value: "https://hypixel-skyblock.fandom.com/wiki/User:Fewfre",
                border: true,
            },
            {
                type: "discord",
                value: "fewfre#9549",
            },
            {
                type: "github",
                value: "https://github.com/fewfre",
            },
        ]
    },
    {
        name: "Thundercraft5",
        thumbnail: "ruby.png",
        aka: [
            'Ruby'
        ],
        tasks: [
            "Owner of the GitHub repository and organization",
            "Maintains the Hypixel SkyBlock Wiki Bot",
            "Added the LICENSE and README to the repository",
        ],
        links: [
            {
                type: "wiki",
                value: "https://hypixel-skyblock.fandom.com/wiki/User:Thundercraft5",
                border: true,
            },
            {
                type: "discord",
                value: "Ruby#3280",
            },
            {
                type: "github",
                value: "https://github.com/Thundercraft5",
            },
        ]
    },
    {
        name: "MonkeysHK",
        thumbnail: "blank.png",
        aka: [],
        tasks: [
            "Member of the GitHub repository/organization",
            "Helped create the Head Render Thingy",
            "Helped create the Leather Armor Renderer",
        ],
        links: [
            {
                type: "wiki",
                value: "https://hypixel-skyblock.fandom.com/wiki/User:MonkeysHK",
                border: true,
            },
            {
                type: "github",
                value: "https://github.com/MonkeysHK",
            },
        ]
    },
    {
        name: "Pwign",
        thumbnail: "pwign.png",
        aka: [],
        tasks: [
            "Helped create the Head Render Thingy",
            "<span style='color: #f33; margin-left: 4px;'>No longer active!</span>"
        ],
        links: [
            {
                type: "wiki",
                value: "https://hypixel-skyblock.fandom.com/wiki/User:Pwign",
            },
        ]
    },
]
let allCOntributorElements = [];
function makeLink(link) {
    if (link.type == 'discord') return makeDiscordElement(link.value);
    let text = linkImages[link.type];
    if (link.type == 'text') {
        text = link.text;
    }
    let title = linkTitles[link.type];
    return `<a class="link" href="${link.value}"${link.value.match(/^https?:\/\//)?' target=_blank':''} title="${title}">${text}</a>`;
}
function makeDiscordElement(usertag) {
    let hasHover = $('body').hasClass("hasHover");
    return [
        '<button class="discord link">',
            '<img src="/img/discord-icon.png">',
            `<div class="discordtip" copy-value="${usertag}">`,
                `<span>${usertag}</span>`,
                '<small class="copy-text">click to copy</small>',
                '<small class="copy-popup">copied!</small>',
            '</div>',
        '</button>',
    ].join('');
}
function makeAKA(list) {
    if (list.length == 0) return
}
contributors.forEach(el => {
    let links = [];
    el.links.forEach(link => {
        links.push(makeLink(link));
        if (link.border) {
            links.push('<span class="line"></span>');
        }
    })
    let element = [
        '<li>',
            `<a href="${el.links[0].value}">`,
                `<img src="/img/usericons/${el.thumbnail}" alt="user logo">`,
            '</a>',
            '<hr>',
            `<h4>${el.name}</h4>`,
            '<ul class="tasklist">',
                el.tasks.map(task => `<li>${task}</li>`).join(''),
            '</ul>',
            '<div class="links">',
                links.join(''),
            '</div>',
        '</li>',
    ].join('')
    allCOntributorElements.push(element);
})
$('section.contributors > ul').html(allCOntributorElements);
processToDiscordTolltips();