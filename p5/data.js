
const yearMap = {
    0: 31,
    1: 28,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
}

let data

function preload() {
    data = loadTable('everytownresearch-massshootings.csv', 'csv', 'header');
}

let w, h, size
let sliderX, sliderZ, sliderPosX, sliderPosY, sliderPosZ, sliderSize, sliderYear

const headers = [
    "Date",
    "State",
    "Number killed",
    "Number wounded"
]

function setup() {
    [w, h] = [windowWidth, windowHeight]
    size = min(w, h) / 15
    createCanvas(w, h, WEBGL)

    angleMode(DEGREES)

    let label = createDiv("Rotation + Size")
    label.style("color", "white")
    label.style("background-color", "black")
    label.position(20, 20)
    sliderX = createSlider(0, 180, 60)
    sliderX.position(20, 50)
    sliderZ = createSlider(90, 270, 130)
    sliderZ.position(20, 80)
    sliderSize = createSlider(1, size, size / 2.2)
    sliderSize.position(20, 110)

    let label2 = createDiv("Year (2009 - 2022)")
    label2.style("color", "white")
    label2.style("background-color", "black")
    label2.position(20, 150)
    sliderYear = createSlider(2009, 2022, 0)
    sliderYear.position(20, 180)

    let label3 = createDiv("Position X, Y, Z")
    label3.style("color", "white")
    label3.style("background-color", "black")
    label3.position(220, 20)
    sliderPosX = createSlider(-w / 2, w / 2, 100)
    sliderPosX.position(220, 50)
    sliderPosY = createSlider(-h / 2, h / 2, -10)
    sliderPosY.position(220, 80)
    sliderPosZ = createSlider(-1000, 1000, 0)
    sliderPosZ.position(220, 110)

}

function draw() {
    background(20)
    size = sliderSize.value()
    const sizeWithGap = 1.1 * size
    translate(-w / 2 + sizeWithGap, 0, 0)
    rotateX(sliderX.value())
    rotateY(180)
    rotateZ(sliderZ.value())

    const displayData = data.getRows().filter(row => {
        return new Date(
            row.get(headers[0])
            ).getFullYear() === sliderYear.value()
        }
    ).map(row => {
        const date = new Date(row.get(headers[0]))
        const state = row.get(headers[1])
        const killed = row.get(headers[2])
        const wounded = row.get(headers[3])

        return {
            dayOfWeek: date.getDay(),
            month: date.getMonth(),
            day: date.getDate(),
            color: stateToColorMap[state],
            killed,
            wounded
        }
    })

    translate(sliderPosX.value(), sliderPosY.value(), sliderPosZ.value())

    for(let i = 0; i < 12; i++) {
        for (let j = 0; j < yearMap[i]; j++) {

            const current = displayData.filter(d => d.month === i && d.day === j + 1)
            if (current.length > 0) {
                const { color, killed, wounded } = current[0]
                fill(color)
                translate(0, 0, size * wounded / 2)
                box(size, size, size * wounded)
                translate(0, 0, -size * wounded / 2)
                translate(0, 0, -size * killed / 2)
                box(size, size, size * killed)
                translate(0, 0, size * killed / 2)
            }
            const dayOfWeek = new Date(sliderYear.value(), i, j + 1).getDay()
            fill(dayOfWeekColorMap[dayOfWeek])
            noStroke()
            plane(size)
            stroke(1)

            translate(0, sizeWithGap, 0)
        }
        translate(sizeWithGap, -1 * yearMap[i] * sizeWithGap, 0)
    }
}

const dayOfWeekColorMap = {
    0: "white",
    1: "white",
    2: "white",
    3: "white",
    4: "white",
    5: "white",
    6: "green"
}

const stateToColorMap = {
    "AL": "#FF0000",
    "AK": "#FF7F00",
    "AZ": "#FFFF00",
    "AR": "#00FF00",
    "CA": "#00FFFF",
    "CO": "#0000FF",
    "CT": "#8B00FF",
    "DE": "#FF0000",
    "FL": "#FF7F00",
    "GA": "#FFFF00",
    "HI": "#00FF00",
    "ID": "#00FFFF",
    "IL": "#0000FF",
    "IN": "#8B00FF",
    "IA": "#FF0000",
    "KS": "#FF7F00",
    "KY": "#FFFF00",
    "LA": "#00FF00",
    "ME": "#00FFFF",
    "MD": "#0000FF",
    "MA": "#8B00FF",
    "MI": "#FF0000",
    "MN": "#FF7F00",
    "MS": "#FFFF00",
    "MO": "#00FF00",
    "MT": "#00FFFF",
    "NE": "#0000FF",
    "NV": "#8B00FF",
    "NH": "#FF0000",
    "NJ": "#FF7F00",
    "NM": "#FFFF00",
    "NY": "#00FF00",
    "NC": "#00FFFF",
    "ND": "#0000FF",
    "OH": "#8B00FF",
    "OK": "#FF0000",
    "OR": "#FF7F00",
    "PA": "#FFFF00",
    "RI": "#00FF00",
    "SC": "#00FFFF",
    "SD": "#0000FF",
    "TN": "#8B00FF",
    "TX": "#FF0000",
    "UT": "#FF7F00",
    "VT": "#FFFF00",
    "VA": "#00FF00",
    "WA": "#00FFFF",
    "WV": "#0000FF",
    "WI": "#8B00FF",
    "WY": "#FF0000",
    "DC": "#FF7F00",
    "AS": "#FFFF00",
    "GU": "#00FF00",
    "MP": "#00FFFF",
    "PR": "#0000FF",
    "VI": "#8B00FF",
    "UM": "#FF0000",
    "FM": "#FF7F00",
    "MH": "#FFFF00",
    "PW": "#00FF00",
    "AA": "#00FFFF",
    "AE": "#0000FF",
    "AP": "#8B00FF",
    undefined: "#FFFFFF"
}
    
