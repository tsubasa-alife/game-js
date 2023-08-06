class MazeState {
	H = 3;
	W = 4;
	END_TRUN = 4;
	points = [];
	turn = 0;
	charaPos = { x: 0, y: 0 };
	gameScore = 0;

	constructor() {
		this.charaPos.x = Math.ceil(Math.random() * 10) % this.W;
		this.charaPos.y = Math.ceil(Math.random() * 10) % this.H;
		for (let y = 0; y < this.H; y++) {
			for (let x = 0; x < this.W; x++) {
				
			}
		}
	}

}