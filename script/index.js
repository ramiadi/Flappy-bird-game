// Create a new board
let board;
let boardHeight = 500;
let boardWidth = 500;
let context;

class Flappy {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.width = this.width / this.x;
    this.height = this.height / this.y;
  }
}

window.onload = () => {
  board = document.getElementById("flappy-el");

  context = board.getContext("2d");
};
