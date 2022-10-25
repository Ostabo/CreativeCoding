let mySound;
function preload() {
  soundFormats('mp3', 'ogg');
  mySound = loadSound('../Vorlesung/Mario Batkovic_Accordion_ausschnitt');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  const peaks = mySound.getPeaks();
  console.log(peaks);
  let i = 0;
  peaks.forEach(element => {
    rect(++i * 60, element * 100000 + 200, 50, 50);
  });
  text(peaks.size, 20, 20);

    mySound.play();
}

function draw() {
}