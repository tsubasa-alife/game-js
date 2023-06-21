let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let tileSize = 40;
let numRows = canvas.height / tileSize;
let numCols = canvas.width / tileSize;
let circle = { x: tileSize / 2, y: tileSize / 2, radius: tileSize / 2 };
let enemy = { x: canvas.width - tileSize / 2, y: canvas.height - tileSize / 2, radius: tileSize / 2 };
let speed = tileSize;

drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
drawCircle(ctx, "red", circle);
drawCircle(ctx, "blue", enemy);
document.addEventListener("keydown", moveCircle);

function moveCircle(event)
{
	switch (event.key) {
		case "ArrowUp":
			if (circle.y > circle.radius) {
				circle.y -= speed;
			}
			break;
		case "ArrowDown":
			if (circle.y < canvas.height - circle.radius) {
				circle.y += speed;
			}
			break;
		case "ArrowLeft":
			if (circle.x > circle.radius) {
				circle.x -= speed;
			}
			break;
		case "ArrowRight":
			if (circle.x < canvas.width - circle.radius) {
				circle.x += speed;
			}
			break;
	}

	drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
    drawCircle(ctx, "red", circle);
	moveEnemy();
	checkState();
}

function moveEnemy()
{
	if (enemy.x < circle.x)
	{
		enemy.x += speed;
	}
	else if (enemy.x > circle.x)
	{
		enemy.x -= speed;
	}

	if (enemy.y < circle.y)
	{
		enemy.y += speed;
	}
	else if (enemy.y > circle.y)
	{
		enemy.y -= speed;
	}

	drawCircle(ctx, "blue", enemy);
}

function checkState()
{
	if (enemy.x === circle.x && enemy.y === circle.y)
	{
		alert("Game Over!");
		resetGame();
	}
}

function resetGame()
{
	circle.x = tileSize / 2;
	circle.y = tileSize / 2;
	enemy.x = canvas.width - tileSize / 2;
	enemy.y = canvas.height - tileSize / 2;

	drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
	drawCircle(ctx, "red", circle);
	drawCircle(ctx, "blue", enemy);
}

function drawGrid(ctx, color, strokeColor, tileSize, numRows, numCols)
{
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = strokeColor;
	ctx.lineWidth = 1;

	for (let row = 0; row < numRows; row++)
	{
		for (let col = 0; col < numCols; col++)
		{
			ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);
		}
	}
}

function drawCircle(ctx, color, circle)
{
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}