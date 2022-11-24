let canvasSize;
let input = "";

function preload() {
    //input = loadStrings("rapgod.txt");
    input = loadStrings("poem.txt");
}

function setup() {
    canvasSize = min(windowWidth, windowHeight)
    createCanvas(canvasSize, canvasSize);
    background(250);
    textSize(20);
    textAlign(CENTER, CENTER);

    const textRes = input.join();

    console.log(textRes);

    const tokens = RiTa.tokenize(textRes).map(x => x.toUpperCase());
    const tokenNeighborMap = new Map();
    for (let i = 0; i < tokens.length - 1; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];
        if (!tokenNeighborMap.has(token)) {
            tokenNeighborMap.set(token, nextToken);
        }
    }

    let sizeMap = new Map();
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

    const coordsPerToken = new Map();

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
    stroke(0);

    sizeMap.forEach((value, key) => {
        const size = map(value, 0, maxS, 0, canvasSize / 2);

        colorMode(HSB, 100);
        fill(mapWordTypeToColor(key), 100, 100);
        //circle(x, y, size);
        //fill(255);
        textSize(value > 1 ? size / 4 : 1);

        const [x, y] = coordsPerToken.get(key);
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
  