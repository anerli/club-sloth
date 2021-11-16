var socket = require('socket.io');

const build_socket = (server) => {
  const io = socket(server);

  const fps = 30;
  const frame_time = 1000 / fps;

  let players = {};

  setInterval(heartbeat, frame_time);

  function heartbeat(){
      // let player_list = [];
      // for (key in players){
      //   player_list.push(players[key]);
      // }
      io.sockets.emit('heartbeat', players);
  }

  io.sockets.on('connection', new_conn);

  function new_conn(socket){
      console.log('New Connection: ' + socket.id);
      
      // Example signal. Client side would be: socket.emit('mysignal', data)
      socket.on('chat', (msg) => {
        console.log('Recieved chat message:', msg);
        players[socket.id].last_msg = msg;
      });


      socket.on('login', (userdata) => {
        console.log('Recieved Login:', userdata);
        // Should include username, avatar, and position
        players[socket.id] = {last_msg: '', ...userdata};
        

        // Delay slightly so client has time to load in self as user.
        setTimeout(()=>{socket.emit('login_success', {'id': socket.id})}, frame_time);
      })

      socket.on('move', (pos) => {
        //console.log('Recieved Move:', pos);
        players[socket.id].position = pos;
      });
  }

  io.sockets.on('disconnect', (socket) => {
    console.log('Disconnect: ' + socket.id);
    delete players[socket.id];
  });
}

exports.build_socket = build_socket;