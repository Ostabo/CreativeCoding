let data, dataGer
let imgGer, imgUsa

function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
    dataGer = loadTable('germany-massshootings.csv', 'csv', 'header');
    imgGer = loadImage('./ger.png')
    imgUsa = loadImage('./usa.webp')
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

let myMap;
let canvas;
let curZoom = 4;
const mappa = new Mappa("Leaflet");
const maxBounds = [
    [17.064627, -135.997483], //Southwest
    [71.927675, -71.101668]  //Northeast
];
const options = {
    lat: 30,
    lng: -86,
    zoom: curZoom,
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
};

let sliderYear;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);

    myMap.overlay(canvas);

    setTimeout(drawStats, 200);
}

const c1 = [255, 0, 0]
const c2 = [255, 200, 200]
const c3 = [0, 255, 0]
const c4 = [200, 255, 200]
const c5 = [200, 0, 0]
const c6 = [200, 200, 0]

let first = true
const scaleUp = 10
let labelCache = []
function drawStats() {
    myMap.map.zoomControl.remove()

    if (labelCache.length > 0)
        labelCache.forEach(l => l.remove())

    myMap.map.setMinZoom(4)
    myMap.map.setMaxZoom(4)
    curZoom = myMap.zoom()
    clear()
    background(255)
    image(imgUsa, 55, 160, 680, 380)
    image(imgGer, 300, 575, 150, 200)

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

        const nar = e.get(headers[5])
        if (curZoom > 5) {
            let narLabel = createDiv(nar)
            narLabel.class("label")
            narLabel.style("color", "white")
            narLabel.style("background-color", "black")
            narLabel.style("width", 40 * curZoom + "px")
            narLabel.style("font-size", curZoom * 2 + "px")
            narLabel.style("z-index", "2000")
            narLabel.style("text-align", "center")
            narLabel.style("padding", "5px")
            narLabel.style("border-radius", "5px")
            narLabel.style("transform", "translate(-50%, -50%)")
            narLabel.style("user-select", "none")
            narLabel.style("opacity", "0")
            narLabel.position(pos.x, pos.y)

            labelCache.push(narLabel)
        }
    })

    let gerKilled = 0;
    let gerWounded = 0;
    const [yOffset, lngOffset] = [550.0, -107.5]
    dataGer.getRows().forEach(e => {
        const pos = myMap.latLngToPixel(
            float(e.get(headers[3])),
            float(e.get(headers[4])) + lngOffset
        );

        pos.y = pos.y + yOffset

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

        const nar = e.get(headers[5])
        if (curZoom > 5) {
            let narLabel = createDiv(nar)
            narLabel.class("label")
            narLabel.style("color", "white")
            narLabel.style("background-color", "black")
            narLabel.style("width", 40 * curZoom + "px")
            narLabel.style("font-size", curZoom * 2 + "px")
            narLabel.style("z-index", "2000")
            narLabel.style("text-align", "center")
            narLabel.style("padding", "5px")
            narLabel.style("border-radius", "5px")
            narLabel.style("transform", "translate(-50%, -50%)")
            narLabel.style("user-select", "none")
            narLabel.style("opacity", "0")
            narLabel.position(pos.x, pos.y)

            labelCache.push(narLabel)
        }
    })

    const rSize = 5
    const xOff = windowWidth - 275
    drawRects(c1, rSize, 50,
        xOff,
        windowHeight / 2 - 250,
        usaKilled, false)
    drawRects(c2, rSize, 50,
        xOff,
        windowHeight / 2 - 85,
        usaWounded, true)

    drawRects(c3, rSize, 50,
        xOff,
        windowHeight / 2 + 200,
        gerKilled, false)
    drawRects(c4, rSize, 50,
        xOff,
        windowHeight / 2 + 210,
        gerWounded, true)
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
    const yCalc = inverted ? yOff + 9 * rSize : yOff + data / xSize * rSize
    text(data, xOff, yCalc)
}