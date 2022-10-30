let sound;
let fft;
function preload() {
  soundFormats('mp3', 'ogg');
  sound = loadSound('../Vorlesung/Mario Batkovic_Accordion_ausschnitt');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.mouseClicked(togglePlay);
  
  fft = new p5.FFT();
  sound.amp(0.2);
}

function draw() {
  background(150);

  let spectrum = fft.analyze();
  noStroke();
  fill(0);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width * 2);
    let y = map(i, 0, spectrum.length, 0, height * 2);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    circle(x, y, h);
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255);
  strokeWeight(2);
  for (let i = 0; i< waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    point(x,y);
  }
  endShape();
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}