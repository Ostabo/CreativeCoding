let sound, fft;

function preload() {
  soundFormats('mp3', 'ogg');
  //sound = loadSound('../Vorlesung/Mario Batkovic_Accordion_ausschnitt');
  //sound = loadSound('../Vorlesung/outro-song');
  sound = loadSound('../Vorlesung/clapping');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.mouseClicked(togglePlay);
  
  fft = new p5.FFT();
  sound.amp(0.2);
}

function draw() {
  background(20);

  let spectrum = fft.analyze();

  stroke(255);
  for (let i = 0; i < spectrum.length; i++){
    let h = map(spectrum[i], 0, 255, 0, min(width, height) / 2)
     + min(width, height) / 10;
    line(width / 2, height / 2,
      h * sin(PI + (TWO_PI / 360) * i) + width / 2,
      h * cos(PI + (TWO_PI / 360) * i) + height / 2);
  }
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}