
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
let states 

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

    colorMode(HSB, 360)
    angleMode(DEGREES)

    let heading = createDiv("Mass Shootings in the US")
    heading.style("color", "white")
    heading.style("font-size", "2em")
    heading.style("background-color", "black")
    heading.position(20, h - 50)

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

    const img = createImg('arrows.png')
    img.position(w - 120, 20)
    img.size(100, 100)
    img.style("filter", "invert(1)")
    let label4 = createDiv("Deaths")
    label4.style("color", "white")
    label4.style("background-color", "black")
    label4.position(w - 150, 30)
    let label5 = createDiv("Wounded")
    label5.style("color", "white")
    label5.style("background-color", "black")
    label5.position(w - 160, 90)

    states = createDiv()
    states.style("display", "grid")
    states.style("grid-template-columns", "repeat(12, 1fr)")
    //states.style("gap", "1vmax")
    states.style("font-family", "monospace")
    states.position(w - w / 3, h - h / 6)


    for (const key in stateToColorMap) {
        if (Object.hasOwnProperty.call(stateToColorMap, key) && key !== 'undefined') {
            const element = stateToColorMap[key];
            const [r, g, b] = [red(element), green(element), blue(element)]
            
            const legend = createDiv(key)
            legend.style("background", `rgb(${r}, ${g}, ${b})`)
            legend.style("padding", ".5vmin")
            legend.parent(states)
        }
    }

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
            
            if (current.length > 1)
                translate(0, - .5 * size / current.length, 0)

            current.forEach(e => {
                const { color, killed, wounded } = e

                fill(color)

                translate(0, 0, size * wounded / 2)

                rotateX(90)
                rotateY(45)
                cone(size / 1.5 / current.length, size * wounded, 5)
                rotateY(-45)
                rotateX(-90)

                translate(0, 0, -size * wounded / 2)
                translate(0, 0, -size * killed / 2)
                box(size, size / current.length, size * killed)
                translate(0, 0, size * killed / 2)

                if (current.length > 1)
                    translate(0, size / current.length, 0)
            })
            if (current.length > 1)
                translate(0, (-current.length + 0.5) * size / current.length, 0)

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
    "AL": [0, 360, 360],
    "AK": [30, 360, 360],
    "AZ": [60, 360, 360],
    "AR": [90, 360, 360],
    "CA": [120, 360, 360],
    "CO": [150, 360, 360],
    "CT": [180, 360, 360],
    "DE": [210, 360, 360],
    "FL": [240, 360, 360],
    "GA": [270, 360, 360],
    "HI": [300, 360, 360],
    "ID": [330, 360, 360],
    "IL": [0, 290, 360],
    "IN": [30, 290, 360],
    "IA": [60, 290, 360],
    "KS": [90, 290, 360],
    "KY": [120, 290, 360],
    "LA": [150, 290, 360],
    "ME": [180, 290, 360],
    "MD": [210, 290, 360],
    "MA": [240, 290, 360],
    "MI": [270, 290, 360],
    "MN": [300, 290, 360],
    "MS": [330, 290, 360],
    "MO": [0, 200, 360],
    "MT": [30, 200, 360],
    "NE": [60, 200, 360],
    "NV": [90, 200, 360],
    "NH": [120, 200, 360],
    "NJ": [150, 200, 360],
    "NM": [180, 200, 360],
    "NY": [210, 200, 360],
    "NC": [240, 200, 360],
    "ND": [270, 200, 360],
    "OH": [300, 200, 360],
    "OK": [330, 200, 360],
    "OR": [0, 110, 360],
    "PA": [30, 110, 360],
    "RI": [60, 110, 360],
    "SC": [90, 110, 360],
    "SD": [120, 110, 360],
    "TN": [150, 110, 360],
    "TX": [180, 110, 360],
    "UT": [210, 110, 360],
    "VT": [240, 110, 360],
    "VA": [270, 110, 360],
    "WA": [300, 110, 360],
    "WV": [330, 110, 360],
    "WI": [0, 50, 360],
    "WY": [30, 50, 360],
    "DC": [60, 50, 360],
    undefined: [90, 50, 360]
}
    
