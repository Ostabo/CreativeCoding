let data

function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
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

const c1 = [255, 0, 0]
const c2 = [255, 200, 200]
const c3 = [0, 255, 0]
const c4 = [200, 255, 200]
const c5 = [200, 0, 0]
const c6 = [240, 240, 0]
const c7 = [0, 200, 200]
const c8 = [0, 0, 200]
const cDark = [20, 20, 20]
const cLight = [250, 250, 250]

let myMap;
let canvas;
let curZoom = 4;
const mappa = new Mappa("Leaflet");
const maxBounds = [
    [17.064627, -135.997483], //Southwest
    [71.927675, -71.101668]  //Northeast
];
const options = {
    lat: 39,
    lng: -96,
    zoom: curZoom,
    //style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    //style: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
    //style: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}{r}.png"
    style: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
};

let sliderYear;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    let label2 = createDiv("Year (2009 - 2022)")
    label2.style("color", "white")
    label2.style("background-color", "black")
    label2.style("z-index", "2000")
    label2.position(windowWidth / 2 - 80, windowHeight - 80)
    sliderYear = createSlider(2009, 2022, 0)
    sliderYear.position(windowWidth / 2 - 100, windowHeight - 60)
    sliderYear.style("z-index", "2000")
    sliderYear.input(drawStats)

    myMap = mappa.tileMap(options);

    myMap.overlay(canvas);
    myMap.onChange(drawStats)
    strokeWeight(0.4)
}

function draw() {
}
let first = true
const scaleUp = 10
let labelCache = []
let usaKilled = 0
let usaWounded = 0
function drawStats() {
    if (labelCache.length > 0)
        labelCache.forEach(l => l.remove())

    let labelCur = createDiv(sliderYear.value())
    labelCur.style("color", "white")
    labelCur.style("background-color", "black")
    labelCur.style("z-index", "2000")
    labelCur.position(windowWidth / 2 - 35, windowHeight - 40)
    labelCache.push(labelCur)

    //myMap.map.setMaxBounds(maxBounds)
    //myMap.map.fitBounds(maxBounds)
    myMap.map.setMinZoom(3)
    myMap.map.setMaxZoom(10)
    curZoom = myMap.zoom()
    clear()
    data.getRows().filter(row => {
        return new Date(
            row.get(headers[6])
        ).getFullYear() === sliderYear.value()
    }).forEach(e => {

        const pos = myMap.latLngToPixel(e.get(headers[3]), e.get(headers[4]));

        const killed = e.get(headers[1]);
        const wounded = e.get(headers[2]);
        //const preventableGun = e.get(headers[7]) === "Yes";
        //const warning = e.get(headers[9]) === "Yes";
        usaKilled += int(killed);
        usaWounded += int(wounded);
        const r_killed = sqrt(killed) / PI * scaleUp * curZoom
        const r_wounded = sqrt(wounded) / PI * scaleUp * curZoom

        //fill(...c2, 20)
        //strokeWeight(0.2)
        //circle(pos.x, pos.y, r_wounded)
        //strokeWeight(0.4)
        //fill(...c1, 20)
        //strokeWeight(0.2)
        //circle(pos.x, pos.y, r_killed)
        //strokeWeight(0.4)
        //fill(c2)
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
}

function drawDistribution(count, pos, radius, size, sqrt) {
    const centerBuffer = count > 6 ? curZoom * 1.5 : 2;
    for (let i = 0; i < count; i++) {
        const f = i / count / 2;
        const angle = i * Math.sqrt(sqrt || 7);
        const dist = f * radius + centerBuffer;

        const x = pos.x + cos(angle * TWO_PI) * dist;
        const y = pos.y + sin(angle * TWO_PI) * dist;

        circle(x, y, size);
    }
}