function makeBoard(H, W)
{
	let b = document.getElementById("board");
	for (let i = 0; i < H; i++)
	{
		let tr = document.createElement("tr");
		for (let j = 0; j < W; j++)
		{
			let td = document.createElement("td");
			td.className = "cell";
			td.id = "cell-" + i + "-" + j;
			td.onclick = clicked;
			tr.appendChild(td);
		}
		b.appendChild(tr);
	}
}

function clicked(e)
{
	document.getElementById("info").textContent = e.target.id + " clicked";
}