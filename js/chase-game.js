class ChaseGame
{
	constructor()
	{
		this.imgwhite = new Image();
		this.imgblack = new Image();
		this.imgsword = new Image();
		this.imgwhite.src = "img/cat_white.png";
		this.imgwhite.className = "obj";
		this.imgblack.src = "img/cat_black.png";
		this.imgblack.className = "obj";
		this.imgsword.src = "img/sword.png";
		this.imgsword.className = "obj";
		this.player = { x: 0, y: 0 };
		this.enemy = { x: 7, y: 7 };
		this.sword = { x: 2, y: 2 };
		this.isGameOver = false;
		this.isChase = true;
	}

	setup()
	{
		makeBoard(8,8);
		document.addEventListener("keydown", this.movePlayer.bind(this));
		this.drawCharacter("cell-0-0", this.imgwhite);
		this.drawCharacter("cell-7-7", this.imgblack);
		this.drawCharacter("cell-2-2", this.imgsword);
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

		if (this.player.x === 2 && this.player.y === 2)
		{
			if(this.sword !== null)
			{
				this.deleteCharacter("cell-2-2");
				this.sword = null;
				this.isChase = false;
			}
		}

		this.drawCharacter("cell-" + this.player.y + "-" + this.player.x, this.imgwhite);

		this.moveEnemy();
		this.checkState();

	}

	moveEnemy()
	{
		this.deleteCharacter("cell-" + this.enemy.y + "-" + this.enemy.x);
		if(this.isChase)
		{
			if (this.enemy.x < this.player.x && this.enemy.x < 7)
			{
				this.enemy.x++;
			}
			else if (this.enemy.x > this.player.x && this.enemy.x > 0)
			{
				this.enemy.x--;
			}

			if (this.enemy.y < this.player.y && this.enemy.y < 7)
			{
				this.enemy.y++;
			}
			else if (this.enemy.y > this.player.y && this.enemy.y > 0)
			{
				this.enemy.y--;
			}
		}
		else
		{
			//上下左右どこかにランダムに移動もしくはそのまま
			let direction = Math.floor(Math.random() * 5);
			switch (direction)
			{
				case 0:
					if (this.enemy.y > 0)
					{
						this.enemy.y--;
					}
					break;
				case 1:
					if (this.enemy.y < 7)
					{
						this.enemy.y++;
					}
					break;
				case 2:
					if (this.enemy.x > 0)
					{
						this.enemy.x--;
					}
					break;
				case 3:
					if (this.enemy.x < 7)
					{
						this.enemy.x++;
					}
					break;
				case 4:
					break;
			}
		}
		

		if (this.enemy.x === 2 && this.enemy.y === 2)
		{
			if(this.sword !== null)
			{
				this.deleteCharacter("cell-2-2");
				this.sword = null;
			}
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

	updateInfo(text)
	{
		document.getElementById("info").textContent = text;
	}

	checkState()
	{
		if (this.isGameOver)
		{
			this.resetGame();
			this.updateInfo("");
		}
		else
		{
			if(this.isChase)
			{
				this.updateInfo("追いかけるにゃ！");
			}
			else
			{
				this.updateInfo("逃げるにゃ！");
			}
		}
	}

	resetGame()
	{
		this.player = { x: 0, y: 0 };
		this.enemy = { x: 7, y: 7 };
		this.sword = { x: 2, y: 2 };
		this.isGameOver = false;
		this.isChase = true;
		this.drawCharacter("cell-0-0", this.imgwhite);
		this.drawCharacter("cell-7-7", this.imgblack);
		this.drawCharacter("cell-2-2", this.imgsword);
	}
}

let game = new ChaseGame();
game.setup();