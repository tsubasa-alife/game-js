class MazeState {
	H = 3;
	W = 4;
	END_TURN = 4;
	points = [];
	turn = 0;
	charaPos = { x: 0, y: 0 };
	gameScore = 0;
	dx = [1, -1, 0, 0];
	dy = [0, 0, 1, -1];

	constructor() {
		this.charaPos.x = Math.ceil(Math.random() * 10) % this.W;
		this.charaPos.y = Math.ceil(Math.random() * 10) % this.H;
		// ポイントの初期化
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				this.points[y] = [];
				if (y == this.charaPos.y && x == this.charaPos.x) {
					this.points[y][x] = 0;
				}
				else {
					this.points[y][x] = Math.ceil(Math.random() * 10) % 9 + 1;
					console.log(this.points[y][x]);
				}		
			}
		}
	}

	// ゲームの終了判定を行う
	isDone() {
		return this.turn >= this.END_TURN;
	}

	// 局面を1手進める
	advance(action) {
		this.charaPos.x += this.dx[action];
		this.charaPos.y += this.dy[action];
		let point = this.points[this.charaPos.y][this.charaPos.x];
		if (point > 0) {
			this.gameScore += point;
			this.points[this.charaPos.y][this.charaPos.x] = 0;
			console.log(this.points[this.charaPos.y][this.charaPos.x]);
		}
		this.turn++;
	}

	// 合法手を取得する
	legalActions() {
		let actions = [];
		for (let i = 0; i < this.dx.length; i++) {
			let x2 = this.charaPos.x + this.dx[i];
			let y2 = this.charaPos.y + this.dy[i];
			if (x2 >= 0 && x2 < this.W && y2 >= 0 && y2 < this.H) {
				actions.push(i);
			}
		}
		return actions;
	}

	// 局面を文字列に変換する
	toString() {
		let s = "";
		s += "turn: " + this.turn + "\n";
		s += "score: " + this.gameScore + "\n";
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				if (y == this.charaPos.y && x == this.charaPos.x) {
					s += "P";
				}
				else {
					s += this.points[y][x];
				}
			}
			s += "\n";
		}
		return s;
	}

}