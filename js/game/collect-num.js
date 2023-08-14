class CollectNum
{
	state;
	searchMethod;
	isGameEnd;
	turnElement;
	scoreElement;

	constructor() {
		this.board = new GameBoard(8,8);
		this.board.disableClick();
		this.imgCharacter = new Image();
		this.imgCharacter.src = "img/cat_black.png";
		this.imgCharacter.className = "obj";
		this.searchMethod = "random";
		this.isGameEnd = false;
		this.turnElement = document.getElementById("turn");
		this.scoreElement = document.getElementById("score");
	}

	// ランダム行動
	randomAction(state) {
		let actions = state.legalActions();
		return actions[Math.floor(Math.random() * actions.length)];
	}

	// 貪欲法
	greedyAction(state) {
		let actions = state.legalActions();
		let bestScore = -999999;
		let bestAction = -1;
		for (let action of actions) {
			let nowState = state.clone();
			nowState.advance(action);
			let score = nowState.evaluate();
			if (score > bestScore) {
				bestScore = score;
				bestAction = action;
			}
		}
		return bestAction;
	}

	// ビームサーチ
	beamSearchAction(state, beamWidth, beamDepth) {
		let nowBeam = [];
		let bestState;
		nowBeam.push(state.clone());
		for (let d = 0; d < beamDepth; d++) {
			let nextBeam = [];
			for (let w = 0; w < beamWidth; w++) {
				if (nowBeam.length == 0) {
					console.log("nowBeamが空になったのでnextBeamを探索開始");
					break;
				}

				console.log("nowBeamのサイズ:" + nowBeam.length);

				let bestIndex = this.getBestIndex(nowBeam);
				console.log("bestIndex:" + bestIndex);
				let nowState = nowBeam[bestIndex];
				nowBeam.splice(bestIndex, 1);

				let actions = nowState.legalActions();
				for (let action of actions) {
					let nextState = nowState.clone();
					nextState.advance(action);
					nextState.evaluate();
					if (d == 0) {
						console.log("d=0なのでfirstActionをセット:" + action);
						nextState.firstAction = action;
					}
					nextBeam.push(nextState);
				}
			}
			nowBeam = nextBeam;
			let bestIndex = this.getBestIndex(nowBeam);
			bestState = nowBeam[bestIndex];

			if (bestState.isDone()) {
				console.log("制限ターンに達したので探索終了");
				break;
			}
		}

		console.log("探索終了");
		console.log(bestState.firstAction);
		return bestState.firstAction;
	}

	init() {
		this.state = new MazeState();
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
		this.drawCharacter(this.state.charaPos.x, this.state.charaPos.y, this.imgCharacter);
		document.getElementById("random").addEventListener("click", this.doRandomSearch.bind(this));
		document.getElementById("greedy").addEventListener("click", this.doGreedySearch.bind(this));
		document.getElementById("beam").addEventListener("click", this.doBeamSearch.bind(this));
		document.getElementById("reset").addEventListener("click", this.reset.bind(this));
	}

	reset() {
		this.deleteCharacter(this.state.charaPos.x, this.state.charaPos.y);
		this.state = new MazeState();
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
		this.drawCharacter(this.state.charaPos.x, this.state.charaPos.y, this.imgCharacter);
		this.isGameEnd = false;
		this.turnElement.textContent = "現在のターン:";
		this.scoreElement.textContent = "得点:";
	}

	doRandomSearch() {
		if (!this.isGameEnd) {
			this.searchMethod = "random";
			console.log("ランダム法による探索を開始します");
			this.playGame();		
		}
	}

	doGreedySearch() {
		if (!this.isGameEnd) {
			this.searchMethod = "greedy";
			console.log("貪欲法による探索を開始します");
			this.playGame();		
		}
	}

	doBeamSearch() {
		if (!this.isGameEnd) {
			this.searchMethod = "beam";
			console.log("ビームサーチによる探索を開始します");
			this.playGame();
		}
	}

	async playGame() {
		while (!this.state.isDone()) {
			let oldPos = {x: this.state.charaPos.x, y: this.state.charaPos.y};
			let action = -1;
			if(this.searchMethod == "random") {
				action = this.randomAction(this.state);
			}
			else if(this.searchMethod == "greedy") {
				action = this.greedyAction(this.state);
			}
			else if(this.searchMethod == "beam") {
				action = this.beamSearchAction(this.state, 2, 7);
			}
			this.state.advance(action);
			await this.sleep(2000);
			console.log(this.state.toString());
			let newPos = {x: this.state.charaPos.x, y: this.state.charaPos.y};
			this.deleteCharacter(oldPos.x, oldPos.y);
			this.drawCharacter(newPos.x, newPos.y, this.imgCharacter);
			this.showTurn(this.state.turn);
			this.showScore(this.state.gameScore);
		}
		console.log("ゲーム終了");
		this.showTurn("ゲーム終了");
		this.isGameEnd = true;
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

	showTurn(turn) {
		this.turnElement.textContent = "現在のターン: " + turn;
	}

	showScore(score) {
		this.scoreElement.textContent = "得点: " + score;
	}

	// 指定したミリ秒だけ処理を止める
	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// 局面をスコア順にソートする
	sortStates(states) {
		states.sort(function(a, b) {
			if (a.gameScore > b.gameScore) {
				return -1;
			}
			else if (a.gameScore < b.gameScore) {
				return 1;
			}
			else {
				return 0;
			}
		});
	}

	// 一番大きなスコアを持つ局面のインデックスを返す
	getBestIndex(states) {
		let bestIndex = 0;
		for (let i = 1; i < states.length; i++) {
			if (states[i].isBetterThan(states[bestIndex])) {
				console.log("bestIndex更新: " + i);
				bestIndex = i;
			}
		}
		return bestIndex;
	}
}

let game = new CollectNum();
game.init();