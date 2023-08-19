class AutoCollectNum
{
	state;
	bestScore = 0;
	isGameEnd;
	searchMethod = "random";
	methodElement;
	iterElement;
	turnElement;
	scoreElement;
	imgCharacters = [];
	iter = 5;

	constructor() {
		this.board = new GameBoard(8,8);
		this.board.disableClick();
		this.searchMethod = "random";
		this.isGameEnd = false;
		this.methodElement = document.getElementById("method");
		this.iterElement = document.getElementById("iter");
		this.turnElement = document.getElementById("turn");
		this.scoreElement = document.getElementById("score");
	}

	init() {
		this.state = new AutoMazeState();
		this.state.init(8,8);
		for (let i = 0; i < this.state.H; i++) {
			for (let j = 0; j < this.state.W; j++) {
				let cellId = "cell-" + i + "-" + j;
				let cell = document.getElementById(cellId);
				let point = this.state.points[i][j];
				if (point != 0) {
					cell.textContent = point;
				}
				else {
					cell.textContent = "";
				}
			}
		}
		document.getElementById("random").addEventListener("click", this.doRandomSearch.bind(this));
		document.getElementById("climbhill").addEventListener("click", this.doClimbHillSearch.bind(this));
		document.getElementById("reset").addEventListener("click", this.reset.bind(this));
	}

	reset() {
		this.deleteCharacters();
		this.imgCharacters = [];
		this.state.reset();
		this.resetCellColor();
		for (let i = 0; i < this.state.H; i++) {
			for (let j = 0; j < this.state.W; j++) {
				let cellId = "cell-" + i + "-" + j;
				let cell = document.getElementById(cellId);
				let point = this.state.points[i][j];
				if (point != 0) {
					cell.textContent = point;
				}
				else {
					cell.textContent = "";
				}
			}
		}
		this.iterElement.textContent = "ゲーム回数:";
		this.turnElement.textContent = "現在のターン:";
		this.scoreElement.textContent = "得点:";
	}

	resetCellColor()
	{
		for (let i = 0; i < this.board.height; i++)
		{
			for (let j = 0; j < this.board.width; j++)
			{
				let cell = document.getElementById("cell-" + i + "-" + j);
				cell.style.backgroundColor = "green";
			}
		}
	}

	// ランダムにキャラクターを配置する
	randomAction() {
		let nowState = this.state;
		for (let i = 0; i < this.state.CHARACTER_N; i++) {
			let x = Math.ceil(Math.random() * 10) % this.state.W;
			let y = Math.ceil(Math.random() * 10) % this.state.H;
			nowState.setCharacter(i, x, y);
			let imgCharacter = new Image();
			imgCharacter.src = "img/cat_black.png";
			imgCharacter.className = "obj";
			this.drawCharacter(x, y, imgCharacter);
			this.imgCharacters.push(imgCharacter);
			console.log("キャラID:" + i + " x:" + x + " y:" + y);
		}
		return nowState;
	}

	// 山登り法でキャラクターを配置する
	climbHill() {
		let nextState = this.state.clone();
		nextState.transition();
		for (let i = 0; i < this.state.CHARACTER_N; i++) {
			let x = nextState.characters[i].x;
			let y = nextState.characters[i].y;
			nextState.setCharacter(i, x, y);
			let imgCharacter = new Image();
			imgCharacter.src = "img/cat_black.png";
			imgCharacter.className = "obj";
			this.drawCharacter(x, y, imgCharacter);
			this.imgCharacters.push(imgCharacter);
			console.log("キャラID:" + i + " x:" + x + " y:" + y);
		}
		return nextState;
	}

	// ランダムにキャラクターを配置してゲームを開始する
	doRandomSearch() {
		this.searchMethod = "random";
		this.playGame();
	}

	// 山登り法でキャラクターを配置してゲームを開始する
	doClimbHillSearch() {
		this.searchMethod = "climbHill";
		this.playGame();
	}

	drawCharacter(x, y, img)
	{
		let cellId = "cell-" + y + "-" + x;
		let cell = document.getElementById(cellId);
		cell.textContent = "";
		cell.appendChild(img);
		cell.style.backgroundColor = "yellow";
	}

	deleteCharacter(x, y)
	{
		let cellId = "cell-" + y + "-" + x;
		let cell = document.getElementById(cellId);
		if (cell.firstChild != null) {
			cell.removeChild(cell.firstChild);
		}
	}

	deleteCharacters() {
		for (let character of this.state.characters) {
			this.deleteCharacter(character.x, character.y);
		}
	}

	updateCharacters() {
		this.imgCharacters = [];
		for (let character of this.state.characters) {
			let imgCharacter = new Image();
			imgCharacter.src = "img/cat_black.png";
			imgCharacter.className = "obj";
			this.drawCharacter(character.x, character.y, imgCharacter);
			this.imgCharacters.push(imgCharacter);
		}
	}

	showIter(iter) {
		this.iterElement.textContent = "ゲーム回数: " + iter;
	}

	showTurn(turn) {
		this.turnElement.textContent = "現在のターン: " + turn;
	}

	showScore(score) {
		this.scoreElement.textContent = "得点: " + score;
	}

	// 現在の条件で進めた時のスコアを返す
	async getScore(isPrint) {
		let tmpState = this.state;
		for (let character of tmpState.characters) {
			tmpState.points[character.y][character.x] = 0;
		}

		while (!tmpState.isDone()) {
			await this.sleep(2000);
			this.deleteCharacters();
			tmpState.advance();
			this.updateCharacters();
			this.showTurn(tmpState.turn);
			this.showScore(tmpState.gameScore);
			if (isPrint) {
				console.log(tmpState.toString());
			}
		}
		this.showTurn("ゲーム終了");
		return tmpState.gameScore;
	}

	async playGame() {
		console.log("start");
		for (let i = 0; i < this.iter; i++) {
			await this.sleep(1000);
			this.reset();
			this.showIter(i + 1);
			let score = 0;
			switch (this.searchMethod) {
				case "random":
					console.log("random");
					this.methodElement.textContent = "探索アルゴリズム: ランダム";
					this.state = this.randomAction();
					console.log(this.state.toString());
					score = await this.getScore(true);
					console.log("score: " + score);
					this.showScore(score);
					break;
				case "climbHill":
					console.log("climbHill");
					this.methodElement.textContent = "探索方法: 山登り法";
					this.state = this.climbHill();
					// 開始の状態を保存しておく
					let nowState = this.state.clone();
					console.log(this.state.toString());
					score = await this.getScore(true);
					if (score > this.bestScore) {
						this.bestScore = score;
						console.log("ベストスコア更新: " + this.bestScore);
						this.state = nowState;
					}
					console.log("score: " + score);
					this.showScore(score);
					break;
				default:
					console.log("Invalid search method");
					break;
			}
		}
	}

	// 指定したミリ秒だけ処理を止める
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

let game = new AutoCollectNum();
game.init();