let board;
let boardwidth = 480;
let boardheight = 640;
let context;

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
    this.birdImg.onload = callback; // Call the callback once the image is loaded
  }

  gravityEffect() {
    this.velocityY += this.gravity;
    this.birdY += this.velocityY;
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
    requestAnimationFrame(update); // Start the game loop after the image is loaded
  });

  topPipeImg = new Image();
  topPipeImg.src = "/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "/bottompipe.png";

  setInterval(placePipes, 1500);
};

// classes
let bird = new Bird(20, 300, 40, 30, 0, -6, 2); // Create bird instance
let pipes = []; // Array to hold pipe instances

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, boardwidth, boardheight);

  // Apply gravity and update bird position
  bird.gravityEffect();

  // Draw the bird
  bird.draw();

  // Draw and update pipes
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].update(-2); // Move the pipe left
    pipes[i].draw(); // Draw the pipe
  }

  // Remove pipes that are off-screen
  while (pipes.length > 0 && pipes[0].pipeX < -pipes[0].pipeWidth) {
    pipes.shift();
  }
}

function placePipes() {
  let randomPipeY = -Math.random() * 200; // Random Y position for the top pipe
  let openingSpace = 150; // Space between top and bottom pipes

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
