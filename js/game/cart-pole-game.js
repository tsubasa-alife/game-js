class CartPoleGame
{
	constructor()
	{
		this.cartPoleSystem = new CartPole();
		this.model = this.buildModel();
		this.maxStepsPerGame = 500;
		this.numGames = 20;
		this.learnigRate = 0.05;
		this.optimizer = tf.train.adam(this.learnigRate);
		this.discountRate = 0.95;
		this.gameInfo = document.getElementById('game-info');
		this.stepInfo = document.getElementById('step-info');
		this.currentActions_ = [];
		this.allGradients = [];
		this.allRewards = [];
		this.totalRewards = [];
	}

	getAction()
	{
		let action;
		const randomNum = Math.random();
		if (randomNum < 0.5) {
			action = 1;
		} else {
			action = 0;
		}
		return action;
	}

	buildModel()
	{
		const model = tf.sequential();
		model.add(tf.layers.dense({
			inputShape: [4],
			units: 4,
			activation: 'elu'
		}));
		model.add(tf.layers.dense({
			units: 1
		}));
		model.summary();
		return model;
	}

	getLogitsAndActions(inputs)
	{
		return tf.tidy(() => {
			const logits = this.model.predict(inputs);
			const leftProb = tf.sigmoid(logits);
			const rightProb = tf.sub(1, leftProb);
			const leftRightProbs = tf.concat([leftProb, rightProb], 1);
			const actions = tf.multinomial(leftRightProbs, 1, null, true);
			return [logits, actions];
		});
	}

	discountRewards(rewards, discountRate)
	{
		const discountedBuffer = tf.buffer([rewards.length]);
		let prev = 0;
		for (let i = rewards.length - 1; i >= 0; --i) {
			const current = discountRate * prev + rewards[i];
			discountedBuffer.set(current, i);
			prev = current;
		}
		return discountedBuffer.toTensor();
	}

	discountAndNormalizeRewards(rewardSequences, discountRate)
	{
		return tf.tidy(() => {
			const discounted = [];
			// rewardSequencesの個々の要素を反復処理
			for (const sequence of rewardSequences) {
				const discountratedRewardTF = this.discountRewards(sequence, discountRate);
				// discounted配列に、報酬値のtf.Tensorを追加
				discounted.push(discountratedRewardTF)
			}
			// 割引いた報酬値全体の平均と標準偏差を計算する
			const concatenated = tf.concat(discounted);
			// 平均
			const mean = tf.mean(concatenated);
			// 標準偏差
			const std = tf.sqrt(tf.mean(tf.square(concatenated.sub(mean))));
			// 求めた平均と標準偏差を使って、報酬値のシーケンスを正規化する。
			const normalized = discounted.map((rs) => {
				return rs.sub(mean).div(std);
			})
			return normalized;
		});
	}

	scaleAndAverageGradients(allGradients, normalizedRewards)
	{
		return tf.tidy(() => {
			const gradients = {};
			// allGradientsが持つプロパティに対して以下の処理をする。
			for (const varName in allGradients) {
				// gradientsオブジェクトに、allGradientsが持つ重みとバイアスのデータを持たせる
				gradients[varName] = tf.tidy(() => {
					// 勾配を配列にまとめる
					const varGradients = allGradients[varName].map((varGameGradients) => {
							return tf.stack(varGameGradients);
						})
					// 次元を拡張し、ブロードキャストを使った乗算の準備をする。
					const expandedDims = [];
					for (let i = 0; i < varGradients[0].rank - 1; ++i) {
						expandedDims.push(1);
					}
					// rankが3の場合、expandedDimsは[1,1]
					// rankが2の場合、expandedDimsは[1]
					const reshapedNormalizedRewards = normalizedRewards.map((rs) => {
						// rsの要素数と[1, 1]か[1]を連結する
						// rs.shapeはArrayなので、concat()が使える
						// [要素数, 1]か[要素数,1,1]になる
						const concated = rs.shape.concat(expandedDims);
						// rsのshapeをconcatedに変える。
						const reshapedNormalizedRewards = rs.reshape(concated);
						return reshapedNormalizedRewards;
					});
	
					for (let g = 0; g < varGradients.length; ++g) {
						// このmul()の呼び出しはブロードキャストを使う
						varGradients[g] = varGradients[g].mul(reshapedNormalizedRewards[g]);
					}
					// スケーリングした勾配を連結し、全ゲームの全ステップに渡って平均する
					return tf.mean(tf.concat(varGradients, 0), 0);
				});
			}
			return gradients;
		});
	}

	getGradientsAndSaveActions(inputTensor)
	{
		const f = () => tf.tidy(() => {
			const [logits, actions] = this.getLogitsAndActions(inputTensor);
			this.currentActions_ = actions.dataSync();
			const labels = tf.sub(1, tf.tensor2d(this.currentActions_, actions.shape, 'float32'));
			return tf.losses.sigmoidCrossEntropy(labels, logits).asScalar();
		});
		return tf.variableGrads(f);
	}

	pushGradients(record, gradients)
	{
		for (const key in gradients)
		{
			if (key in record)
			{
				record[key].push(gradients[key]);
			}
			else
			{
				record[key] = [gradients[key]];
			}
		}
	}

	async run()
	{
		this.buildModel();
		for (let i = 0; i < this.numGames; i++)
		{
			this.gameInfo.textContent = `Game ${i + 1} / ${this.numGames}`;
			this.cartPoleSystem.setRandomState();
			const gameRewards = [];
			const gameGradients = [];

			for (let j = 0; j < this.maxStepsPerGame; j++)
			{
				this.stepInfo.textContent = `Step ${j + 1} / ${this.maxStepsPerGame}`;
				const gradients = tf.tidy(() => {
					const inputTensor = this.cartPoleSystem.getStateTensor();
					// カートポールの現在のinputTensorから、勾配を得る
					const {
						value, grads
					} = this.getGradientsAndSaveActions(inputTensor);
					return grads;
				});

				this.pushGradients(gameGradients, gradients);
				const action = this.currentActions_[0];
				const isDone = this.cartPoleSystem.update(action);
				await maybeRenderDuringTraining(this.cartPoleSystem);

				if (isDone)
				{
					gameRewards.push(0);
					break;
				}
				else
				{
					gameRewards.push(1);
				}
			}

			// 報酬の総和を計算する
			this.totalRewards.push(gameRewards.reduce((a, b) => a + b, 0));
			
			this.pushGradients(this.allGradients, gameGradients);
			this.allRewards.push(gameRewards);

			tf.tidy(() => {
				const normalizedRewards = this.discountAndNormalizeRewards(this.allRewards, this.discountRate);
				const gradients = this.scaleAndAverageGradients(this.allGradients, normalizedRewards);
				this.optimizer.applyGradients(gradients);
			});

			await tf.nextFrame();
		}
		tf.dispose(this.allGradients);
	}
}

let cartPoleGame = new CartPoleGame();
cartPoleGame.run();
