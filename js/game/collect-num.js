class CollectNum
{

	randomAction(state) {
		let actions = state.legalActions();
		return actions[Math.floor(Math.random() * actions.length)];
	}

	playGame() {
		let state = new MazeState();
		while (!state.isDone()) {
			let action = this.randomAction(state);
			state.advance(action);
			console.log(state.toString());
		}
	}

}

let game = new CollectNum();
game.playGame();