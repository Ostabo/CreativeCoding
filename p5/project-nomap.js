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
    style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
};

let sliderYear;
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    myMap = mappa.tileMap(options);

    myMap.overlay(canvas);
    myMap.onChange(drawStats)
  
}

function draw() {
}
let first = true
const scaleUp = 10
let labelCache = []
function drawStats() {

    myMap.map.setMinZoom(4)
    myMap.map.setMaxZoom(4)
    curZoom = myMap.zoom()
    clear()
    background(255)
    data.getRows().forEach(e => {
        const pos = myMap.latLngToPixel(e.get(headers[3]), e.get(headers[4]));
        
        fill(255,0,0)
        const r_killed = sqrt(e.get(headers[1])) / PI * scaleUp * curZoom
        const r_wounded = sqrt(e.get(headers[2])) / PI * scaleUp * curZoom
        if (r_wounded == 0)
            ellipse(pos.x, pos.y, r_killed, r_killed)
          //rect(pos.x, pos.y, r_killed, r_killed)
        else 
            arc(pos.x, pos.y, r_killed, r_killed, HALF_PI, PI + HALF_PI)
          //rect(pos.x, pos.y, r_killed, r_killed)
      
        fill(255,200,200)
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
}
