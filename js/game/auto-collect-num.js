class AutoCollectNum
{
	state;
	isGameEnd;
	searchMethod = "random";
	methodElement;
	turnElement;
	scoreElement;
	imgCharacters = [];

	constructor() {
		this.board = new GameBoard(8,8);
		this.board.disableClick();
		this.searchMethod = "random";
		this.isGameEnd = false;
		this.methodElement = document.getElementById("method");
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
		document.getElementById("reset").addEventListener("click", this.reset.bind(this));
	}

	reset() {
		for (let imgCharacter of this.imgCharacters) {
			imgCharacter.parentNode.removeChild(imgCharacter);
		}
		this.imgCharacters = [];
		this.state.reset();
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
		this.turnElement.textContent = "現在のターン:";
		this.scoreElement.textContent = "得点:";
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
		}
		return nowState;
	}

	// 山登り法でキャラクターを配置する
	climbHill() {
	}

	// ランダムにキャラクターを配置してゲームを開始する
	doRandomSearch() {
		this.searchMethod = "random";
		this.playGame();
	}

	drawCharacter(x, y, img)
	{
		let cellId = "cell-" + y + "-" + x;
		let cell = document.getElementById(cellId);
		cell.textContent = "";
		cell.appendChild(img);
	}

	deleteCharacter(x, y)
	{
		let cellId = "cell-" + y + "-" + x;
		let cell = document.getElementById(cellId);
		cell.removeChild(cell.firstChild);
	}

	updateCharacters() {
		for (let imgCharacter of this.imgCharacters) {
			imgCharacter.parentNode.removeChild(imgCharacter);
		}
		this.imgCharacters = [];
		for (let character of this.state.characters) {
			let imgCharacter = new Image();
			imgCharacter.src = "img/cat_black.png";
			imgCharacter.className = "obj";
			this.drawCharacter(character.x, character.y, imgCharacter);
			this.imgCharacters.push(imgCharacter);
		}
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
		if (this.searchMethod == "random") {
			console.log("random");
			this.methodElement.textContent = "探索方法: ランダム";
			this.state = this.randomAction();
			console.log(this.state.toString());
			let score = await this.getScore(true);
			console.log("score: " + score);
			this.showScore(score);
		}
	}

	// 指定したミリ秒だけ処理を止める
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

let game = new AutoCollectNum();
game.init();