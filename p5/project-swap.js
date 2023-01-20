let data, dataGer
let staticImg, staticImg2;

let curZoom = 3;
let myMap, myMap2;
function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
    dataGer = loadTable('germany-massshootings.csv', 'csv', 'header');

    const [width, height] = [window.innerWidth, window.innerHeight / 2]

    const options = {
        lat: 40,
        lng: -96,
        zoom: curZoom,
        width: int(width),
        height: int(height),
        style: 'light-v9'
        // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    };
    const key = 'pk.eyJ1Ijoic2FyYWFzZGF1Z2JqZXJnIiwiYSI6ImNqbWhua2owMjJleTkzdnE0bDlzZHl6YmcifQ.QD5xpdK9hOwzH427mF5_4Q'
    const mappa = new Mappa('Mapbox', key);
    myMap = mappa.staticMap(options);
    staticImg = loadImage(myMap.imgUrl)

    const options2 = {
        lat: 50,
        lng: 10,
        zoom: curZoom,
        width: int(width),
        height: int(height),
        style: 'light-v9'
        // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    };
    myMap2 = mappa.staticMap(options2);
    staticImg2 = loadImage(myMap2.imgUrl)
}
const headers = [
    "Address",
    "Number killed",
    "Number wounded",
    "Latitude",
    "Longitude",
    "Narrative",
    "Date"
]
let canvas;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    drawStats()
}

const c1 = [255, 0, 0]
const c2 = [255, 200, 200]
const c3 = [0, 255, 0]
const c4 = [200, 255, 200]
const c5 = [200, 0, 0]
const c6 = [200, 200, 0]
const cDark = [20, 20, 20]
const cLight = [250, 250, 250]

const scaleUp = 10
function drawStats() {
    clear()
    image(staticImg, 0, 0)
    image(staticImg2, 0, windowHeight / 2)
    drawHtmlHeading()

    let usaKilled = 0;
    let usaWounded = 0;

    data.getRows().forEach(e => {
        const pos = myMap.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

        fill(c1)
        const killed = e.get(headers[1]);
        const wounded = e.get(headers[2]);
        usaKilled += int(killed);
        usaWounded += int(wounded);
        const r_killed = sqrt(killed) / PI * scaleUp * curZoom
        const r_wounded = sqrt(wounded) / PI * scaleUp * curZoom
        if (r_wounded == 0)
            ellipse(pos.x, pos.y, r_killed, r_killed)
        //rect(pos.x, pos.y, r_killed, r_killed)
        else
            arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
        //rect(pos.x, pos.y, r_killed, r_killed)

        fill(c2)
        arc(pos.x, pos.y, r_wounded, r_wounded, PI + HALF_PI, TWO_PI + HALF_PI)
        //rect(pos.x, pos.y, r_wounded, r_wounded)
    })

    let gerKilled = 0;
    let gerWounded = 0;
    dataGer.getRows().forEach(e => {
        const pos = myMap2.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

        pos.y = pos.y + windowHeight / 2

        fill(c3)
        const killed = e.get(headers[1]);
        const wounded = e.get(headers[2]);
        gerKilled += int(killed);
        gerWounded += int(wounded);
        const r_killed = sqrt(killed) / PI * scaleUp * curZoom
        const r_wounded = sqrt(wounded) / PI * scaleUp * curZoom

        if (r_wounded == 0)
            ellipse(pos.x, pos.y, r_killed, r_killed)
        //rect(pos.x, pos.y, r_killed, r_killed)
        else
            arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
        //rect(pos.x, pos.y, r_killed, r_killed)

        fill(c4)
        arc(pos.x, pos.y, r_wounded, r_wounded, PI + HALF_PI, TWO_PI + HALF_PI)
        //rect(pos.x, pos.y, r_wounded, r_wounded)
    })

    if (state === 1) {
        clear()
        drawHtmlHeading()

        const rSize = 8
        const bCount = 50
        const xOff = windowWidth / 2 - bCount / 2 * rSize
        drawRects(c1, rSize, bCount,
            xOff,
            windowHeight / 4 - rSize * 10,
            usaKilled, false)
        drawRects(c2, rSize, bCount,
            xOff,
            windowHeight / 4 + rSize * 23,
            usaWounded, true)
        drawRects(c3, rSize, bCount,
            xOff,
            windowHeight - windowHeight / 4 + rSize,
            gerKilled, false)
        drawRects(c4, rSize, bCount,
            xOff,
            windowHeight - windowHeight / 4 + rSize * 3,
            gerWounded, true)
    }
    if (state === 2) {
        clear()
        drawHtmlHeading()

        circleView = true;
    }
}
function draw() {
    if (state === 2) {
        clear()
        drawCircles()
        drawHtmlHeading()
    } else {
        circles = [];
        curCircle = 0;
    }
}
var circles = [];
var circleView = false;
function drawCircles() {

    // All the circles
    for (var i = 0; i < circles.length; i++) {
        var c = circles[i];
        c.show();

        // Is it a growing one?
        if (c.growing) {
            c.grow();

            // Is it stuck to an edge?
            if (c.growing) {
                c.growing = !c.edges();
            }
        }
    }

    // Let's try to make a certain number of new circles each frame
    // More later
    var target = 1 + constrain(floor(frameCount / 120), 0, 20);
    // How many
    var count = 0;
    // Try N times
    for (var n = 0; n < 1000; n++) {
        if (curCircle >= data.getRows().length) {
            break;
        }
        if (addCircle()) {
            count++;
        }
        // We made enough
        if (count == target) {
            break;
        }
    }

    // We can't make any more
    if (count < 1) {
        noLoop();
        console.log("finished");
    }
}

