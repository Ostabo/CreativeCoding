let sliderN;
let sliderC;
let toggleRotate;
let scale = 200;
let width = 400;
let height = 400;

function setup() {  // Setup runs once
  createCanvas(width*2, height*2);
  frameRate(60);
  toggleRotate = createCheckbox('Rotate', true);
  toggleRotate.position(10, 10);
  sliderN = createSlider(2, 10, 3);
  sliderN.position(10, 50);
  sliderC = createSlider(1, 100, 1);
  sliderC.position(10, 90);
}

function draw() { // Draw runs in a loop
    background(102);
    push();
    translate(width, height);

    if (toggleRotate.checked())
        rotate(frameCount * HALF_PI/180);

    colorMode(HSB, 100);
    fill(sliderC.value(), 100, 100);
        
    polygon(0, 0, scale, sliderN.value());
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