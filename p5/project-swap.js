let data, dataGer
let staticImg, staticImg2;

let curZoom = 3;
let myMap, myMap2;
let font1, font2;
function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
    dataGer = loadTable('germany-massshootings.csv', 'csv', 'header');
    font1 = loadFont('IBMPlexSans-Italic.otf');
    font2 = loadFont('IBMPlexSans-TextItalic.otf');

    const [width, height] = [window.innerWidth, window.innerHeight]

    const options = {
        lat: 40,
        lng: -96,
        zoom: curZoom,
        width: int(width),
        height: int(height),
        style: 'dark-v9',
        //style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    };
    const key = 'pk.eyJ1Ijoic2FyYWFzZGF1Z2JqZXJnIiwiYSI6ImNqbWhua2owMjJleTkzdnE0bDlzZHl6YmcifQ.QD5xpdK9hOwzH427mF5_4Q'
    const mappa = new Mappa('Mapbox', key);
    myMap = mappa.staticMap(options);
    staticImg = loadImage(myMap.imgUrl)

    const options2 = {
        lat: 50,
        lng: 12,
        zoom: curZoom + 1,
        width: int(width),
        height: int(height),
        style: 'dark-v9'
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
    "Date",
    "Assault weapon OR high-capacity magazine",
    "Killed intimate partner or family",
    "Dangerous warning signs"
]
let canvas;
//let sliderYear;
//let label2;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    textFont(font1)
    frameRate(20)

    //label2 = createDiv("Year (2009 - 2022)")
    //label2.style("color", "white")
    //label2.style("z-index", "2000")
    //label2.position(windowWidth / 2 - 65, windowHeight - 100)
    //sliderYear = createSlider(2009, 2022, 0)
    //sliderYear.position(windowWidth / 2 - 100, windowHeight - 60)
    //sliderYear.input(drawStats)

    drawStats()
}

const c1 = [255, 4, 4]
const c2 = [255, 201, 201]
const c3 = c1
const c4 = c2
const c5 = [200, 0, 0]
const c6 = [255, 255, 26]
const c7 = [150, 250, 0]
const c8 = [176, 224, 255]
const cDark = [20, 20, 20]
const cLight = [250, 250, 250]

function drawDistribution(count, pos, radius, size, sqrt) {
    for (let i = 0; i < count; i++) {
        const f = i / count / 2;
        const angle = i * (1 + Math.sqrt(sqrt || 7));
        const dist = f * radius;

        const x = pos.x + cos(angle * TWO_PI) * dist;
        const y = pos.y + sin(angle * TWO_PI) * dist;

        circle(x, y, size);
    }
}

