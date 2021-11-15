var socket = require('socket.io');

const build_socket = (server) => {
  const io = socket(server);

  const fps = 30;
  const frame_time = 1000 / fps;

  let players = {};

  setInterval(heartbeat, frame_time);

  function heartbeat(){
      io.sockets.emit('heartbeat', {players: players});
  }

  io.sockets.on('connection', new_conn);

  function new_conn(socket){
      console.log('New Connection: ' + socket.id);
      
      // Example signal. Client side would be: socket.emit('mysignal', data)
      socket.on('mysignal', (data) => {
        console.log('Recieved:', data);
      });

      socket.on('login', (username) => {
        console.log('Recieved Login:', username);
        players[socket.id] = {
          username: username,
          position: {x: 0, y: 0}
        };
      })
  }
}

exports.build_socket = build_socket;