let data, dataGer
let staticImg, staticImg2;

let curZoom = 3;
let myMap, myMap2;
let font1, font2;
function smallerScreen() {
    return windowWidth < 785 ? windowWidth < 675 ? windowWidth < 560 ? windowWidth < 400 ? -250 : -175 : -140 : -100 : 0;
}
function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
    dataGer = loadTable('germany-massshootings.csv', 'csv', 'header');
    font1 = loadFont('IBMPlexSans-Italic.otf');
    font2 = loadFont('IBMPlexSans-TextItalic.otf');

    //const [width, height] = [976 + smallerScreen() * 2, 925]
    const [width, height] = [windowWidth, windowHeight]

    const options = {
        lat: 40,
        lng: -96,
        zoom: curZoom,
        width: int(width),
        height: int(height),
        username: 'mapbox',
        style: 'dark-v9',
        //style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    };
    const key = 'pk.eyJ1Ijoic2FyYWFzZGF1Z2JqZXJnIiwiYSI6ImNqbWhua2owMjJleTkzdnE0bDlzZHl6YmcifQ.QD5xpdK9hOwzH427mF5_4Q'
    const mappa = new Mappa('Mapbox', key);
    myMap = mappa.staticMap(options);
    //staticImg = loadImage(myMap.imgUrl)
    staticImg = loadImage("map-usa.png")
    const options2 = {
        lat: 50,
        lng: 12,
        zoom: curZoom + 1,
        width: int(width),
        height: int(height),
        style: 'dark-v9'
        //style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
        //style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
    };
    myMap2 = mappa.staticMap(options2);
    //staticImg2 = loadImage(myMap2.imgUrl)
    staticImg2 = loadImage("map-ger.png")
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
    canvas.mouseWheel(changeSize);
    textFont(font1)
    frameRate(20)

    //label2 = createDiv("Year (2009 - 2022)")
    //label2.style("color", "white")
    //label2.style("z-index", "2000")
    //label2.position(windowWidth / 2 - 65, windowHeight - 100)
    //sliderYear = createSlider(2009, 2022, 0)
    //sliderYear.position(windowWidth / 2 - 100, windowHeight - 60)
    //sliderYear.input(drawStats)
    dayLabelL = createDiv('Month/Day')
    dayLabelL.style("color", "white")
    dayLabelL.style("font-size", int(fontSize1) + "px")
    dayLabelL.style("text-align", "left")
    dayLabelL.style("font-family", "IBM Plex Sans")
    dayLabelL.style("font-weight", "bold")
    dayLabelL.style("user-select", "none")
    dayLabelL.style("padding", "10px 20px")
    dayLabelL.style("margin", "calc(20px + 1em) 20px")
    dayLabelL.position(windowWidth / 12, windowHeight - windowHeight / 6)

    dayLabel = createDiv("")
    dayLabel.style("color", "white")
    dayLabel.style("font-size", int(fontSize1) + 2 + "px")
    dayLabel.style("text-align", "left")
    dayLabel.style("font-family", "IBM Plex Sans")
    dayLabel.style("font-weight", "bold")
    dayLabel.style("user-select", "none")
    dayLabel.style("padding", "10px 20px")
    dayLabel.style("margin", "20px")
    dayLabel.position(windowWidth / 12, windowHeight - windowHeight / 6)

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
const cDark = [38, 38, 38]
const cLight = [250, 250, 250]

function drawDistribution(count, pos, radius, size, customBuffer) {
    const centerBuffer = count > 6 ? curZoom * 1.5 : 2;
    for (let i = 0; i < count; i++) {
        const f = i / count / (sqrt(sqrt(customBuffer)) || (2 + centerBuffer * .04));
        const angle = i * 1.618033988749895;
        const dist = f * radius - (customBuffer || centerBuffer);

        const x = pos.x + cos(angle * TWO_PI) * dist;
        const y = pos.y + sin(angle * TWO_PI) * dist;

        circle(x, y, size);
    }
}

const scaleUp = 10
let usaKilled = 0;
let usaWounded = 0;
let usaPreventable = 0;
let usaWarning = 0;
let gerKilled = 0;
let gerWounded = 0;
const usaHabitants = 331.9;
const gerHabitants = 83.2;

const spacing = window.innerWidth / (365 * 1.1);
const dotSize = 2;
let currentX = window.innerWidth / 24;
const startCurrentX = window.innerWidth / 24;
const currentY = window.innerHeight / 2;
function drawStats() {
    usaKilled = 0, usaWounded = 0, usaPreventable = 0, usaWarning = 0;
    dayLabel.style("opacity", "0")
    dayLabelL.style("opacity", "0")
    //label2.style("opacity", "0")
    //sliderYear.style("opacity", "0")
    clear()
    background(cDark)
    imageMode(CENTER)
    //image(staticImg, smallerScreen(), 0)
    image(staticImg, windowWidth < 1280 ? windowWidth / 2 : 640, windowHeight / 2)

    if (state === 1) {
        clear()
        background(cDark)
        //image(staticImg2, smallerScreen(), 0)
        image(staticImg2, windowWidth < 1280 ? windowWidth / 2 : 640, windowHeight / 2)
    }
    drawHtmlHeading()
    drawLegend()

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
            fill(...c1, 20)
            circle(pos.x, pos.y, r_killed)

            strokeWeight(0.4)
            fill(c2)
            stroke(cDark)
            if (r_killed < r_wounded) {
                drawDistribution(wounded, pos, r_wounded, curZoom, r_wounded / 2)
                fill(c1)
                drawDistribution(killed, pos, r_killed, curZoom)
            } else {
                drawDistribution(wounded, pos, r_wounded, curZoom)
                fill(c1)
                drawDistribution(killed, pos, r_killed, curZoom, r_killed / 2)
            }
        }
    })

    gerKilled = 0;
    gerWounded = 0;
    dataGer.getRows().forEach(e => {
        const pos = myMap2.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

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
            fill(...c1, 20)
            circle(pos.x, pos.y, r_killed)
            strokeWeight(0.4)
            fill(c2)
            stroke(cDark)
            if (r_killed < r_wounded) {
                drawDistribution(wounded, pos, r_wounded, curZoom, r_wounded / 2)
                fill(c1)
                drawDistribution(killed, pos, r_killed, curZoom)
            } else {
                drawDistribution(wounded, pos, r_wounded, curZoom)
                fill(c1)
                drawDistribution(killed, pos, r_killed, curZoom, r_killed / 2)
            }
        }
    })

    if (state === 2) {
        clear()
        background(cDark)
        drawHtmlHeading()

        const rSize = min(windowWidth, windowHeight) / 150
        const bCount = 50
        const xOff = min(windowWidth, windowHeight) / 4 - bCount / 2 * rSize * .85
        drawRects(c1, rSize, bCount,
            xOff,
            min(windowWidth, windowHeight) / 4 - (rSize + 1) * 3,
            usaKilled, false)
        drawRects(c2, rSize, bCount,
            xOff,
            min(windowWidth, windowHeight) / 4 + (rSize + 1) * 29,
            usaWounded, true)
        drawRects(c3, rSize, bCount,
            xOff,
            min(windowWidth, windowHeight) - min(windowWidth, windowHeight) / 4 + (rSize + 1) * 3,
            gerKilled, false)
        drawRects(c4, rSize, bCount,
            xOff,
            min(windowWidth, windowHeight) - min(windowWidth, windowHeight) / 4 + (rSize + 1) * 4 + 1,
            gerWounded, true)
        textAlign(LEFT)
        textSize(fontSize1)
        fill(cLight)
        text("TOTAL", xOff, min(windowWidth, windowHeight) / 4 - rSize * 8)
        push()
        rotate(PI / 2)
        text("USA", min(windowWidth, windowHeight) / 4 + rSize * 31.5, - windowWidth + xOff * .75)
        pop()
        textAlign(LEFT)

        const usaKilledPerTHabi = round(usaKilled / usaHabitants * 10, 2);
        const usaWoundedPerTHabi = round(usaWounded / usaHabitants * 10, 2);
        const gerKilledPerTHabi = round(gerKilled / gerHabitants * 10, 2);
        const gerWoundedPerTHabi = round(gerWounded / gerHabitants * 10, 2);
        const xOff2 = min(windowWidth, windowHeight) / 4 + bCount / 2 * rSize * 2
        drawRects(c1, rSize, bCount,
            xOff2,
            min(windowWidth, windowHeight) / 4 + rSize * 35,
            usaKilledPerTHabi, false)
        drawRects(c2, rSize, bCount,
            xOff2,
            min(windowWidth, windowHeight) / 4 + rSize * 35,
            usaWoundedPerTHabi, true)
        drawRects(c3, rSize, bCount,
            xOff2,
            min(windowWidth, windowHeight) - min(windowWidth, windowHeight) / 4 + (rSize + 1) * 4,
            gerKilledPerTHabi, false)
        drawRects(c4, rSize, bCount,
            xOff2,
            min(windowWidth, windowHeight) - min(windowWidth, windowHeight) / 4 + (rSize + 1) * 4,
            gerWoundedPerTHabi, true)
        textAlign(LEFT)
        textSize(fontSize1)
        fill(cLight)
        text("PER 100.000 HABITANTS", xOff2, min(windowWidth, windowHeight) / 4 - rSize * 8)
        push()
        rotate(PI / 2)
        text("GERMANY", min(windowWidth, windowHeight) - min(windowWidth, windowHeight) / 4 - rSize * 10, - windowWidth + xOff * .75)
        pop()
    }
    if (state === 5) {
        clear()
        drawHtmlHeading()
    }
    if (state === 4) {
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
    if (state === 3) {
        background(cDark)
    }
}
function daysIntoYear(date) {
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}
var done = false;
let circleAnimation = 0.2;
let circleAnimationDone = false;
var sc = 1;
var tX = window.innerWidth / 2;
var tY = window.innerHeight / 2;
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

    if (state === 4) {
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

    if (state === 3) {
        background(cDark)
        dayLabel.style("opacity", "1")
        dayLabelL.style("opacity", "1")
        strokeWeight(0)
        push()

        translate(tX, tY)
        scale(sc)
        translate(-tX, -tY)

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const mIndex = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
        for (let i = 1; i <= 365; i++) {
            fill(cLight)
            circle(currentX + i * spacing, windowHeight / 2, dotSize)

            // draw labels for each month
            const d = mIndex.indexOf(i - 1)
            if (d > -1) {
                fill(cLight)
                textAlign(CENTER, CENTER)
                textSize(15)
                const y = ((windowHeight / 1.3 + 30) / sqrt(sc)) > windowHeight / 2 + 60 ? (windowHeight / 1.3 + 30) / sqrt(sc) : windowHeight / 2 + 60
                text(months[d], currentX + i * spacing + 10, y)
                strokeWeight(.4)
                stroke(cLight)
                line(currentX + i * spacing, y - 20, currentX + i * spacing, (windowHeight / 2 + 10))
                line(currentX + i * spacing, y - 20, currentX + i * spacing + 10, y - 10)
                strokeWeight(0)
            }
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

            let currentX = spacing * datePerYear + startCurrentX;
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
        pop()

        drawHtmlHeading()
    } else {
        sc = 1;
        tX = window.innerWidth / 2;
        tY = window.innerHeight / 2;
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
    strokeWeight(0)
    for (let i = 1; i < data / xSize; i++) {
        for (let j = 0; j < xSize; j++) {
            circle(j * (rSize + 1) + xOff, i * (rSize + 1) + yOff, rSize)
            //rect(j * rSize + xOff, i * rSize + yOff, rSize, rSize)
        }
    }
    const calcY = inverted ? yOff + int(data / xSize + 1) * (rSize + 1) : yOff
    const leftOver = data % xSize
    for (let i = 0; i < leftOver; i++) {
        const leftOverF = leftOver - floor(leftOver);
        if (i >= leftOver - 1 && leftOverF > 0) {
            circle(i * (rSize + 1) + xOff, calcY, rSize * leftOverF)
            //rect(i * rSize + xOff,
            //    calcY,
            //    rSize * leftOverF, rSize)
        } else {
            circle(i * (rSize + 1) + xOff, calcY, rSize)
            //rect(i * rSize + xOff,
            //    calcY,
            //    rSize, rSize)
        }
    }

    fill(cLight)
    stroke(cDark)
    textSize(fontSize2)
    textStyle(BOLD)
    textAlign(RIGHT)
    const yCalc = inverted ? yOff + 4 * (rSize - 1) : yOff + data / xSize * (rSize + 1) - (rSize + 1) / 2
    text(data, xOff - rSize, yCalc)
    rectMode(CENTER)
    fill(cDark)
}

var state = 0;
const stateAmount = 4;
var fontSize1 = window.innerWidth > window.innerHeight ? window.innerHeight / 35 : window.innerWidth / 35
var fontSize2 = window.innerWidth > window.innerHeight ? window.innerHeight / 50 : window.innerWidth / 50
function drawHtmlHeading() {

    if (!document.getElementById("heading")) {
        const heading = createDiv("MASS SHOOTINGS 2009 - 2022")
        heading.id("heading")
        heading.style("color", "white")
        heading.style("background-color", "rgb(" + cDark + ")")
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

    push()
    strokeWeight(1)
    stateDiameter = 20;
    ellipseMode(CENTER)
    rectMode(CENTER)
    offsetState = 30;
    statePadding = 10;
    fill(cLight)
    //rect(offsetState, windowHeight / 2, stateDiameter * 2, stateAmount * (stateDiameter + statePadding) + statePadding, 20);
    for (let index = 0; index < stateAmount; index++) {
        stroke(index === state ? c1 : cDark)
        if (index === state)
            circle(windowWidth / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2, windowHeight - offsetState, stateDiameter * 1.4)
        stroke(cDark)
        circle(windowWidth / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2, windowHeight - offsetState, stateDiameter)
    }
    pop()
}
var stateDiameter = 20;
var offsetState = 30;
var statePadding = 10;

function mousePressed() {
    if (mouseY < windowHeight - 120 || mouseX < windowWidth / 2 - 120 || mouseX > windowWidth / 2 + 100) {
        if (state === stateAmount - 1) {
            state = 0
        } else {
            state++
        }
        drawStats()
    } else {
        for (let index = 0; index < stateAmount; index++) {
            if (stateDiameter > dist(windowWidth / 2 - (stateAmount * (stateDiameter + statePadding)) / 2 + index * (stateDiameter + statePadding) + stateDiameter / 2 + statePadding / 2,
                windowHeight - offsetState,
                mouseX, mouseY))
                state = index
        }
        drawStats()
    }
}

var dayLabel, dayLabelL;
function mouseMoved() {
    if (state === 3 && sc === 1) {
        // array of all dates in a year
        const dates = []
        for (let i = 0; i < 12; i++) {
            for (let j = 0; j < 31; j++) {

                if (i === 1 && j > 27) {
                    break
                }
                if (i === 3 && j > 29) {
                    break
                }
                if (i === 5 && j > 29) {
                    break
                }
                if (i === 8 && j > 29) {
                    break
                }
                if (i === 10 && j > 29) {
                    break
                }

                dates.push(`${i + 1}/${j + 1}`)
            }
        }

        // get the date of the mouse
        const mouseDate = dates[
            int(
                map(mouseX,
                    currentX, currentX + 365 * (spacing),
                    0, dates.length)
            )
        ]
        if (mouseDate) {
            dayLabel.html(mouseDate)
            //dayLabel.position(mouseX - 20, windowHeight - 100)
            //dayLabelL.position(mouseX - 20, windowHeight - 100)
        }

    } else if (sc !== 1)
        dayLabel.html("")
}

function changeSize(event) {
    sc += event.wheelDeltaY / 3000
    tX = event.clientX
    tY = event.clientY
}

function drawLegend() {
    let legend;
    if (state === 0 || state === 1) {
        if (!document.getElementById("legend")) {
            legend = createDiv()
            legend.id("legend")
            legend.style("color", "white")
            legend.style("background-color", "rgb(" + cDark + ")")
            legend.style("width", "fit-content")
            legend.style("font-family", "IBM Plex Sans")
            legend.style("font-size", "12px")
            legend.style("line-height", "1.5em")
            legend.style("z-index", "2000")
            legend.style("text-align", "center")
            legend.style("padding", "5px")
            legend.style("border-radius", "5px")
            legend.style("user-select", "none")
        } else {
            legend = select("#legend")
        }
        legend.position(windowWidth * .05, windowHeight - 100)
        legend.html(`
        <div style="display: flex; align-items: center; justify-content: start; gap: 1em">
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c1).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Killed Person</div>
            </div>
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c2).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Wounded Person</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: start; gap: 1em">
            <div style="display: flex; align-items: start">
                <div style="width: 20px; height: 20px; background-color: ${color(...c1, 40).toString()}; border-radius: 50%; margin-right: 5px"></div>
                <div>Killed People</div>
            </div>
            <div style="display: flex; align-items: start">
                <div style="width: 20px; height: 20px; background-color: ${color(...c2, 40).toString()}; border-radius: 50%; margin-right: 5px"></div>
                <div>Wounded People</div>
            </div>
        </div>
        `)
    } else if (state === 2) {
        if (!document.getElementById("legend")) {
            legend = createDiv()
            legend.id("legend")
            legend.style("color", "white")
            legend.style("background-color", "rgb(" + cDark + ")")
            legend.style("width", "fit-content")
            legend.style("font-family", "IBM Plex Sans")
            legend.style("font-size", "12px")
            legend.style("line-height", "1.5em")
            legend.style("z-index", "2000")
            legend.style("text-align", "center")
            legend.style("padding", "5px")
            legend.style("border-radius", "5px")
            legend.style("user-select", "none")
        } else {
            legend = select("#legend")
        }
        legend.position(windowWidth * .1, windowHeight - 100)
        legend.html(`
        <div style="display: flex; align-items: center; justify-content: start; gap: 1em">
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c1).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Killed Person</div>
            </div>
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c2).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Wounded Person</div>
            </div>
        </div>
        `)
    } else if (state === 3) {
        if (!document.getElementById("legend")) {
            legend = createDiv()
            legend.id("legend")
            legend.style("color", "white")
            legend.style("background-color", "rgb(" + cDark + ")")
            legend.style("width", "fit-content")
            legend.style("font-family", "IBM Plex Sans")
            legend.style("font-size", "12px")
            legend.style("line-height", "1.5em")
            legend.style("z-index", "2000")
            legend.style("text-align", "center")
            legend.style("padding", "5px")
            legend.style("border-radius", "5px")
            legend.style("user-select", "none")
        } else {
            legend = select("#legend")
        }
        legend.position(windowWidth * .7, 35/*windowHeight - 100*/)
        legend.html(`
        <div style="display: flex; align-items: center; justify-content: start; gap: 1em">
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c1).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Killed Person</div>
            </div>
            <div style="display: flex; align-items: start">
                <div style="width: 5px; height: 5px; background-color: ${color(...c2).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
                <div>Wounded Person</div>
            </div>
        </div>
        <div style="display: flex; align-items: center; justify-content: start">
            <div style="width: 5px; height: 5px; background-color: ${color(...cLight).toString()}; border-radius: 50%; margin: 5px 13px 0 7px"></div>
            <div>Day in Year</div>
            <div style="width: 5px; height: 1px; background-color: ${color(...cLight).toString()}; margin: 10px 12px 10px 28px"></div>
            <div>Month in Year</div>
        </div>
        <div style="padding: 2px; text-align: right">Hover in default view for date</div>
        <div style="padding: 2px; text-align: right">Scroll to zoom in/out</div>
        `)
    } else {
        if (document.getElementById("legend"))
            select("#legend").remove()
    }
}
