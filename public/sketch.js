var socket;

const states = {
  LOGIN: 'LOGIN',
  PLAYING: 'PLAYING'
}

var state = states.LOGIN;
var username = '';
var sloth_img_paths = [];
var avatar;

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
  // If you don't specify json, you get the data as a string
  httpGet('http://localhost:3000/sloths', 'json', (res) => {
    console.log(res);
    console.log(res.sloths);
    sloth_img_paths = res.sloths;
  });

  let button = createButton('§¾¿×¬¶þ¤ǢʥʭѬ');
  button.position(200, 300);
  button.mousePressed(log_in);
}

function log_in(){
  if (username.length > 0) {
    socket.emit('login', {username: username});
    console.log('Login: ' + username);
    removeElements();

    console.log('State:', state);
    console.log('Sloth img paths: ' + sloth_img_paths);

    // Hopefully image paths are loaded at this point
    // random(sloth_img_paths); didn't work
    let avatar_path = './sloths/' + sloth_img_paths[Math.floor(Math.random() * sloth_img_paths.length)];
    console.log('avatar_path:', avatar_path);
    avatar = createImg(avatar_path);
    state = states.PLAYING;
  }
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
  } else if (state === states.PLAYING) {
    avatar.position(mouseX, mouseY);
    avatar.size(100, 100);
  }

}

