const padding = 5;
const startX = padding;
const startY = padding;
const gridDim = 9;
let size;
let weightMatrix;

function setup() {  // Setup runs once
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    noSmooth();
    //rectMode(CENTER);
    
    size = (min(windowHeight, windowWidth) - padding * (gridDim+1)) / gridDim;
    
    weightMatrix = new Array(gridDim);
}

function draw() { // Draw runs in a loop

    for (let i = 0; i < gridDim; i++) {
        weightMatrix[i] = 1 - i / gridDim;
    }


    background(102);

    for (let i = 0; i < gridDim; i++) {
        for (let j = 0; j < gridDim; j++) {

        rect(defaultX(i), defaultY(j), size * weightMatrix[i], size * weightMatrix[j]);

        }
    }
}

const defaultX = (x) => startX + x * size + x * padding;
const defaultY = (x) => startY + x * size + x * padding;