let baseRadius, sound, fft, img, peakDetect;
let ellipseWidth = 10;

function preload() {
  soundFormats('mp3', 'ogg');
  //sound = loadSound('../Vorlesung/Mario Batkovic_Accordion_ausschnitt');
  sound = loadSound('../Vorlesung/outro-song');
  //sound = loadSound('../Vorlesung/clapping');
  //sound = loadSound('../Vorlesung/axelf');
  //img = loadImage('../Vorlesung/moon.jpg');
  img = loadImage('../Vorlesung/moon_v2.jpg');
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.mouseClicked(togglePlay);

  image(img, 0, 0, width, height);
  
  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect(500, 16000, .2, 20);
  sound.amp(.2);

  colorMode(HSB, 360);

  baseRadius =  min(width, height) / 7.4;
}

function draw() {
  image(img, 0, 0, width - 5, height + 5);

  let spectrum = fft.analyze();
  peakDetect.update(fft);

  let sat = 150;
  for (let i = 0; i < spectrum.length; i++){
    stroke(i, sat, 360);

    if (spectrum[i] > 100) {
      stroke(i, sat++, 360);
    }

    let h = map(spectrum[i], 0, 255, 0, min(width, height) / 3)
     + baseRadius;
    line(
      baseRadius * sin(PI + (TWO_PI / 360) * i) + width / 2,
      baseRadius * cos(PI + (TWO_PI / 360) * i) + height / 2,
      h * sin(PI + (TWO_PI / 360) * i) + width / 2,
      h * cos(PI + (TWO_PI / 360) * i) + height / 2);
  }

  stroke(360);
  strokeWeight(2);
  fill(0);
  circle(width / 2, height / 2, baseRadius * 2);
  
  if ( peakDetect.isDetected ) {
    ellipseWidth = baseRadius;
  } else {
    ellipseWidth *= 0.95;
  }

  translate(width / 2, height / 2);
  rotate(frameCount);
  polygon(0, 0, ellipseWidth, random(3, 8));
  circle(0, 0, ellipseWidth, ellipseWidth);

}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
  vertex(sx, sy);
  }
  endShape(CLOSE);
}