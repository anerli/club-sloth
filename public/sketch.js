var socket;

const states = {
  LOGIN: 'LOGIN',
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  DISCONNECTED: 'DISCONNECTED'
}

const server_url = "https://club-sloth.anerli.repl.co";
// const server_url = "http://localhost:3000"

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

var chat_input;
var chat_message = '';
var last_msg = '';

var id;

function setup() {
  createCanvas(1200, 600);
  colorMode(HSB, 255);

  // May want this to match the FPS on server,
  // Alternatively can set frameRate to 0 and manually call draw in heartbeat.
  frameRate(30);

  socket = io.connect(server_url);

  socket.on('heartbeat', (data) => {
    players = data;   

    socket.emit('alive');
  });

  socket.on('login_success', (data) => {
    if (state === states.LOADING) {
      id = data.id;
      console.log('My ID:', id)
      state = states.PLAYING;

      // Create chat input
      chat_input = createInput('');
      chat_input.position(10, window.height - 50);
      chat_input.size(window.width - 20, 20);
      chat_input.input(() => {
        chat_message = chat_input.value();
        // if (keyIsDown(ENTER)) {
        //   console.log('sent thing');
        //   socket.emit('chat', chat_message);
        //   chat_message = '';
        // }
      });
      //chat_input.s
    }
  })

  socket.on('dc', () => {
      if (state == states.PLAYING) {
        state = states.DISCONNECTED;
        removeElements();
        socket.disconnect();
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
  httpGet(server_url + '/sloths', 'json', (res) => {
    console.log(res);
    console.log(res.sloths);
    sloth_img_paths = res.sloths;
    sloth_img_paths.forEach((sloth_img_path) => {
      avatar_images[sloth_img_path] = loadImage('https://club-sloth.anerli.repl.co/sloths/' + sloth_img_path);
    });
    console.log('avatar images:', avatar_images);
  });

  let button = createButton('§¾¿×¬¶þ¤ǢʥʭѬ');
  button.position(200, 300);
  button.mousePressed(log_in);
}

function draw_chat(msg, x, y) {
  if (msg.length == 0) return;
  fill(255);
  triangle(x + 60, y + 20, x + 80, y + 30, x + 80, y + 25);
  rect(x+80, y+20, 8*msg.length, 20);
  textSize(16);
  fill(0);
  text(msg, x+86, y+36);
}

function keyPressed() {
  // console.log(state);
  // console.log(keyCode);
  // console.log(username);
  // console.log(state == states.PLAYING);
  // console.log(keyCode === ENTER);
  // console.log(chat_message.length > 0);
  if (state === states.LOGIN && keyCode === ENTER && username.length > 0) {
    log_in();
  }
  if (state === states.PLAYING && keyCode === ENTER && chat_message.length > 0) {
    console.log('sent:', chat_message);
    socket.emit('chat', chat_message);
    console.log(chat_input);
    last_msg = chat_message;
    chat_message = '';
    // Change value of underlying input field
    chat_input.elt.value = '';
  }
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

    x = width/2;
    y = height/2;

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

    push();
    textSize(20);
    textAlign(CENTER);
    text(player.username, player.position.x+40, player.position.y - 10);
    pop();

    draw_chat(player.last_msg, player.position.x, player.position.y);
  }

  //image(avatar_images['sloth1.png'], 400, 400);

  // Draw self
  image(avatar_images[avatar], x, y, 100, 100);
  // Draw username
  push();
  textSize(20);
  textAlign(CENTER);
  text(username, x+40, y - 10);
  pop();
  // Draw last chat message
  draw_chat(last_msg, x, y);
  //textSize(12);
  //text(last_msg, x, y - 40);
}

function draw() {
  background(220, 255, 255);

  if (state === states.LOGIN) {
    background(200, 255, 255);
    textSize(32);
    //text('WELCOME TO CLSLOTHþ UBCLUB SLOTHʭѬ', 50, 50);
    text('WELCOME TO CLUB SLOTH', 50, 50);
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

    if (abs(dir.x) > 0 || abs(dir.y) > 0) {
      socket.emit('move', {x: x, y: y});
    }
  } else if (state === states.DISCONNECTED) {
      textSize(64);
      text('DISCONNECTED. Refresh to join again.', 100, 100);
  }

}

