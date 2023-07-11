class CartPoleGame
{
	constructor()
	{
		this.cartPoleSystem = new CartPole();
		this.maxStepsPerGame = 100;
		this.numGames = 2;
		this.gameInfo = document.getElementById('game-info');
		this.stepInfo = document.getElementById('step-info');
	}

	getAction = () => {
		let action;
		const randomNum = Math.random();
		if (randomNum < 0.5) {
			action = 1;
		} else {
			action = 0;
		}
		return action;
	}

	async run()
	{
		for (let i = 0; i < this.numGames; i++)
		{
			this.gameInfo.textContent = `Game ${i + 1} / ${this.numGames}`;
			this.cartPoleSystem.setRandomState();
			for (let j = 0; j < this.maxStepsPerGame; j++)
			{
				this.stepInfo.textContent = `Step ${j + 1} / ${this.maxStepsPerGame}`;
				tf.tidy(() => {
					const inputTensor = this.cartPoleSystem.getStateTensor();
				});
				const action = this.getAction();
				const isDone = this.cartPoleSystem.update(action);
				await maybeRenderDuringTraining(this.cartPoleSystem);
			}
		}
	}
}

let cartPoleGame = new CartPoleGame();
cartPoleGame.run();