const scaleUp = 6
let usaKilled = 0;
let usaWounded = 0;
let usaPreventable = 0;
let usaWarning = 0;
let gerKilled = 0;
let gerWounded = 0;
const usaHabitants = 331.9;
const gerHabitants = 83.2;
function drawStats() {
    usaKilled = 0, usaWounded = 0, usaPreventable = 0, usaWarning = 0;
    //label2.style("opacity", "0")
    //sliderYear.style("opacity", "0")
    clear()
    image(staticImg, 0, 0)

    if (state === 1) {
        clear()
        image(staticImg2, 0, 0)
    }
    drawHtmlHeading()

    usaKilled = 0;
    usaWounded = 0;

    data.getRows().forEach(e => {
        const pos = myMap.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

        const killed = e.get(headers[1]);
        const wounded = e.get(headers[2]);
        const preventableGun = e.get(headers[7]) === "Yes";
        const warning = e.get(headers[9]) === "Yes";
        if (preventableGun)
            usaPreventable += int(killed) + int(wounded);
        if (warning)
            usaWarning += int(killed) + int(wounded);
        usaKilled += int(killed);
        usaWounded += int(wounded);
        const r_killed = sqrt(killed) / PI * scaleUp * curZoom
        const r_wounded = sqrt(wounded) / PI * scaleUp * curZoom
        if (state === 0) {
            fill(...c2, 20)
            strokeWeight(0.2)
            circle(pos.x, pos.y, r_wounded)
            strokeWeight(0.4)
            fill(...c1, 20)
            strokeWeight(0.2)
            circle(pos.x, pos.y, r_killed)
            strokeWeight(0.4)
            fill(c2)
            if (killed <= wounded)
                drawDistribution(wounded, pos, r_wounded, curZoom, 8)

            fill(c1)
            if (r_wounded == 0)
                drawDistribution(killed, pos, r_killed, curZoom)
            //ellipse(pos.x, pos.y, r_killed, r_killed)
            //preventableGun ? triangle(pos.x, pos.y - r_killed / 2, pos.x + r_killed / 2, pos.y + r_killed / 2, pos.x - r_killed / 2, pos.y + r_killed / 2) : ellipse(pos.x, pos.y, r_killed, r_killed)
            //rect(pos.x, pos.y, r_killed, r_killed)
            else
                drawDistribution(killed, pos, r_killed, curZoom)
            //arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
            //preventableGun ? triangle(pos.x, pos.y - r_killed / 2, pos.x, pos.y + r_killed / 2, pos.x - r_killed / 2, pos.y) : arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
            //rect(pos.x, pos.y, r_killed, r_killed)

            fill(c2)
            //arc(pos.x, pos.y, r_wounded, r_wounded, PI + HALF_PI, TWO_PI + HALF_PI)
            if (wounded < killed) {
                drawDistribution(wounded, pos, r_wounded, curZoom)
            }
        }
    })

    gerKilled = 0;
    gerWounded = 0;
    dataGer.getRows().forEach(e => {
        const pos = myMap2.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

        fill(c3)
        const killed = e.get(headers[1]);
        const wounded = e.get(headers[2]);
        gerKilled += int(killed);
        gerWounded += int(wounded);
        const r_killed = sqrt(killed) / PI * scaleUp * (curZoom + 1)
        const r_wounded = sqrt(wounded) / PI * scaleUp * (curZoom + 1)


        if (state === 1) {
            fill(...c2, 20)
            strokeWeight(0.2)
            circle(pos.x, pos.y, r_wounded)
            strokeWeight(0.4)
            fill(...c1, 20)
            strokeWeight(0.2)
            circle(pos.x, pos.y, r_killed)
            strokeWeight(0.4)
            fill(c2)
            if (killed <= wounded)
                drawDistribution(wounded, pos, r_wounded, curZoom, 8)

            fill(c1)
            if (r_wounded == 0)
                drawDistribution(killed, pos, r_killed, curZoom)
            //ellipse(pos.x, pos.y, r_killed, r_killed)
            //preventableGun ? triangle(pos.x, pos.y - r_killed / 2, pos.x + r_killed / 2, pos.y + r_killed / 2, pos.x - r_killed / 2, pos.y + r_killed / 2) : ellipse(pos.x, pos.y, r_killed, r_killed)
            //rect(pos.x, pos.y, r_killed, r_killed)
            else
                drawDistribution(killed, pos, r_killed, curZoom)
            //arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
            //preventableGun ? triangle(pos.x, pos.y - r_killed / 2, pos.x, pos.y + r_killed / 2, pos.x - r_killed / 2, pos.y) : arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
            //rect(pos.x, pos.y, r_killed, r_killed)

            fill(c2)
            //arc(pos.x, pos.y, r_wounded, r_wounded, PI + HALF_PI, TWO_PI + HALF_PI)
            if (wounded < killed) {
                drawDistribution(wounded, pos, r_wounded, curZoom)
            }
        }
    })

    if (state === 2) {
        clear()
        background(cLight)
        drawHtmlHeading()

        const rSize = windowWidth / 150
        const bCount = 50
        const xOff = windowWidth / 4 - bCount / 2 * rSize * .75
        drawRects(c1, rSize, bCount,
            xOff,
            windowHeight / 4 - rSize * 10,
            usaKilled, false)
        drawRects(c2, rSize, bCount,
            xOff,
            windowHeight / 4 + rSize * 22,
            usaWounded, true)
        drawRects(c3, rSize, bCount,
            xOff,
            windowHeight - windowHeight / 4 + rSize * 3,
            gerKilled, false)
        drawRects(c4, rSize, bCount,
            xOff,
            windowHeight - windowHeight / 4 + rSize * 4,
            gerWounded, true)
        textAlign(LEFT)
        textSize(fontSize1)
        text("TOTAL", xOff, windowHeight / 4 - rSize * 15)
        textAlign(LEFT)

        const usaKilledPerTHabi = round(usaKilled / usaHabitants * 10, 2);
        const usaWoundedPerTHabi = round(usaWounded / usaHabitants * 10, 2);
        const gerKilledPerTHabi = round(gerKilled / gerHabitants * 10, 2);
        const gerWoundedPerTHabi = round(gerWounded / gerHabitants * 10, 2);
        const xOff2 = windowWidth / 4 + bCount / 2 * rSize * 1.75
        drawRects(c1, rSize, bCount,
            xOff2,
            windowHeight / 4 + rSize * 22,
            usaKilledPerTHabi, false)
        drawRects(c2, rSize, bCount,
            xOff2,
            windowHeight / 4 + rSize * 22,
            usaWoundedPerTHabi, true)
        drawRects(c3, rSize, bCount,
            xOff2,
            windowHeight - windowHeight / 4 + rSize * 4,
            gerKilledPerTHabi, false)
        drawRects(c4, rSize, bCount,
            xOff2,
            windowHeight - windowHeight / 4 + rSize * 4,
            gerWoundedPerTHabi, true)
        textAlign(LEFT)
        textSize(fontSize1)
        text("PER 100K HABITANTS", xOff2, windowHeight / 4 - rSize * 15)
    }
    if (state === 5) {
        clear()
        drawHtmlHeading()
    }
    if (state === 3) {
        clear()
        background(cLight)

        let countsPerYear = [
            { year: 2009, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2010, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2011, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2012, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2013, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2014, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2015, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2016, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2017, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2018, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2019, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2020, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2021, killed: 0, wounded: 0, preventable: 0, warning: 0 },
            { year: 2022, killed: 0, wounded: 0, preventable: 0, warning: 0 }
        ]
        const d = data.getRows();
        d.forEach(row => {
            const year = new Date(row.get(headers[6])).getFullYear()
            const killed = row.get(headers[1])
            const wounded = row.get(headers[2])
            const preventable = row.get(headers[7]) === "Yes" ? int(killed) + int(wounded) : 0
            const warning = row.get(headers[9]) === "Yes" ? int(killed) + int(wounded) : 0
            const cur = countsPerYear.find(x => x.year === year);
            cur.killed += int(killed)
            cur.wounded += int(wounded)
            cur.preventable += int(preventable)
            cur.warning += int(warning)
        })

        countsPerYear.forEach((year, i) => {

            const total = year.killed + year.wounded + year.preventable + year.warning
            const w = 30 * i + windowWidth / 4
            const killed = map(year.killed * circleAnimation, 0, total, 0, TWO_PI) / 2
            const wounded = map(year.wounded * circleAnimation, 0, total, 0, TWO_PI) / 2
            const prevented = map(year.preventable * circleAnimation, 0, total, 0, TWO_PI) / 2
            const warning = map(year.warning * circleAnimation, 0, total, 0, TWO_PI) / 2
            const [x, y] = [windowWidth / 2, windowHeight / 2 + windowHeight / 10]
            const gap = 0.01 * TWO_PI

            noFill()
            strokeWeight(5)

            stroke(c1)
            arc(x, y, w, w, warning + prevented + wounded + gap, warning + prevented + wounded + killed)
            stroke(c2)
            let minA = min(warning + prevented + gap, warning + prevented + wounded)
            let maxA = max(warning + prevented + gap, warning + prevented + wounded)
            if (wounded > 0) arc(x, y, w, w, minA, maxA)
            stroke(c8)
            minA = min(warning + gap, warning + prevented)
            maxA = max(warning + gap, warning + prevented)
            if (prevented > 0) arc(x, y, w, w, minA, maxA)
            stroke(c6)
            minA = min(0, warning)
            maxA = max(0, warning)
            if (warning > 0) arc(x, y, w, w, minA, maxA)
            stroke(cDark)

            const w2 = 30 * i + windowWidth / 4
            const total2 = usaKilled + usaWounded
            const killed2 = map(year.killed * circleAnimation, 0, total2, 0, TWO_PI) / 2
            const wounded2 = map(year.wounded * circleAnimation, 0, total2, 0, TWO_PI) / 2
            const prevented2 = map(year.preventable * circleAnimation, 0, total2, 0, TWO_PI) / 2
            const warning2 = map(year.warning * circleAnimation, 0, total2, 0, TWO_PI) / 2
            const [x2, y2] = [windowWidth / 2, windowHeight / 2 - windowHeight / 10]
            const gap2 = 0.01 * TWO_PI

            noFill()
            strokeWeight(5)
            stroke(c1)
            arc(x2, y2, w2, w2, PI, killed2 - PI)
            stroke(c2)
            let minA2 = min(killed2 + gap2, killed2 + wounded2) - PI
            let maxA2 = max(killed2, killed2 + wounded2) - PI
            arc(x2, y2, w2, w2, minA2, maxA2)
            stroke(c8)
            minA2 = min(killed2 + wounded2 + gap2, killed2 + wounded2 + prevented2) - PI
            maxA2 = max(killed2 + wounded2, killed2 + wounded2 + prevented2) - PI
            arc(x2, y2, w2, w2, minA2, maxA2)
            stroke(c6)
            minA2 = min(killed2 + wounded2 + prevented2 + gap2, killed2 + wounded2 + prevented2 + warning2) - PI
            maxA2 = max(killed2 + wounded2 + prevented2, killed2 + wounded2 + prevented2 + warning2) - PI
            arc(x2, y2, w2, w2, minA2, maxA2)
            stroke(cDark)

            const o = 2
            strokeWeight(.1)
            line(x2, y2 + o, windowWidth / 10, y2 + o)
            line(x, y - o, windowWidth / 10, y - o)
        })

        drawHtmlHeading()
    }
    if (state === 4) {
        background(cDark)

        //label2.html("Year: " + sliderYear.value())
        //label2.style("opacity", "1")
        //sliderYear.style("opacity", "1")

        const spacing = windowWidth / (365 * 1.1);
        const dotSize = 2;
        let currentX = windowWidth / 16;
        const currentY = windowHeight / 2;
        //let lastDate = new Date(sliderYear.value(), 0, 1);

        for (let i = 1; i <= 365; i++) {
            fill(cLight)
            circle(currentX + i * spacing, windowHeight / 2, dotSize)
        }
        //stroke(cLight)
        //line(currentX, currentY, currentX + 365 * spacing, currentY)

        data.getRows()/*.filter(row => {
            return new Date(
                row.get(headers[6])
            ).getFullYear() === sliderYear.value()
        })*/.map(x => {
            return {
                killed: x.get(headers[1]),
                wounded: x.get(headers[2]),
                datePerYear: daysIntoYear(new Date(x.get(headers[6])))
            }
        }).forEach(e => {

            const { killed, wounded, datePerYear } = e;
            //const diffDays = Math.ceil(Math.abs(datePerYear - lastDate) / (1000 * 60 * 60 * 24))

            let currentX = spacing * datePerYear + windowWidth / 16;
            //lastDate = datePerYear;

            usaKilled += int(killed);
            usaWounded += int(wounded);

            strokeWeight(0.0)
            for (let i = 1; i <= int(killed); i++) {
                fill(c1)
                circle(currentX, currentY - spacing * i * 1.5, dotSize)
            }
            for (let i = 1; i <= int(wounded); i++) {
                fill(c2)
                circle(currentX, currentY + spacing * i * 1.5, dotSize)
            }

        })

        drawHtmlHeading()
    }
}
function daysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
var done = false;
let circleAnimation = 0.2;
let circleAnimationDone = false;
function draw() {
    if (state === 5) {
        if (!done) {
            background(cLight)
            drawCircles()
            drawHtmlHeading()
        }
    } else {
        circles = [];
        curCircle = 0;
        nextCircles = [];
        done = false;
    }

    if (state === 3) {
        if (!circleAnimationDone) {
            circleAnimation += 0.05;
            drawStats()
            if (circleAnimation >= 1) circleAnimationDone = true;
        } /* else if (circleAnimation > 1) {
            circleAnimation -= 0.05;
            drawStats()
            if (circleAnimation <= 1.01) {
                circleAnimation = 1;
                drawStats()
            }
        } */
    } else {
        circleAnimation = 0.2;
        circleAnimationDone = false;
    }
}
var circles = [];
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
    let target = 1 + constrain(floor(frameCount / 120), 0, 20);
    // How many
    let count = 0;
    // Try N times
    for (let n = 0; n < 1000; n++) {
        if (curCircle >= data.getRows().length) {
            curCircle = 0;
            done = true;
            break;
        }
        if (addCircle(data)) {
            count++;
        }
        // We made enough
        if (count == target) {
            break;
        }
    }

    if (count < 1) done = true;
}

