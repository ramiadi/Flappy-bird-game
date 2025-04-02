//

let board;
let boardwidth = 360;
let boardheight = 640;
let context;

// bird

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; // speed of the pipes
let velocityY = 0; // speed of the bird
let gravity = 0.4; // gravity effect on the bird

let gameOver = false;
let score = 0;

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  // Load bird image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    requestAnimationFrame(update); // Start the game loop after the image is loaded
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  setInterval(placePipes, 1500);

  // Add the jump event listener here
  document.addEventListener("keydown", moveBird);
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, boardwidth, boardheight);

  // Bird physics
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0); // Prevent the bird from going off the top of the screen
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true; // Bird hit the ground
  }

  // Draw and update pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX; // Move the pipe to the left
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true; // Bird passed the pipe
    }

    if (detectCollision(bird, pipe)) {
      gameOver = true; // Collision detected
    }
  }

  // Remove pipes that are off the screen
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); // Remove the first pipe from the array
  }

  // Score display
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText("Score: " + score, 10, 50);

  if (gameOver) {
    context.fillText("Game Over", boardwidth / 2 - 100, boardheight / 2);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2); // Randomize the Y position of the pipe
  let openingSpace = boardheight / 4; // Space between pipes

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace, // Space between pipes
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe, bottomPipe);
}

function moveBird(event) {
  if (
    event.code == "Space" ||
    event.code == "ArrowUp" ||
    event.code == "KeyX"
  ) {
    velocityY = -6; // move the bird up

    if (gameOver) {
      bird.y = birdY; // reset the bird position

      score = 0; // reset the score
      pipeArray = []; // reset the pipes
      gameOver = false; // reset the game over state
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
