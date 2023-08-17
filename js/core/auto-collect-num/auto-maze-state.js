class AutoMazeState {
	H;
	W;
	END_TURN = 5;
	CHARACTER_N = 3;
	points = [];
	turn = 0;
	characters = [];
	gameScore = 0;
	dx = [1, -1, 0, 0];
	dy = [0, 0, 1, -1];

	constructor() {

	}

	init(H,W) {
		this.H = H;
		this.W = W;
		// ポイントの初期化
		for (let y = 0; y < this.H; y++) {
			this.points[y] = [];
			for (let x = 0; x < this.W; x++) {
				this.points[y][x] = Math.ceil(Math.random() * 10) % 9 + 1;		
			}
		}
		// キャラクターの初期化
		for (let characterId = 0; characterId < this.CHARACTER_N; characterId++) {
			this.characters[characterId] = {};
		}
	}

	// キャラクターの位置を設定する
	setCharacter(characterId, x, y) {
		this.characters[characterId].x = x;
		this.characters[characterId].y = y;
	}

	// ゲームの終了判定を行う
	isDone() {
		return this.turn >= this.END_TURN;
	}

	// キャラクターを移動する
	moveCharacter(characterId) {
		let character = this.characters[characterId];
		let bestPoint = -999999;
		let bestActionIndex = 0;
		for (let action = 0; action < 4; action++) {
			let nextX = character.x + this.dx[action];
			let nextY = character.y + this.dy[action];
			if (nextY >= 0 && nextY < this.H && nextX >= 0 && nextX < this.W) {
				let point = this.points[nextY][nextX];
				if (point > bestPoint) {
					bestPoint = point;
					bestActionIndex = action;
				}
			}
		}
		character.y += this.dy[bestActionIndex];
		character.x += this.dx[bestActionIndex];
	}

	// 局面を1手進める
	advance() {
		for (let characterId = 0; characterId < this.CHARACTER_N; characterId++) {
			this.moveCharacter(characterId);
		}
		for (let character of this.characters) {
			this.gameScore += this.points[character.y][character.x];
			this.points[character.y][character.x] = 0;
		}
		this.turn++;
	}

	getScore(isPrint) {
		let tmpState = this;
		for (let character of this.characters) {
			tmpState.points[character.y][character.x] = 0;
		}

		while (!tmpState.isDone()) {
			tmpState.advance();
			if (isPrint) {
				console.log(tmpState.toString());
			}
		}
		return tmpState.gameScore;
	}

	// 局面の評価値を取得する
	evaluate() {
		return this.gameScore;
	}

	// 局面を文字列に変換する
	toString() {
		let s = "";
		s += "turn: " + this.turn + "\n";
		s += "score: " + this.gameScore + "\n";
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				if (y == this.characters.y && x == this.characters.x) {
					s += "@";
				}
				else {
					s += this.points[y][x];
				}
			}
			s += "\n";
		}
		return s;
	}

	// 局面を複製する
	clone() {
		let newState = new MazeState();
		newState.H = this.H;
		newState.W = this.W;
		newState.points = [];
		for (let y = 0; y < this.H; y++) {
			newState.points[y] = [];
			for (let x = 0; x < this.W; x++) {
				newState.points[y][x] = this.points[y][x];
			}
		}
		newState.turn = this.turn;
		newState.characters.x = this.characters.x;
		newState.characters.y = this.characters.y;
		newState.gameScore = this.gameScore;
		newState.firstAction = this.firstAction;
		return newState;
	}

	isBetterThan(state) {
		return this.gameScore > state.gameScore;
	}

}