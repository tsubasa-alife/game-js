class AStar
{
	constructor()
	{
		this.imgwhite = new Image();
		this.imgblack = new Image();
		this.imgwhite.src = "img/cat_white.png";
		this.imgwhite.className = "obj";
		this.imgblack.src = "img/cat_black.png";
		this.imgblack.className = "obj";
		this.player = { x: 0, y: 0 };
		this.enemy = { x: 7, y: 7 };
		this.board = new GameBoard(8,8);
	}

	setup()
	{
		this.drawCharacter("cell-0-0", this.imgwhite);
		this.drawCharacter("cell-7-7", this.imgblack);
		this.board.cells[0][0].isChara = true;
		this.board.cells[7][7].isChara = true;
		document.getElementById("start").addEventListener("click", this.searchPath.bind(this));
		document.getElementById("reset").addEventListener("click", this.resetCells.bind(this));
	}

	drawCharacter(cellId, img)
	{
		let cell = document.getElementById(cellId);
		cell.appendChild(img);
	}

	// A*アルゴリズムでplayerからenemyまでの最短経路を探すメソッド
	searchPath()
	{
		let openList = [];
		let closedList = [];
		openList.push(this.player);
		while (openList.length > 0)
		{
			let node = openList[0];
			//openListに最終地点が追加されていたら終了
			if (node.x == this.enemy.x && node.y == this.enemy.y)
			{
				break;
			}
			//現在のノードをclosedListに移す
			closedList.push(node);
			//現在のノードをopenListから削除する
			openList.shift();
			//現在のノードの隣接ノードを取得する
			let neighbors = this.getNeighbors(node);
			for (let i = 0; i < neighbors.length; i++)
			{
				let neighbor = neighbors[i];
				//隣接ノードが壁ならスキップ
				if (this.board.cells[neighbor.y][neighbor.x].isWall)
				{
					continue;
				}
				//隣接ノードがclosedListにあったらスキップ
				let isClosed = false;
				for (let j = 0; j < closedList.length; j++)
				{
					let closed = closedList[j];
					if (neighbor.x == closed.x && neighbor.y == closed.y)
					{
						isClosed = true;
						break;
					}
				}
				if (isClosed)
				{
					continue;
				}
				//隣接ノードがopenListにあったらスキップ
				let isOpen = false;
				for (let j = 0; j < openList.length; j++)
				{
					let open = openList[j];
					if (neighbor.x == open.x && neighbor.y == open.y)
					{
						isOpen = true;
						break;
					}
				}
				if (isOpen)
				{
					continue;
				}
				//隣接ノードがopenListにもclosedListにもなかったら、openListに追加する
				neighbor.parent = node;
				//ノードが開始地点からどれくらい離れているかを計算する
				neighbor.c = Math.abs(neighbor.x - this.player.x) + Math.abs(neighbor.y - this.player.y);
				//ノードが目的地までどれくらい離れているかを計算する
				neighbor.h = Math.abs(neighbor.x - this.enemy.x) + Math.abs(neighbor.y - this.enemy.y);
				neighbor.s = neighbor.c + neighbor.h;
				openList.push(neighbor);
			}
		}
		if(openList.length == 0)
		{
			document.getElementById("info").textContent = "袋小路ですよ！";
			this.board.disableClick();
			return;
		}
		let pathNode = openList[0];
		// 最終地点のタイルの色を変える
		document.getElementById("cell-" + pathNode.y + "-" + pathNode.x).style.backgroundColor = "yellow";
		let path = [];
		//closedListの中から最終地点の親ノードを辿る
		while(pathNode.parent != undefined)
		{
			for (let i = 0; i < closedList.length; i++)
			{
				let node = closedList[i];
				if (node.x == pathNode.parent.x && node.y == pathNode.parent.y)
				{
					path.push(node);
					pathNode = node;
					break;
				}
			}
		}

		//最短経路のタイルの色を変える
		for (let i = 0; i < path.length; i++)
		{
			let node = path[i];
			let cell = document.getElementById("cell-" + node.y + "-" + node.x);
			cell.style.backgroundColor = "yellow";
		}
		
		document.getElementById("info").textContent = "最短経路探索が完了しました";
		this.board.disableClick();
	}

	// ノードの隣接ノードを取得するメソッド
	getNeighbors(node)
	{
		let neighbors = [];
		if (node.x > 0)
		{
			neighbors.push({ x: node.x - 1, y: node.y });
		}
		if (node.x < this.board.width - 1)
		{
			neighbors.push({ x: node.x + 1, y: node.y });
		}
		if (node.y > 0)
		{
			neighbors.push({ x: node.x, y: node.y - 1 });
		}
		if (node.y < this.board.height - 1)
		{
			neighbors.push({ x: node.x, y: node.y + 1 });
		}
		return neighbors;
	}

	resetCells()
	{
		for (let i = 0; i < this.board.height; i++)
		{
			for (let j = 0; j < this.board.width; j++)
			{
				this.board.cells[i][j].isWall = false;
				let cell = document.getElementById("cell-" + i + "-" + j);
				cell.style.backgroundColor = "green";
				document.getElementById("info").textContent = "";
			}
		}
		this.board.enableClick();
	}
}

let game = new AStar();
game.setup();