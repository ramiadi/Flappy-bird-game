const canvas = document.getElementById("flappy-el");
const ctx = canvas.getContext("2d");

const playerImage = new Image();
playerImage.src = "./flappybird.png";
let x = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(50, 50, 100, 100);

  requestAnimationFrame(animate);
}

animate();
