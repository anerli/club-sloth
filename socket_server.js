var socket = require('socket.io');

const build_socket = (server) => {
  const io = socket(server);

  const fps = 30;
  const frame_time = 1000 / fps;

  let players = {};

  setInterval(heartbeat, frame_time);

  function heartbeat(){
      let player_list = [];
      for (key in players){
        player_list.push(players[key]);
      }
      io.sockets.emit('heartbeat', {players: player_list});
  }

  io.sockets.on('connection', new_conn);

  function new_conn(socket){
      console.log('New Connection: ' + socket.id);
      
      // Example signal. Client side would be: socket.emit('mysignal', data)
      socket.on('mysignal', (data) => {
        console.log('Recieved:', data);
      });

      socket.on('login', (userdata) => {
        console.log('Recieved Login:', userdata);
        // Should include username, avatar, and position
        players[socket.id] = userdata;
      })

      socket.on('move', (pos) => {
        //console.log('Recieved Move:', pos);
        players[socket.id].position = pos;
      });
  }
}

exports.build_socket = build_socket;