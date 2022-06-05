const contributors = {
    joker876: ['Converted the tool from JSFiddle to standalone website', 'Revamped the design', 'Owner of the Github repo', 'Created the contributors list', 'Created the color imports menu'],
    MonkeysHK: ['Added the fancy color picker', 'Made the output images update automatically'],
    Fewfre: ['Created armor base and overlay images', 'Created the original script for drawing armor pieces with specific color'],
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
