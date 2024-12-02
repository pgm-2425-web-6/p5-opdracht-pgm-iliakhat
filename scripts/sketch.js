let snake;
let food;
let gridSize = 20;
let cols, rows;
let score = 0;
let gameState = "start"; // "start", "countdown", "playing", "gameover"
let countdown = 3;
let countdownBeep;
let eatSound;
let gameover;

function preload() {
  countdownBeep = loadSound("assets/countdown.mp3");
  eatSound = loadSound("assets/eating.mp3");
  gameover = loadSound("assets/gameover.mp3");
}

function setup() {
  const canvas = createCanvas(800, 400); // Create a canvas
  canvas.parent(document.querySelector(".game")); // Attach canvas to the "game" div
  cols = floor(width / gridSize);
  rows = floor(height / gridSize);
  frameRate(10); // Set the speed of the game
  resetGame(); // Initialize the game state
}

function draw() {
  background(0); // Set the background color to black

  if (gameState === "start") {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Press arrows to start", width / 2, height / 2);
  } else if (gameState === "countdown") {
    fill(255);
    textSize(48);
    textAlign(CENTER, CENTER);
    text(countdown, width / 2, height / 2);
  } else if (gameState === "playing") {
    fill(255); // Set text color to white
    textSize(16);
    text(`Score: ${score}`, 10, 20); // Display the score

    snake.update();
    snake.show();

    if (snake.eat(food)) {
      generateFood();
      eatSound.play();
      score++;
    }

    fill(255, 0, 0); // Red color for food
    rect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  } else if (gameState === "gameover") {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over! Press arrows to restart", width / 2, height / 2);
  }
}

function keyPressed() {
  if (gameState === "start" || gameState === "gameover") {
    if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
      startCountdown();
    }
  } else if (gameState === "playing") {
    if (keyCode === UP_ARROW && snake.yDir === 0) {
      snake.setDirection(0, -1);
    } else if (keyCode === DOWN_ARROW && snake.yDir === 0) {
      snake.setDirection(0, 1);
    } else if (keyCode === LEFT_ARROW && snake.xDir === 0) {
      snake.setDirection(-1, 0);
    } else if (keyCode === RIGHT_ARROW && snake.xDir === 0) {
      snake.setDirection(1, 0);
    }
  }
}

function startCountdown() {
  gameState = "countdown";
  countdown = 3;
  snake.setDirection(1, 0); // Start moving right by default

  let interval = setInterval(() => {
    countdownBeep.play();
    countdown--;
    if (countdown <= 0) {
      clearInterval(interval);
      gameState = "playing";
    }
  }, 1000);
}

function generateFood() {
  food = createVector(floor(random(cols)), floor(random(rows)));
}

function resetGame() {
  snake = new Snake(); // Reinitialize the snake
  generateFood(); // Generate a new food item
  score = 0; // Reset the score
}

class Snake {
  constructor() {
    this.body = [createVector(floor(cols / 2), floor(rows / 2))];
    this.xDir = 0; // Initial x direction
    this.yDir = 0; // Initial y direction
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    head.x += this.xDir;
    head.y += this.yDir;

    if (this.checkCollision(head)) {
      gameState = "gameover";
      gameover.play();
      resetGame(); // Reset the game state

      return;
    }

    this.body.push(head);
    this.body.shift();
  }

  show() {
    fill("#FCCB0A");
    for (let segment of this.body) {
      rect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
  }

  setDirection(x, y) {
    this.xDir = x;
    this.yDir = y;
  }

  eat(pos) {
    let head = this.body[this.body.length - 1];
    if (head.x === pos.x && head.y === pos.y) {
      this.grow();
      return true;
    }
    return false;
  }

  grow() {
    let tail = this.body[0].copy();
    this.body.unshift(tail);
  }

  checkCollision(head) {
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      return true;
    }
    for (let segment of this.body) {
      if (head.x === segment.x && head.y === segment.y) {
        return true;
      }
    }
    return false;
  }
}
