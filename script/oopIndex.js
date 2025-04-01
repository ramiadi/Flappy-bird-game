let board;
let boardwidth = 480;
let boardheight = 640;
let context;

class Bird {
  constructor(birdX, birdY, birdWidth, birdHeight) {
    this.birdX = birdX;
    this.birdY = birdY;
    this.birdWidth = birdWidth;
    this.birdHeight = birdHeight;
  }
}

let bird = new Bird(20, 300, 40, 30); // Create bird instance

window.onload = function () {
  board = document.getElementById("board");
  board.width = boardwidth;
  board.height = boardheight;
  context = board.getContext("2d");

  // draw the bird
  context.fillStyle = "green";
  context.fillRect(Bird.birdX, Bird.birdY, Bird.birdWidth, Bird.birdHeight);

  // load image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function () {
    context.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);
  };
};
