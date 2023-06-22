let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let black = document.getElementById("black-cat");
let white = document.getElementById("white-cat");

let tileSize = 50;
let numRows = canvas.height / tileSize;
let numCols = canvas.width / tileSize;
let player = { x: tileSize / 2, y: tileSize / 2, radius: tileSize / 2 };
let enemy = { x: canvas.width - tileSize / 2, y: canvas.height - tileSize / 2, radius: tileSize / 2 };
let speed = tileSize;

drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
drawPlayer(ctx, black);
drawEnemy(ctx, white);
document.addEventListener("keydown", movePlayer);

function movePlayer(event)
{
	switch (event.key) {
		case "ArrowUp":
			if (player.y > player.radius) {
				player.y -= speed;
			}
			break;
		case "ArrowDown":
			if (player.y < canvas.height - player.radius) {
				player.y += speed;
			}
			break;
		case "ArrowLeft":
			if (player.x > player.radius) {
				player.x -= speed;
			}
			break;
		case "ArrowRight":
			if (player.x < canvas.width - player.radius) {
				player.x += speed;
			}
			break;
	}

	drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
	drawPlayer(ctx, black);
	moveEnemy();
	checkState();
}

function moveEnemy()
{
	if (enemy.x < player.x)
	{
		enemy.x += speed;
	}
	else if (enemy.x > player.x)
	{
		enemy.x -= speed;
	}

	if (enemy.y < player.y)
	{
		enemy.y += speed;
	}
	else if (enemy.y > player.y)
	{
		enemy.y -= speed;
	}

	drawEnemy(ctx, white);
}

function checkState()
{
	if (enemy.x === player.x && enemy.y === player.y)
	{
		alert("Game Over!");
		resetGame();
	}
}

function resetGame()
{
	player.x = tileSize / 2;
	player.y = tileSize / 2;
	enemy.x = canvas.width - tileSize / 2;
	enemy.y = canvas.height - tileSize / 2;

	drawGrid(ctx, "white", "black", tileSize, numRows, numCols);
	drawPlayer(ctx, black);
	drawEnemy(ctx, white);
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

function drawPlayer(ctx, image)
{
	ctx.drawImage(image, player.x - player.radius, player.y - player.radius, tileSize, tileSize);
}

function drawEnemy(ctx, image)
{
	ctx.drawImage(image, enemy.x - enemy.radius, enemy.y - enemy.radius, tileSize, tileSize);
}