class AutoMazeState {
	H;
	W;
	END_TURN = 5;
	CHARACTER_N = 3;
	points = [];
	pointsChache = [];
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
			this.pointsChache[y] = [];
			for (let x = 0; x < this.W; x++) {
				this.points[y][x] = Math.ceil(Math.random() * 10) % 9 + 1;
				this.pointsChache[y][x] = this.points[y][x];	
			}
		}
		// キャラクターの初期化
		for (let characterId = 0; characterId < this.CHARACTER_N; characterId++) {
			this.characters[characterId] = {x: 0, y: 0};
		}
	}

	// ゲームの終了判定を行う
	isDone() {
		return this.turn >= this.END_TURN;
	}

	// キャラクターの位置を設定する
	setCharacter(characterId, x, y) {
		this.characters[characterId].x = x;
		this.characters[characterId].y = y;
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

	// 局面の評価値を取得する
	evaluate() {
		return this.gameScore;
	}

	// 局面をリセットする
	reset() {
		this.turn = 0;
		this.gameScore = 0;
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				this.points[y][x] = this.pointsChache[y][x];
			}
		}
		for (let characterId = 0; characterId < this.CHARACTER_N; characterId++) {
			this.characters[characterId].x = 0;
			this.characters[characterId].y = 0;
		}
	}

	// 局面を文字列に変換する
	toString() {
		let s = "";
		s += "turn: " + this.turn + "\n";
		s += "score: " + this.gameScore + "\n";
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				let isCharacter = false;
				for (let character of this.characters) {
					if (character.x == x && character.y == y) {
						if (isCharacter) {
							continue;
						}
						else {
							s += "@";
							isCharacter = true;
							continue;
						}
						
					}
				}
				if (isCharacter) {
					continue;
				}
				s += this.points[y][x];
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
		newState.characters = this.characters;
		newState.gameScore = this.gameScore;
		return newState;
	}

	isBetterThan(state) {
		return this.gameScore > state.gameScore;
	}

}