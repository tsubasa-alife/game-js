class CollectNum
{
	state;
	searchMethod;

	constructor() {
		this.board = new GameBoard(8,8);
		this.searchMethod = "random";
	}

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

	init() {
		this.state = new MazeState();
		this.state.init(3,4);
		document.getElementById("random").addEventListener("click", this.doRandomSearch.bind(this));
		document.getElementById("greedy").addEventListener("click", this.doGreedySearch.bind(this));
	}

	doRandomSearch() {
		this.searchMethod = "random";
		console.log("ランダム法による探索を開始します");
		this.playGame();
	}

	doGreedySearch() {
		this.searchMethod = "greedy";
		console.log("貪欲法による探索を開始します");
		this.playGame();
	}

	playGame() {
		while (!this.state.isDone()) {
			let action = -1;
			if(this.searchMethod == "random") {
				action = this.randomAction(this.state);
			}
			else if(this.searchMethod == "greedy") {
				action = this.greedyAction(this.state);
			}
			this.state.advance(action);
			console.log(this.state.toString());
		}
	}

}

let game = new CollectNum();
game.init();