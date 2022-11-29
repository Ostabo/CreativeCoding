let canvasSize;
let input = "";
const backgroundC = 255;
const strokeC = 0;

let dirXMap = new Map();
let dirYMap = new Map();
let sizeMap = new Map();
const coordsPerToken = new Map();

const tokenNeighborMap = new Map();
let phonemeToFont;

function preload() {
    //input = loadStrings("rapgod.txt");
    input = loadStrings("poem.txt");
}

function setup() {
    canvasSize = min(windowWidth, windowHeight)
    createCanvas(canvasSize, canvasSize);

    phonemeToFont = {
        "AE": ITALIC,
        "AH": BOLD,
        "AO": BOLDITALIC,
        "AW": BOLDITALIC,
        "AY": NORMAL,
        "B": BOLD,
        "CH": ITALIC,
        "D": ITALIC,
        "DH": BOLD,
        "EH": BOLDITALIC,
        "ER": NORMAL,
        "EY": ITALIC,
        "F": BOLD,
        "G": BOLDITALIC,
        "HH": NORMAL,
        "IH": ITALIC,
        "IY": BOLD,
        "JH": BOLDITALIC,
        "K": NORMAL,
        "L": ITALIC,
        "M": ITALIC,
        "N": BOLD,
        "NG": BOLDITALIC,
        "OW": NORMAL,
        "OY": ITALIC,
        "P": BOLD,
        "R": BOLDITALIC,
        "S": NORMAL,
        "SH": ITALIC,
        "T": BOLD,
        "TH": BOLDITALIC,
        "UH": NORMAL,
        "UW": ITALIC,
        "V": BOLD,
        "W": BOLDITALIC,
        "Y": NORMAL,
        "Z": ITALIC,
        "ZH": BOLD
    };
  
    drawWords();
}

function draw() {
  background(backgroundC);
  const maxS = Math.max(...sizeMap.values());

  tokenNeighborMap.forEach((value, key) => {

        if (coordsPerToken.has(key) && coordsPerToken.has(value)) {
            const [x1, y1] = coordsPerToken.get(key);
            const [x2, y2] = coordsPerToken.get(value);
            colorMode(HSB, 100);
            stroke(mapWordTypeToColor(key), 100, 30);
            line(x1, y1, x2, y2);
        }
    });
  
  sizeMap.forEach((value, key) => {
        const size = map(value, 0, maxS, 0, canvasSize / 2);

        textSize(value >= 1 ? size / 4 : 1);
      
        const pho = RiTa.phones(key);
        const s = phonemeToFont[pho.split("-")[0].toUpperCase()];
        textStyle(s ? s : NORMAL); 

        let [x, y] = coordsPerToken.get(key);
        if (x + 1 >= canvasSize - size / 2) {
          x -= 1
          dirXMap.set(key, -1)
        }
        else if (x - 1 <= size / 2) {
          x += 1;
          dirXMap.set(key, 1)
        }
        else {
          x += 1 * dirXMap.get(key) ? dirXMap.get(key) : 1;
        }
    
        if (y + 1 >= canvasSize - size / 2) {
          y -= 1
          dirYMap.set(key, -1)
        }
        else if (y - 1 <= size / 2) {
          y += 1;
          dirYMap.set(key, 1)
        }
        else {
          y += 1 * dirYMap.get(key) ? dirYMap.get(key) : 1;
        }
        coordsPerToken.set(key, [x, y])
          
    
        fill('transparent')
        //fill(strokeC);
        //fill(backgroundC);
        //circle(x, y, size);
        rect(x, y, size)
        colorMode(HSB, 100);
        fill(mapWordTypeToColor(key), 100, 100);
        rectMode(CENTER);
        text(key, x, y);

    });
  
}

function drawWords() {
  background(backgroundC);
    textSize(20);
    textAlign(CENTER, CENTER);

    const textRes = input.join();

    console.log(textRes);

    const tokens = RiTa.tokenize(textRes).map(x => x.toUpperCase());
    for (let i = 0; i < tokens.length - 1; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];
        if (!tokenNeighborMap.has(token)) {
            tokenNeighborMap.set(token, nextToken);
        }
    }

    let phoMap = new Map();
    tokens.forEach((token) => {
        let amount = sizeMap.has(token) ? sizeMap.get(token) : 0;
        if (RiTa.hasWord(token)) {
            sizeMap.set(token, amount + 1);
        
            const analyze = RiTa.analyze(token).phone;
            let phoAmount = phoMap.has(analyze) ? phoMap.get(analyze) : 0;
            phoMap.set(analyze, phoAmount + 1);
        }
    });


    const maxS = Math.max(...sizeMap.values());
    sizeMap = new Map([...sizeMap.entries()].sort().reverse());
    const maxP = Math.max(...phoMap.values());

    sizeMap.forEach((value, key) => {
        const size = map(value, 0, maxS, 0, canvasSize / 2);

        const pho = RiTa.analyze(key).phone;
        let offset = phoMap.get(pho);
        offset = map(offset, maxP, 0, 0, canvasSize / 2);

        const [x, y] = [
            random(size + offset, canvasSize - size - offset),
            random(size + offset, canvasSize - size - offset)
        ];
        coordsPerToken.set(key, [x, y]);
    });

    tokenNeighborMap.forEach((value, key) => {

        if (coordsPerToken.has(key) && coordsPerToken.has(value)) {
            const [x1, y1] = coordsPerToken.get(key);
            const [x2, y2] = coordsPerToken.get(value);
            colorMode(HSB, 100);
            stroke(mapWordTypeToColor(key), 100, 30);
            line(x1, y1, x2, y2);
        }
    });

    //noStroke();
    stroke(strokeC);

    sizeMap.forEach((value, key) => {
        const size = map(value, 0, maxS, 0, canvasSize / 2);

        textSize(value >= 1 ? size / 4 : 1);
      
        const pho = RiTa.phones(key);
        const s = phonemeToFont[pho.split("-")[0].toUpperCase()];
        textStyle(s ? s : NORMAL); 

        const [x, y] = coordsPerToken.get(key);
        fill('transparent')
        //circle(x, y, size);
        rect(x, y, size)
        colorMode(HSB, 100);
        fill(mapWordTypeToColor(key), 100, 100);
        rectMode(CENTER);
        //fill(strokeC);
        text(key, x, y);

    });
}

function mapWordTypeToColor(word) {
    if (RiTa.isAdjective(word)) {
        return 10;
    } else if (RiTa.isAdverb(word)) {
        return 30;
    }
    else if (RiTa.isNoun(word)) {
        return 50;
    }
    else if (RiTa.isVerb(word)) {
        return 70;
    } 
    else if (RiTa.isPunct(word)) {
        return 80;
    }
    else if (RiTa.isQuestion(word)) {
        return 90;
    }
    return 60;
}
