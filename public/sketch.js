let socket;

function setup() {
  createCanvas(1200, 600);
  colorMode(HSB, 255);

  // May want this to match the FPS on server,
  // Alternatively can set frameRate to 0 and manually call draw in heartbeat.
  frameRate(30);

  socket = io.connect('http://localhost:3000');

  socket.on('heartbeat', (data) => {

  });

  // Setup any other event listeners here
}

function draw() {
  background(0);
}

