class GameBoard
{
	height;
	width;
	cells;

	constructor(h, w)
	{
		this.height = h;
		this.width = w;
		this.cells = [];
		this.makeBoard();
		this.resetCells();
	}

	makeBoard()
	{
		let b = document.getElementById("board");
		for (let i = 0; i < this.height; i++)
		{
			let tr = document.createElement("tr");
			for (let j = 0; j < this.width; j++)
			{
				let td = document.createElement("td");
				td.className = "cell";
				td.id = "cell-" + i + "-" + j;
				tr.appendChild(td);
			}
			b.appendChild(tr);
		}
	}

	resetCells()
	{
		for (let i = 0; i < this.height; i++)
		{
			this.cells[i] = [];
			for (let j = 0; j < this.width; j++)
			{
				this.cells[i][j] = { x: j, y: i, isWall: false };
			}
		}
	}

}