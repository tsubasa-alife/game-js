class ChaseGame
{
	constructor()
	{
		this.imgwhite = new Image();
		this.imgblack = new Image();
		this.imgwhite.src = "img/cat_white.png";
		this.imgwhite.className = "cat";
		this.imgblack.src = "img/cat_black.png";
		this.imgblack.className = "cat";
		this.player = { x: 0, y: 0 };
		this.enemy = { x: 7, y: 7 };
		this.isGameOver = false;
	}

	setup()
	{
		makeBoard(8,8);
		document.addEventListener("keydown", this.movePlayer.bind(this));
		this.drawCharacter("cell-0-0", this.imgwhite);
		this.drawCharacter("cell-7-7", this.imgblack);
	}

	drawCharacter(cellId, img)
	{
		let cell = document.getElementById(cellId);
		cell.appendChild(img);
	}

	deleteCharacter(cellId)
	{
		let cell = document.getElementById(cellId);
		cell.removeChild(cell.firstChild);
	}

	movePlayer(event)
	{
		this.deleteCharacter("cell-" + this.player.y + "-" + this.player.x);

		switch (event.key)
		{
			case "ArrowUp":
				if (this.player.y > 0)
				{
					this.player.y--;
				}
				break;
			case "ArrowDown":
				if (this.player.y < 7)
				{
					this.player.y++;
				}
				break;
			case "ArrowLeft":
				if (this.player.x > 0)
				{
					this.player.x--;
				}
				break;
			case "ArrowRight":
				if (this.player.x < 7)
				{
					this.player.x++;
				}
				break;
		}

		this.drawCharacter("cell-" + this.player.y + "-" + this.player.x, this.imgwhite);
		this.moveEnemy();
		this.checkState();

	}

	moveEnemy()
	{
		this.deleteCharacter("cell-" + this.enemy.y + "-" + this.enemy.x);
		if (this.enemy.x < this.player.x)
		{
			this.enemy.x++;
		}
		else if (this.enemy.x > this.player.x)
		{
			this.enemy.x--;
		}

		if (this.enemy.y < this.player.y)
		{
			this.enemy.y++;
		}
		else if (this.enemy.y > this.player.y)
		{
			this.enemy.y--;
		}

		if (this.enemy.x === this.player.x && this.enemy.y === this.player.y)
		{
			this.deleteCharacter("cell-" + this.player.y + "-" + this.player.x);
			this.drawCharacter("cell-" + this.enemy.y + "-" + this.enemy.x, this.imgblack);
			this.isGameOver = true;
		}
		else
		{
			this.drawCharacter("cell-" + this.enemy.y + "-" + this.enemy.x, this.imgblack);
		}
	}

	checkState()
	{
		if (this.isGameOver)
		{
			this.resetGame();
		}
	}

	resetGame()
	{
		this.player = { x: 0, y: 0 };
		this.enemy = { x: 7, y: 7 };
		this.isGameOver = false;
		this.drawCharacter("cell-0-0", this.imgwhite);
		this.drawCharacter("cell-7-7", this.imgblack);
	}
}

let game = new ChaseGame();
game.setup();