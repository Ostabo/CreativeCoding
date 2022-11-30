let images = [];
let myAsciiArt, gfx, dim, resX, resY;

function preload() {
    images[0] = loadImage('cat.webp');
    images[1] = loadImage('cat_low_res.jpg');
}

function setup() {

    if (windowWidth < windowHeight) {
        createCanvas(windowWidth, windowWidth * 2);
        dim = windowWidth;
        resX = 0;
        resY = dim;
    } else {
        createCanvas(windowHeight * 2, windowHeight);
        dim = windowHeight;
        resX = dim;
        resY = 0;
    }
    
    myAsciiArt = new AsciiArt(this);
    
    background(0);
    
    textAlign(CENTER, CENTER); 
    textFont('monospace', 1.5); 
    textStyle(NORMAL);
    noStroke(); 
    fill(255);
    
    image(images[1], 0, 0, dim, dim);
    
    let ascii_arr = myAsciiArt.convert(this);
    
    myAsciiArt.typeArray2d(ascii_arr, this, resX, resY);
}