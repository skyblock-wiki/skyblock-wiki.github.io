const contributors = {
    joker876: [
        "Created the NBT Data parser",
        "Converted the tool from JSFiddle to standalone website",
        "Revamped the design",
        "Owner of the Github repo",
        "Created the contributors list"
    ],
    Fewfre: [
        "Created the renderer from NBT Data",
        "Created the texture ID info on the right",
        "Helped with the creation of a private CORS proxy"
    ],
    Pwign: [
        "Created the head rendering algorithm",
        "Created the renderer from uploaded file"
    ],
    MonkeysHK: [
        "Created the renderer from NameMC and texture ID"
    ]
}

let contribsList = '';
for (const key in contributors) {
    if (Object.hasOwnProperty.call(contributors, key)) {
        const value = contributors[key];
        contribsList += constructSingleContributor(key, value);
    }
}
$('#contrib-list').html(contribsList);
function constructSingleContributor(name, list) {
    return `<li>
    <div class="tooltip">
        <span>${name}</span>
        <span class="tooltiptext">
            <ul>
                ${list.map(text => `<li><span>${text}</span></li>`).join("")}
            </ul>
        </span>
    </div>
</li>`
}

$('#show-contribs').click(() => {
    $('#contrib-list-div').toggleClass('hidden-height');
    if ($('#contrib-list-div').hasClass('hidden-height')) {
        $('#contrib-list-div').animate({height: 0}, 500);
    }
    else {
        var el = $('#contrib-list-div'),
        curHeight = el.height(),
        autoHeight = el.css('height', 'auto').height();
        console.log(autoHeight);
        el.height(curHeight).animate({height: autoHeight}, 500);
    }
})