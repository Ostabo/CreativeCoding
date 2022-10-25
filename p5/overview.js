const width = 800;
const height = width;
const padding = 50;
const amount = 10;
const size = (width - amount*padding) / amount;

function setup() {  // Setup runs once
  createCanvas(width + padding/2, height + padding/2);
  frameRate(0);

  translate(padding/1.2, -padding/1.2);

  for (let i = 0; i < amount; i++) {
    for (let j = 2; j < amount + 2; j++) {
      drawOverview(i * size + i * padding,
         (j - 1) * size + (j - 1) * padding,
          i * amount, j);
    }
  }
}

function drawOverview(x, y, color, npoints) {
    push();
    translate(x, y);
    colorMode(HSB, 100);
    fill(color, 100, 100);
    polygon(0, 0, size, npoints);
    pop();
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
    vertex(sx, sy);
    }
    endShape(CLOSE);
}