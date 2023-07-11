class CartPole
{
	constructor()
	{
		this.gravity = 9.8;
		this.masscart = 1.0;
		this.masspole = 0.1;
		this.total_mass = this.masspole + this.masscart;
		this.cartWidth = 0.2;
		this.cartHeight = 0.1;
		this.length = 0.5;
		this.poleMoment = this.masspole * this.length;
		this.forceMag = 10.0;
		this.tau = 0.02;

		this.xThreshold = 2.4;
		this.thetaThreshold = 12 * 2 * Math.PI / 360;
	}

	setRandomState()
	{
		// カート位置
		this.x = Math.random() - 0.5;
		// カート速度
		this.xDot = (Math.random() - 0.5) * 1;
		// ポール角度
		this.theta = (Math.random() - 0.5) * 2 * (6 * 2 * Math.PI / 360);
		// ポール角速度
		this.thetaDot = (Math.random() - 0.5) * 0.5;
	}

	getStateTensor()
	{
		return tf.tensor2d([[this.x, this.xDot, this.theta, this.thetaDot]]);
	}

	update(action)
	{
		const force = action > 0 ? this.forceMag : -this.forceMag;
		const cosTheta = Math.cos(this.theta);
		const sinTheta = Math.sin(this.theta);

		const temp = (force + this.poleMoment * this.thetaDot * this.thetaDot * sinTheta) / this.total_mass;
		const thetaAcc = (this.gravity * sinTheta - cosTheta * temp) / (this.length * (4.0 / 3.0 - this.masspole * cosTheta * cosTheta / this.total_mass));
		const xAcc = temp - this.poleMoment * thetaAcc * cosTheta / this.total_mass;

		this.x += this.tau * this.xDot;
		this.xDot += this.tau * xAcc;
		this.theta += this.tau * this.thetaDot;
		this.thetaDot += this.tau * thetaAcc;

		return this.isDone();
	}

	isDone()
	{
		return this.x < -this.xThreshold || this.x > this.xThreshold || this.theta < -this.thetaThreshold || this.theta > this.thetaThreshold;
	}
}