var curCircle = 1;
// Add one circle
function addCircle() {
    // Here's a new circle
    var newCircle = new Circle(random(windowWidth / 2) + windowWidth / 4, random(windowHeight / 2) + windowHeight / 4, 1, data.getRows()[curCircle++].get(headers[1]));
    // Is it in an ok spot?
    for (var i = 0; i < circles.length; i++) {
        var other = circles[i];
        var d = dist(newCircle.x, newCircle.y, other.x, other.y);
        if (d < other.r + 4) {
            newCircle = undefined;
            break;
        }
    }
    // check if newCircle is inside the center circle
    if (newCircle) {
        var d = dist(newCircle.x, newCircle.y, windowWidth / 2, windowHeight / 2);
        if (!(d < min(windowWidth, windowHeight) / 4)) {
            newCircle = undefined;
        }
    }

    // If it is, add it
    if (newCircle) {
        circles.push(newCircle);
        return true;
    } else {
        curCircle--;
        return false;
    }
}

// Circle object
function Circle(x, y, r, maxR) {
    this.growing = true;
    this.x = x;
    this.y = y;
    this.r = sqrt(r) / PI * scaleUp
    this.maxR = maxR;
}

Circle.prototype.edges = function () {
    return (this.r > width - this.x || this.r > this.x || this.r > height - this.y || this.r > this.y);
}

// Grow
Circle.prototype.grow = function () {
    if (this.r < this.maxR)
        this.r += 0.5;
}

// Show
Circle.prototype.show = function () {
    fill(c2);
    strokeWeight(1);
    stroke(c1);
    ellipse(this.x, this.y, this.r * 2);
    stroke(cDark)
}


function drawRects(color, rSize, xSize, xOff, yOff, data, inverted) {
    fill(color)
    for (let i = 0; i < data / xSize; i++) {
        for (let j = 0; j < xSize; j++) {
            rect(j * rSize + xOff, i * rSize + yOff, rSize, rSize)
        }
    }
    const calcY = inverted ? yOff + int(data / xSize + 1) * rSize : yOff - rSize
    const leftOver = data % xSize
    for (let i = 0; i < leftOver; i++) {
        rect(i * rSize + xOff,
            calcY,
            rSize, rSize)
    }

    fill(0)
    textSize(10 * rSize)
    textStyle(BOLD)
    textFont("Helvetica")
    const yCalc = inverted ? yOff + 9 * rSize : yOff + data / xSize * rSize - rSize
    text(data, xOff, yCalc)
}

var state = 2;
const stateAmount = 3;
function drawHtmlHeading() {
    strokeWeight(0.4)

    const heading = createDiv("Mass Shootings 2009 - 2022")
    heading.style("color", "white")
    heading.style("background-color", "#cccccc")
    heading.style("width", "100%")
    heading.style("font-size", "50px")
    heading.style("text-align", "center")
    heading.style("padding", "5px")
    heading.style("border-radius", "5px")
    heading.style("transform", "translate(-50%, 00%)")
    heading.style("user-select", "none")
    heading.position(windowWidth / 2, 0)

    const stateDiameter = 20;
    ellipseMode(CENTER)
    rectMode(CENTER)
    const offsetState = 30;
    const statePadding = 10;
    fill(cLight)
    rect(offsetState, windowHeight / 2, stateDiameter * 2, stateAmount * (stateDiameter + statePadding) + statePadding, 20);
    for (let index = 0; index < stateAmount; index++) {
        stroke(index === state ? c1 : cDark)
        circle(offsetState, windowHeight / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2, stateDiameter)
        stroke(cDark)
    }
}

function mousePressed() {
    if (state === stateAmount - 1) {
        state = 0
    } else {
        state++
    }
    drawStats()
}
