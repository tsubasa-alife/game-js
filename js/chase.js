setup();

function setup()
{
	makeBoard(8,8);
	const imgwhite = new Image();
	imgwhite.src = "img/cat_white.png";
	imgwhite.className = "cat";
	const imgblack = new Image();
	imgblack.src = "img/cat_black.png";
	imgblack.className = "cat";
	let cell1 = document.getElementById("cell-0-0");
	let cell2 = document.getElementById("cell-7-7");
	cell1.appendChild(imgwhite);
	cell2.appendChild(imgblack);
}