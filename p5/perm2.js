const gridSize = 9;
let cellSize;
let animateCheckbox;

function setup() {  // Setup runs once
    createCanvas(windowWidth, windowHeight);
    frameRate(60);
    background(200);
    cellSize = (min(
        windowHeight, windowWidth
        ) - gridSize) / (gridSize * gridSize);

        
    animateCheckbox= createCheckbox(false);
    animateCheckbox.position(
        (gridSize * gridSize + 1) * cellSize, cellSize);
}

function draw() {
    background(250);
    translate(cellSize, cellSize);
    stroke(0);

    if (animateCheckbox.checked()) {
        drawGrid();
        strokeWeight(.4);
        stroke(50, 50, 200);
        drawGridAnimate();
    } else {
        drawGrid();
    }
}

function points(startX, startY) {
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            point(i * cellSize + startX,
                 j * cellSize + startY);
        }
    }
}

function lines(fixedX, fixedY, startX, startY) {
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            line(fixedX + startX,
                 fixedY + startY,
                 i * cellSize + startX,
                  j * cellSize + startY);
        }
    }
}

function drawGrid() {
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            strokeWeight(2);
            points(i * cellSize * gridSize,
                 j * cellSize * gridSize);
                 
            
            strokeWeight(1);
            lines(i * cellSize, j * cellSize,
                 i * cellSize * gridSize,
                  j * cellSize * gridSize);
        }
    }
}

function drawGridAnimate() {
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {        
            linesRelative(i * cellSize, j * cellSize,
                 i * cellSize * gridSize,
                  j * cellSize * gridSize);
        }
    }
}

function linesRelative(fixedX, fixedY, startX, startY) {    
    for(let i = 0; i < gridSize; i++) {
        for(let j = 0; j < gridSize; j++) {
            line(fixedX - (mouseX / gridSize) + fixedX + startX + cellSize / 2,
                 fixedY - (mouseY / gridSize) + fixedY + startY + cellSize / 2,
                 i * cellSize + startX,
                  j * cellSize + startY);
        }
    }
}