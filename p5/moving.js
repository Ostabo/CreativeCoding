const fontStyle = 'monospace';
const fontSize = 2;

let video;
let time = 0;
let loaded = false;
let play = true;
const fr = 15;
let d;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  video = createVideo('skate.mp4', () => {
    d = min(video.width, video.height, windowHeight / 2);
    //resizeCanvas(video.width, video.height);
    resizeCanvas(windowWidth, d * 3);
    loaded = true;
    video.volume(0);
    video.hide();
    
    const drawNextFrame = () => {
      // Only draw the image to the screen when the video
      // seek has completed
      const onSeek = () => {
        draw();
        video.elt.removeEventListener('seeked', onSeek);
        
        // Wait a half second and draw the next frame
        setTimeout(drawNextFrame, 500);
      };
      video.elt.addEventListener('seeked', onSeek);
      
      // Start seeking ahead
      video.time(time); // Seek ahead to the new time
      if (play) 
        time += 1/fr;
    };
    drawNextFrame();
  });
}

function mousePressed() {
    play = !play;
}

function draw() {
  //background(255);

  if (!loaded) return;
  image(video, 0, 0, video.width, d);
  fill('#F00');
  noStroke();
  textAlign(LEFT, TOP);
  textSize(20);
  let counter = round(time*fr);
  text(counter, 20, 20);

  makeAsciiArt();
  showColorPaletteAsBlocks(counter);
}

function showColorPaletteAsBlocks(counter) {
    const colors = getColorPaletteOfImage(video);
    const w = 5;
    const h = d / video.height;
    for (let i = 0; i < video.height; i++) {
        fill(colors[i]['color']);
        noStroke();
        rect((counter - 1) * w, i * h + d, w, h);
    }
}

function getColorPaletteOfImage(img) {
    const palette = [];
    const colors = {};
    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        const r = img.pixels[i];
        const g = img.pixels[i + 1];
        const b = img.pixels[i + 2];
        const a = img.pixels[i + 3];
        const color = [r, g, b, a];
        const key = color.join(',');
        if (colors[key]) {
            colors[key].count++;
        } else {
            colors[key] = {
                color,
                count: 1
            };
        }
    }
    for (const key in colors) {
        palette.push(colors[key]);
    }
    palette.sort((a, b) => b.count - a.count);
    return palette;
}

function makeAsciiArt() {
  const coords = [0, d * 2, video.width, d];
  fill(255);
  rect(...coords); 
  noStroke();
    
  const myAsciiArt = new AsciiArt(this);
  
  textFont(fontStyle, fontSize);
  noStroke(); 
  fill(0);
  
  let ascii_arr = myAsciiArt.convert(video);

  //ascii_arr = myAsciiArt.convert2dArrayToString(ascii_arr);
  //console.log(ascii_arr);
  //text(ascii_arr, 0, 0, video.width, video.height);
  
  myAsciiArt.typeArray2d(ascii_arr, this, ...coords);
  //myAsciiArt.typeArray2d(ascii_arr, this, 0, 0, video.width, video.height);

}