var curCircle = 1;
// Add one circle
function addCircle(dataSet) {
    // Here's a new circle
    const cur_data = dataSet.getRows()[curCircle];
    const preventable = cur_data.get(headers[9]) === "Yes";
    const preventableGun = cur_data.get(headers[7]) === "Yes";
    const c = dataSet === data ? preventable ? c6 : c1 : c3;
    const b = dataSet === data ? preventableGun ? c8 : cDark : cDark;
    const killed = cur_data.get(headers[1]);
    const x = dataSet === data ?
        random(windowWidth / 2) + windowWidth / 4 :
        random(windowWidth / 16) + windowWidth / 2 - windowWidth / 32;
    const y = dataSet === data ?
        random(windowHeight / 2) + windowHeight / 4 :
        random(windowHeight / 16) + windowHeight / 2 - windowHeight / 32;
    var newCircle = new Circle(x, y, 1, killed, usaKilled, c, b, preventableGun ? 2 : .4);
    curCircle++;
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
function Circle(x, y, r, killed, total, color, border, stroke) {
    this.growing = true;
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color || c1;
    this.border = border || cLight;
    this.stroke = stroke;
    this.maxR = sqrt(killed / total * windowWidth * windowHeight / 4 / (PI + 4));
}

Circle.prototype.edges = function () {
    return (this.r > width - this.x || this.r > this.x || this.r > height - this.y || this.r > this.y);
}

// Grow
Circle.prototype.grow = function () {
    if (this.r < this.maxR) {
        this.r += 1;
        this.collides();
    } else {
        nextCircles[0]?.collides();
    }
}

const maxWhile = 100;
var nextCircles = []
Circle.prototype.collides = function () {
    nextCircles.splice(nextCircles.indexOf(this), 1);
    let ret = true;
    let c = 0;
    while (ret && c++ <= maxWhile) {
        circles.forEach(circle => {
            let d = dist(circle.x, circle.y, this.x, this.y);
            if (d < circle.r + this.r) {
                const direction = createVector(circle.x - this.x, circle.y - this.y);
                direction.normalize();
                direction.mult(circle.r + this.r - d + 1);
                circle.x += direction.x;
                circle.y += direction.y;
                nextCircles.push(circle);
            } else ret = false;
        });
    }
}

// Show
Circle.prototype.show = function () {
    fill(this.color);
    strokeWeight(this.stroke || .4);
    stroke(this.border);
    ellipse(this.x, this.y, this.r * 2);
    stroke(cDark)
}


function drawRects(color, rSize, xSize, xOff, yOff, data, inverted) {
    rectMode(CORNER)
    fill(color)
    stroke(cLight)
    for (let i = 1; i < data / xSize; i++) {
        for (let j = 0; j < xSize; j++) {
            circle(j * rSize + xOff, i * rSize + yOff, rSize)
            //rect(j * rSize + xOff, i * rSize + yOff, rSize, rSize)
        }
    }
    const calcY = inverted ? yOff + int(data / xSize + 1) * rSize : yOff
    const leftOver = data % xSize
    for (let i = 0; i < leftOver; i++) {
        const leftOverF = leftOver - floor(leftOver);
        if (i >= leftOver - 1 && leftOverF > 0) {
            circle(i * rSize + xOff, calcY, rSize * leftOverF)
            //rect(i * rSize + xOff,
            //    calcY,
            //    rSize * leftOverF, rSize)
        } else {
            circle(i * rSize + xOff, calcY, rSize)
            //rect(i * rSize + xOff,
            //    calcY,
            //    rSize, rSize)
        }
    }

    fill(0, 0, 0, 150)
    textSize(fontSize2)
    textStyle(BOLD)
    textAlign(RIGHT)
    const yCalc = inverted ? yOff + 4 * rSize : yOff + data / xSize * rSize - rSize / 2
    text(data, xOff - rSize, yCalc)
    rectMode(CENTER)
    fill(cDark)
}

var state = 0;
const stateAmount = 5;
var fontSize1 = window.innerWidth / 35
var fontSize2 = window.innerWidth / 40
function drawHtmlHeading() {
    strokeWeight(0.4)

    if (!document.getElementById("heading")) {
        const heading = createDiv("MASS SHOOTINGS 2009 - 2022")
        heading.id("heading")
        //heading.style("color", "white")
        heading.style("background-color", "rgb(" + cLight + ")")
        heading.style("width", "fit-content")
        heading.style("font-size", int(fontSize1) + "px")
        heading.style("text-align", "left")
        heading.style("padding", "10px 20px")
        heading.style("margin", "20px")
        heading.style("font-family", "IBM Plex Sans")
        heading.style("font-weight", "bold")
        heading.style("border-radius", "4rem")
        heading.style("left", "0")
        heading.style("user-select", "none")
        heading.position(windowWidth / 12, 0)
    }

    const stateDiameter = 20;
    ellipseMode(CENTER)
    rectMode(CENTER)
    const offsetState = 30;
    const statePadding = 10;
    fill(cLight)
    rect(offsetState, windowHeight / 2, stateDiameter * 2, stateAmount * (stateDiameter + statePadding) + statePadding, 20);
    for (let index = 0; index < stateAmount; index++) {
        stroke(index === state ? c1 : cDark)
        if (index === state)
            circle(offsetState, windowHeight / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2, stateDiameter * 1.4)
        stroke(cDark)
        circle(offsetState, windowHeight / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2, stateDiameter)
    }
}

function mousePressed() {
    if (mouseY < windowHeight - 120 || mouseX < windowWidth / 2 - 120 || mouseX > windowWidth / 2 + 100) {
        if (state === stateAmount - 1) {
            state = 0
        } else {
            state++
        }
        drawStats()
    }
}
