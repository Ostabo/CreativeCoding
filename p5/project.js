// https://www.gunviolencearchive.org/
// https://everystat.org/
// https://www.kaggle.com/datasets/zusmani/us-mass-shootings-last-50-years
// https://everytownresearch.org/maps/mass-shootings-in-america/
// https://www.gunpolicy.org/firearms/region/germany
// https://www.nationmaster.com/country-info/compare/Germany/United-States/Crime/Violent-crime
// https://www.youtube.com/watch?v=jCmh_eXwPH0
// https://corgis-edu.github.io/corgis/csv/state_crime/
// https://mappa.js.org/docs/simple-map.html
// https://github.com/CartoDB/basemap-styles

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
    lat: 39,
    lng: -96,
    zoom: curZoom,
    // style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
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
}

function draw() {
}
let first = true
const scale = 100
let labelCache = []
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
    console.log(myMap.map.getZoom() + " " + myMap.map.zoomSnap)
    curZoom = myMap.zoom()
    clear()
    data.getRows().filter(row => {
        return new Date(
            row.get(headers[6])
            ).getFullYear() === sliderYear.value()
        }).forEach(e => {
        const pos = myMap.latLngToPixel(e.get(headers[3]), e.get(headers[4]));
        
        fill(255,0,0)
        const r_killed = sqrt(e.get(headers[1]) * scale) / PI * curZoom
        const r_wounded = sqrt(e.get(headers[2]) * scale) / PI * curZoom
        if (r_wounded == 0)
            ellipse(pos.x, pos.y, r_killed, r_killed)
        else 
            arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
        fill(255,255,0)
        arc(pos.x, pos.y, r_wounded, r_wounded, PI + HALF_PI, TWO_PI + HALF_PI)

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
