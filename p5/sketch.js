let xSize = 800;
let ySize = 680;

function setup() {  // Setup runs once
  createCanvas(xSize, ySize);
  frameRate(60);
}

let speedX = 2;
let speedY = 2;
let posX = 0;
let posY = 0;

let squareSize = 100;

function draw() { // Draw runs in a loop
  let r = speedX > 0 ? 255 : 0;
  let g = speedY > 0 ? 255 : 0;

  let c = color(r, g, 100);
  background(100);
  fill(c);
  rect(posX, posY, squareSize, squareSize);

  posX += speedX;
  posY += speedY;
  if (posX > xSize - squareSize || posX < 0) {
    speedX *= -1;
  }
  if (posY > ySize - squareSize || posY < 0) {
    speedY *= -1;
  }
}
