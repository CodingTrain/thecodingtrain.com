let x;
let y;
let seed;
let bold;
let data;
let inputFromField = -1;

function preload() {
  data = loadJSON('supporterDatabase.json');
}

function updateNumber() {
  const number = select('#number').value();
  if (data[number]) {
    inputFromField = number;
    resetSketch();
  } else {
    select('#thanks').html(`That number isn't a valid whistle number!`);
    select('#walk').html('');
    select('#number').value('');
  }
}

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('p5canvas');
  rainbow = false;
  resetSketch();

  select('#go').mousePressed(updateNumber);
  select('#number').changed(updateNumber);
}

function toggleRainbow() {
  rainbow = !rainbow;
}

function keyPressed() {
  if (keyCode === UP_ARROW || keyCode == 38) {
    toggleRainbow();
    resetSketch();
  }
}

function draw() {
  if (inputFromField != -1) {
    colorMode(HSB);
    if (!rainbow) {
      stroke(360, 0, 100);
    } else {
      if (frameCount % 5 == 0) {
        hueState = (hueState + 1) % 360;
      }
      stroke(hueState, 100, 100);
    }
    strokeWeight(zoom);
    point(x, y);
    const r = int(random(4));
    // TODO: add stepsize and scale for mobile
    switch (r) {
      case 0:
        x = x + zoom;
        break;
      case 1:
        x = x - zoom;
        break;
      case 2:
        y = y + zoom;
        break;
      case 3:
        y = y - zoom;
        break;
    }
  } else {
    setup();
  }
}
function resetSketch() {
  let params = getURLParams();
  let dataUser = data[inputFromField] || { name: 'placholder', seed: 1 };
  let name = dataUser['name'];
  let seed = dataUser['seed'];
  zoom = parseInt(params.zoom) || 8;
  randomSeed(int(seed));

  if (inputFromField != -1) {
    select('#thanks').html(
      `❤️ Thank you ${name} for your support of The Coding Train! ❤️`
    );
    select('#walk').html(
      `🚂 Enjoy this unique random walk with your personalized seed of ${seed}! 🔢`
    );
  }
  background(0);
  x = width / 2;
  y = height / 2;
  hueState = 0;
  randomSeed(int(seed));
}
