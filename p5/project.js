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

    sliderYear = createSlider(2009, 2022, 0)
    sliderYear.position(windowWidth * .1, windowHeight - 60)
    sliderYear.style("z-index", "2000")
    sliderYear.style("width", "80%")
    sliderYear.class("slider")
    sliderYear.input(drawStats)

    myMap = mappa.tileMap(options);

    myMap.overlay(canvas);
    myMap.onChange(drawStats)
    strokeWeight(0.4)
}

let first = true
const scaleUp = 10
let labelCache = []
let usaKilled = 0
let usaWounded = 0
function drawStats() {
    if (labelCache.length > 0)
        labelCache.forEach(l => l.remove())
    drawLegend()

    let labelCur = createDiv(sliderYear.value())
    labelCur.style("color", "white")
    labelCur.style("font-family", "IBM Plex Sans")
    labelCur.style("z-index", "2000")
    labelCur.position(windowWidth * .1 + (sliderYear.value() - 2009) * (windowWidth * .8 / 13.5) - 2, windowHeight - 30)
    labelCache.push(labelCur)

    // labels for 2009 and 2022
    let label2009 = createDiv("2009")
    label2009.style("color", "white")
    label2009.style("font-family", "IBM Plex Sans")
    label2009.style("z-index", "2000")
    label2009.position(windowWidth * .1 - 2, windowHeight - 30)
    labelCache.push(label2009)

    let label2022 = createDiv("2022")
    label2022.style("color", "white")
    label2022.style("font-family", "IBM Plex Sans")
    label2022.style("z-index", "2000")
    label2022.position(windowWidth * .1 + 13 * (windowWidth * .8 / 13.5) - 2, windowHeight - 30)
    labelCache.push(label2022)

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

        fill(...c2, 20)
        strokeWeight(0.2)
        circle(pos.x, pos.y, r_wounded)
        fill(...c1, 20)
        circle(pos.x, pos.y, r_killed)

        strokeWeight(0.4)
        fill(c2)
        if (r_killed < r_wounded) {
            drawDistribution(wounded, pos, r_wounded, curZoom, r_wounded / 2)
            fill(c1)
            drawDistribution(killed, pos, r_killed, curZoom)
        } else {
            drawDistribution(wounded, pos, r_wounded, curZoom)
            fill(c1)
            drawDistribution(killed, pos, r_killed, curZoom, r_killed / 2)
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
            narLabel.style("text-align", "start")
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

function drawLegend() {
    let legend = createDiv()
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
    legend.position(windowWidth * .1, windowHeight - 150)
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
    <div style="padding: 5px">Zoom and hover for more information</div>
    `)

    labelCache.push(legend)
}