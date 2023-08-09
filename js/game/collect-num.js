class CollectNum
{

	randomAction(state) {
		let actions = state.legalActions();
		return actions[Math.floor(Math.random() * actions.length)];
	}

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

	playGame() {
		let state = new MazeState();
		state.init(3,4);
		while (!state.isDone()) {
			//let action = this.randomAction(state);
			let action = this.greedyAction(state);
			state.advance(action);
			console.log(state.toString());
		}
	}

}

let game = new CollectNum();
game.playGame();