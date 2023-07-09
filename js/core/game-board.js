class GameBoard
{
	height;
	width;
	cells;
	canClick;

	constructor(h, w)
	{
		this.height = h;
		this.width = w;
		this.cells = [];
		this.makeBoard();
		this.resetCells();
		this.canClick = true;
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
				td.addEventListener("click", this.makeWall.bind(this));
				tr.appendChild(td);
			}
			b.appendChild(tr);
		}
	}

	makeWall(e)
	{
		if(this.canClick)
		{
			let x = e.target.id.split("-")[2];
			let y = e.target.id.split("-")[1];
			if(this.cells[y][x].isChara)
			{
				return;
			}
			this.cells[y][x].isWall = true;
			let cell = document.getElementById("cell-" + y + "-" + x);
			cell.style.backgroundColor = "black";
		}
	}

	enableClick()
	{
		if(!this.canClick)
		{
			for (let i = 0; i < this.height; i++)
			{
				for (let j = 0; j < this.width; j++)
				{
					let cell = document.getElementById("cell-" + i + "-" + j);
					cell.addEventListener("click", this.makeWall.bind(this));
				}
			}
			this.canClick = true;
		}
	}

	disableClick()
	{
		if(this.canClick)
		{
			for (let i = 0; i < this.height; i++)
			{
				for (let j = 0; j < this.width; j++)
				{
					let cell = document.getElementById("cell-" + i + "-" + j);
					cell.removeEventListener("click", this.makeWall.bind(this));
				}
			}
			this.canClick = false;
		}
	}


	resetCells()
	{
		for (let i = 0; i < this.height; i++)
		{
			this.cells[i] = [];
			for (let j = 0; j < this.width; j++)
			{
				this.cells[i][j] = { x: j, y: i, isChara: false, isWall: false };
			}
		}
	}

}