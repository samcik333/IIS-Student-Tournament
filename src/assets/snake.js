// listeners
document.addEventListener("keydown", keyPush);

// canvas
var canvas = document.querySelector("canvas");
var title = document.querySelector("h1");
var ctx = canvas.getContext("2d");

// game
var gameIsRunning = true;

var fps = 10;
var tileSize = 50;
var tileCountX = canvas.width / tileSize;
var tileCountY = canvas.height / tileSize;

var score = 0;

// player

var snakeSpeed = tileSize;
var snakePosX = 0;
var snakePosY = canvas.height / 2;

var velocityX = 1;
var velocityY = 0;

var tail = [];
var snakeLength = 2;

// food
var foodPosX = 0;
var foodPosY = 0;

// loop
function gameLoop() {
  if (gameIsRunning) {
    drawStuff();
    moveStuff();
    setTimeout(gameLoop, 1000 / fps);
  }
}
resetFood();
gameLoop();

/**
 * MOVE EVERYTHING
 */
function moveStuff() {
  snakePosX += snakeSpeed * velocityX;
  snakePosY += snakeSpeed * velocityY;

  // wall collision
  if (snakePosX > canvas.width - tileSize) {
    snakePosX = 0;
  }
  if (snakePosX < 0) {
    snakePosX = canvas.width;
  }
  if (snakePosY > canvas.height - tileSize) {
    snakePosY = 0;
  }
  if (snakePosY < 0) {
    snakePosY = canvas.height;
  }

  // Game over (crash into myself)
  tail.forEach((snakePart) => {
    if (snakePosX === snakePart.x && snakePosY === snakePart.y) {
      gameOver();
    }
  });

  // tail
  tail.push({ x: snakePosX, y: snakePosY });

  // forget earliest parts of snake
  tail = tail.slice(-1 * snakeLength);

  // food collision
  if (snakePosX === foodPosX && snakePosY === foodPosY) {
    title.textContent = ++score;
    snakeLength++;
    resetFood();
  }
}

/**
 * DRAW EVERYTHING
 */
function drawStuff() {
  // background
  rectangle("#ffbf00", 0, 0, canvas.width, canvas.height);

  // grid
  drawGrid();

  // food
  rectangle("#00bfff", foodPosX, foodPosY, tileSize, tileSize);

  // tail
  tail.forEach((snakePart) =>
    rectangle("#555", snakePart.x, snakePart.y, tileSize, tileSize)
  );

  // snake
  rectangle("black", snakePosX, snakePosY, tileSize, tileSize);
}

// draw rectangle
function rectangle(color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// randomize food position
function resetFood() {
  // GAME OVER (nowhere to go)
  if (snakeLength === tileCountX * tileCountY) {
    gameOver();
  }

  foodPosX = Math.floor(Math.random() * tileCountX) * tileSize;
  foodPosY = Math.floor(Math.random() * tileCountY) * tileSize;

  // dont spawn food on snakes head
  if (foodPosX === snakePosX && foodPosY === snakePosY) {
    resetFood();
  }

  if (
    tail.some(
      (snakePart) => snakePart.x === foodPosX && snakePart.y === foodPosY
    )
  ) {
    resetFood();
  }
}

// GAME OVER
// KEYBOARD restarts game
function gameOver() {
  title.innerHTML = `☠️<strong> ${score} </strong>☠️`;
  gameIsRunning = false;
}

/**
 * KEYBOARD
 */
function keyPush(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "ArrowUp":
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "ArrowRight":
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
    case "ArrowDown":
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    default:
      // restart game
      if (!gameIsRunning) location.reload();
      break;
  }
}

// grid
function drawGrid() {
  for (let i = 0; i < tileCountX; i++) {
    for (let j = 0; j < tileCountY; j++) {
      rectangle("#fff", tileSize * i, tileSize * j, tileSize - 1, tileSize - 1);
    }
  }
}
