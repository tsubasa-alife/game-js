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
}