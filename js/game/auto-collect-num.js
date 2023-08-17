class AutoCollectNum
{
	state;
	searchMethod = "random";

	constructor() {
		
	}

	init() {
		this.state = new AutoMazeState();
		this.state.init(8,8);
	}

	randomAction() {
		let nowState = this.state;
		for (let i = 0; i < this.state.CHARACTER_N; i++) {
			let x = Math.floor(Math.random() * 10) % this.W;
			let y = Math.floor(Math.random() * 10) % this.H;
			nowState.setCharacter(i, x, y);
		}
		return nowState;
	}

	playGame() {
		console.log("start");
		console.log(this.state.toString());
		if (this.searchMethod == "random") {
			console.log("random");
			this.state = this.randomAction();
			let score = this.state.getScore(true);
			console.log("score: " + score);
		}
	}
}

let game = new AutoCollectNum();
game.init();
//game.playGame();