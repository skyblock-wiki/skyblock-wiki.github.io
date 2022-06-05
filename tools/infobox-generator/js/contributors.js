const contributors = {
    TheTrueShaman: ['Created this tool.'],
};
let contribsList = '';

for (const key in contributors)
    if (Object.hasOwnProperty.call(contributors, key)) {
        const value = contributors[key];

        contribsList += constructSingleContributor(key, value);
    }

$('#contrib-list').html(contribsList);

function constructSingleContributor(name, list) {
    return `<li>
	<div class="tooltip">
		<span>${name}</span>
		<span class="tooltiptext">
			<ul>
				${list.map((text) => `<li><span>${text}</span></li>`).join('')}
			</ul>
		</span>
	</div>
</li>`;
}

$('#contrib-list-div').hide();
$('#show-contribs').click(() => {
    $('#contrib-list-div').toggleClass('hidden-height');
    $('#contrib-list-div').toggle('slow');
});
