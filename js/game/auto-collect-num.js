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
	}

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

	async getScore(isPrint) {
		let tmpState = this.state;
		for (let character of tmpState.characters) {
			tmpState.points[character.y][character.x] = 0;
		}

		while (!tmpState.isDone()) {
			await this.sleep(2000);
			tmpState.advance();
			this.turnElement.textContent = "ターン: " + tmpState.turn;
			this.scoreElement.textContent = "得点: " + tmpState.gameScore;
			if (isPrint) {
				console.log(tmpState.toString());
			}
		}
		this.turnElement.textContent = "ターン: " + "探索終了";
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
			this.scoreElement.textContent = "得点: " + score;
		}
	}

	// 指定したミリ秒だけ処理を止める
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}

let game = new AutoCollectNum();
game.init();