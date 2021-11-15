var socket = require('socket.io');

const build_socket = (server) => {
  const io = socket(server);

  const fps = 30;
  const frame_time = 1000 / fps;
  setInterval(heartbeat, frame_time);

  function heartbeat(){
      io.sockets.emit('heartbeat', {example_message: 'Hello all!'});
  }

  io.sockets.on('connection', new_conn);

  function new_conn(socket){
      console.log('New Connection: ' + socket.id);
      
      // Example signal. Client side would be: socket.emit('mysignal', data)
      socket.on('mysignal', (data) => {
          console.log('Recieved:', data);
      });
  }
}

exports.build_socket = build_socket;