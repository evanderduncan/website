let video;
let prevFrame;
let diffFrame;
let firstFrame;
let diffThreshold = 40;
let isFirstFrameCaptured = false;

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);

  video = createVideo('Laundromat Sapporo (1).mp4');
  video.size(width, height);
  video.hide();
  video.loop();
  video.volume(0);

  prevFrame = createGraphics(640, 480);
  diffFrame = createGraphics(640, 480);
  firstFrame = createGraphics(640, 480);

  diffFrame.clear(); // start with a fully transparent frame
}

function draw() {
  if (video.loadedmetadata && video.width > 0) {
    if (!isFirstFrameCaptured) {
      firstFrame.image(video, 0, 0, width, height);
      isFirstFrameCaptured = true;
      return;
    }

    video.loadPixels();
    prevFrame.loadPixels();
    diffFrame.loadPixels();

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let i = (y * width + x) * 4;

        let currR = video.pixels[i];
        let currG = video.pixels[i + 1];
        let currB = video.pixels[i + 2];

        let prevR = prevFrame.pixels[i];
        let prevG = prevFrame.pixels[i + 1];
        let prevB = prevFrame.pixels[i + 2];

        let diff = abs(currR - prevR) + abs(currG - prevG) + abs(currB - prevB);

        if (diff > diffThreshold) {
          // permanently store the new pixel in diffFrame
          diffFrame.pixels[i] = currR;
          diffFrame.pixels[i + 1] = currG;
          diffFrame.pixels[i + 2] = currB;
          diffFrame.pixels[i + 3] = 255; 
        }
      }
    }

    diffFrame.updatePixels();

    image(firstFrame, 0, 0, width, height);
    image(diffFrame, 0, 0, width, height);

   
    prevFrame.image(video, 0, 0, width, height);
  }
}
