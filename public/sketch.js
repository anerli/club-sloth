var socket;

const states = {
  LOGIN: 'LOGIN',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING'
}

var state = states.LOGIN;
var username = '';
var sloth_img_paths = [];
var avatar_images = {};
var avatar;
var speed = 5;
var players = [];

var x;
var y;
var avatar;

var id;

function setup() {
  createCanvas(1200, 600);
  colorMode(HSB, 255);

  // May want this to match the FPS on server,
  // Alternatively can set frameRate to 0 and manually call draw in heartbeat.
  frameRate(30);

  socket = io.connect('http://localhost:3000');

  socket.on('heartbeat', (data) => {
    players = data;   
  });

  socket.on('login_success', (data) => {
    if (state === states.LOADING) {
      id = data.id;
      console.log('My ID:', id)
      state = states.PLAYING;
    }
  })

  // Setup any other event listeners here

  let inp = createInput('');
  inp.position(200, 200);
  inp.size(1000);
  inp.style('font-family', 'Wingdings');
  inp.style('font-size', '32px');
  inp.input(() => {
    username = inp.value();
  });

  // Get sloths
  // If you don't specify json, you get the data as a string
  httpGet('http://localhost:3000/sloths', 'json', (res) => {
    console.log(res);
    console.log(res.sloths);
    sloth_img_paths = res.sloths;
    sloth_img_paths.forEach((sloth_img_path) => {
      avatar_images[sloth_img_path] = loadImage('./sloths/' + sloth_img_path);
    });
    console.log('avatar images:', avatar_images);
  });

  let button = createButton('§¾¿×¬¶þ¤ǢʥʭѬ');
  button.position(200, 300);
  button.mousePressed(log_in);
}

function log_in(){
  if (username.length > 0) {
    console.log('Login: ' + username);
    
    removeElements();

    console.log('State:', state);
    console.log('Sloth img paths: ' + sloth_img_paths);

    // Hopefully image paths are loaded at this point
    // random(sloth_img_paths); didn't work
    avatar = sloth_img_paths[Math.floor(Math.random() * sloth_img_paths.length)];

    x = 0;
    y = 0;

    socket.emit('login', {
      username: username,
      avatar: avatar,
      position: {x: x, y: y}
    });

    state = states.LOADING;
  }
}

function draw_players() {
  for (player_id in players) {
    if (player_id == id) continue;

    player = players[player_id];
    //console.log('Drawing user: ', player.username)
    
    let img = avatar_images[player.avatar];
    image(img, player.position.x, player.position.y, 100, 100);
  }

  image(avatar_images['sloth1.png'], 400, 400);

  // Draw self
  image(avatar_images[avatar], x, y, 100, 100);
}

function draw() {
  background(220, 255, 255);

  if (state === states.LOGIN) {
    background(200, 255, 255);
    textSize(32);
    text('WELCOME TO CLSLOTHþ UBCLUB SLOTHʭѬ', 50, 50);
    textSize(24);
    text('WHAT IS YOUR NAME', 100, 100);
  } else if (state === states.LOADING) {
    textSize(64);
    text('CONNECTING...', 100, 100);
  } else if (state === states.PLAYING) {
    draw_players();
    
    dir = createVector(0, 0);
    if (keyIsDown(LEFT_ARROW)) {
      dir.x -= 1;
    } if (keyIsDown(RIGHT_ARROW)) {
      dir.x += 1
    } if (keyIsDown(UP_ARROW)) {
      dir.y -= 1;
    } if (keyIsDown(DOWN_ARROW)) {
      dir.y += 1;
    }
    dir.normalize();
    dir.mult(speed);

    x += dir.x;
    y += dir.y;

    if (dir.x > 0 || dir.y > 0) {
      socket.emit('move', {x: x, y: y});
    }
  }

}

