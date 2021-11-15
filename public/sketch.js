let socket;

const states = {
  LOGIN: 'LOGIN',
  PLAYING: 'PLAYING'
}

let state = states.LOGIN;
let username = '';
let sloth_img_paths = [];

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

  let inp = createInput('');
  inp.position(200, 200);
  inp.size(1000);
  inp.style('font-family', 'Wingdings');
  inp.style('font-size', '32px');
  inp.input(() => {
    //console.log(inp.value());
    username = inp.value();
    // Delete extra DOM elements
    //removeElements();
  });

  // Get sloths
  httpGet('http://localhost:3000/sloths', (res) => {
    console.log(res);
    sloth_img_paths = res.sloths;
  });

  let button = createButton('§¾¿×¬¶þ¤ǢʥʭѬ');
  button.position(200, 300);
  button.mousePressed(() => {
    if (username.length > 0) {
      socket.emit('login', {username: username});
      console.log('Login: ' + username);
      state = states.PLAYING;
    }
    removeElements();
  });
}

function draw() {
  background(220, 255, 255);

  if (state === states.LOGIN) {
    background(200, 255, 255);
    //console.log('Asd');
    textSize(32);
    text('WELCOME TO CLSLOTHþ UBCLUB SLOTHʭѬ', 50, 50);
    textSize(24);
    text('WHAT IS YOUR NAME', 100, 100);
  }

}

