function init()
{
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");

	ctx.strokeStyle = "red";
	ctx.fillStyle = "blue";
	ctx.lineWidth = 5;
	ctx.lineCap = "round";
	ctx.shadowColor = "black";
	ctx.shadowBlur = 20;
	ctx.beginPath();
	ctx.moveTo(100, 100);
	ctx.lineTo(100, 250);
	ctx.stroke();

	ctx.fillRect(300, 100, 100, 150);
	ctx.strokeRect(500, 100, 100, 150);
}