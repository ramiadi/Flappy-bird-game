let board;
let boardwidth = 550;
let boardheight = 640;
let context;

let gameOver = false;
let score = 0;
let passedPipes = 0; // Counter for passed pipes
let gameStarted = false; // Flag to track if the game has started

class Bird {
  constructor(
    birdX,
    birdY,
    birdWidth,
    birdHeight,
    velocityX,
    velocityY,
    gravity
  ) {
    this.birdX = birdX;
    this.birdY = birdY;
    this.birdWidth = birdWidth;
    this.birdHeight = birdHeight;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.gravity = gravity;
    this.birdImg = new Image(); // Declare birdImg as a property
  }

  draw() {
    context.drawImage(
      this.birdImg,
      this.birdX,
      this.birdY,
      this.birdWidth,
      this.birdHeight
    );
  }

  loadImage(callback) {
    this.birdImg.src = "./flappybird.png"; // Initialize bird image source
    this.birdImg.onload = () => {
      callback(); // Call the callback function when the image is loaded
    };
  }

  gravityEffect() {
    this.velocityY += this.gravity;
    this.birdY += this.velocityY;
  }

  jump(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
      this.velocityY = -6; // Adjusted jump velocity for smoother movement
    }
  }

  resetPosition() {
    this.birdX = 20; // Initial X position of the bird
    this.birdY = 300; // Initial Y position of the bird

    // Reset bird's velocity
    this.velocityY = 0;

    // Reset game state
    score = 0; // Reset score
    passedPipes = 0; // Reset passed pipes counter
    pipes = []; // Clear pipes array
    gameOver = false; // Reset game over state
  }

  resetGame() {
    this.resetPosition(); // Reset bird's position and game state
    pipes = []; // Clear all pipes
    context.clearRect(0, 0, boardwidth, boardheight); // Clear the canvas

    // Redraw the bird
    this.draw();

    // Restart the game loop
    gameOver = false;
    requestAnimationFrame(update);
  }

  checkCollisionGround() {
    if (this.birdY + this.birdHeight >= boardheight) {
      gameOver = true; // End the game if the bird hits the ground
    }
  }

  detectCollision(pipe) {
    return (
      this.birdX < pipe.pipeX + pipe.pipeWidth &&
      this.birdX + this.birdWidth > pipe.pipeX &&
      this.birdY < pipe.pipeY + pipe.pipeHeight &&
      this.birdY + this.birdHeight > pipe.pipeY
    );
  }

  checkCollisionPipes(pipes) {
    for (let pipe of pipes) {
      if (this.detectCollision(pipe)) {
        gameOver = true; // Bird hit a pipe
        this.resetGame(); // Reset the game
        break;
      }
    }
  }
}

class Pipe {
  constructor(pipeX, pipeY, pipeWidth, pipeHeight, img) {
    this.pipeX = pipeX;
    this.pipeY = pipeY;
    this.pipeWidth = pipeWidth;
    this.pipeHeight = pipeHeight;
    this.img = img; // Properly initialize the img property
  }

  draw() {
    context.drawImage(
      this.img,
      this.pipeX,
      this.pipeY,
      this.pipeWidth,
      this.pipeHeight
    );
  }

  update(velocityX) {
    this.pipeX += velocityX; // Move the pipe to the left
  }
}

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  bird.loadImage(() => {
    // Wait for the user to start the game
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText(
      "Press X, Space, or ArrowUp to Start",
      30,
      boardheight / 2
    );
  });

  // Debugging: Ensure the image paths are correct
  topPipeImg = new Image();
  topPipeImg.src = "./assets/toppipe.png"; // Adjusted path
  topPipeImg.onload = () => console.log("Top pipe image loaded successfully.");
  topPipeImg.onerror = () => console.error("Failed to load top pipe image.");

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/bottompipe.png"; // Adjusted path
  bottomPipeImg.onload = () =>
    console.log("Bottom pipe image loaded successfully.");
  bottomPipeImg.onerror = () =>
    console.error("Failed to load bottom pipe image.");

  setInterval(() => {
    if (gameStarted) {
      placePipes(); // Spawn pipes only if the game has started
    }
  }, 1500);

  document.addEventListener("keydown", (e) => {
    if (!gameStarted) {
      // Start the game when one of the keys is pressed
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        gameStarted = true;
        requestAnimationFrame(update); // Start the game loop
      }
    } else if (gameOver) {
      // Restart the game if gameOver is true and one of the keys is pressed
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        bird.resetGame();
      }
    } else {
      bird.jump(e); // Allow jumping during gameplay
    }
  });
};

// classes
let bird = new Bird(20, 300, 40, 30, 0, -0.5, 0.5); // Create bird instance
let pipes = []; // Array to hold pipe instances

function update() {
  if (gameOver) {
    return; // Stop the game loop if game is over
  }
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardwidth, boardheight);

  // Apply gravity and update bird position
  bird.gravityEffect();

  // Check if the bird is colliding with the ground
  bird.checkCollisionGround();

  // Draw the bird
  bird.draw();

  // Check for collision with pipes
  bird.checkCollisionPipes(pipes);

  // Draw and update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].update(-2); // Move the pipe left
    pipes[i].draw(); // Draw the pipe

    // check if the bird has passed the pipe
    if (!pipes[i].passed && bird.birdX > pipes[i].pipeX + pipes[i].pipeWidth) {
      passedPipes++; // Increment the passed pipes counter
      pipes[i].passed = true; // Mark the pipe as passed
      score += 0.5; // Increment score for passing a pipe
    }

    if (bird.detectCollision(pipes[i])) {
      gameOver = true; // Bird hit a pipe
      return; // Stop further updates if the game is over
    }
  }

  // Remove pipes that are off-screen
  while (pipes.length > 0 && pipes[0].pipeX < -pipes[0].pipeWidth) {
    pipes.shift();
  }

  // Draw the score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText("Score: " + score, 10, 50);
}

function placePipes() {
  let randomPipeY = -Math.random() * 350; // Random Y position for the top pipe
  let openingSpace = 150; // Space between top and bottom pipes

  // Debugging: Log pipe placement
  console.log("Placing pipes at Y:", randomPipeY);

  // Create instances of the Pipe class with the correct images
  let topPipe = new Pipe(boardwidth, randomPipeY, 64, 512, topPipeImg);
  let bottomPipe = new Pipe(
    boardwidth,
    randomPipeY + 512 + openingSpace,
    64,
    512,
    bottomPipeImg
  );

  pipes.push(topPipe, bottomPipe); // Add pipes to the array
}
