const { Server } = require('socket.io');

let io = null;

const notificationRoom = 'not_';
const updateRoom = 'upd_';

const init = () => {
  io.on('connection', socket => {
    
    console.log(`User connected ${socket.id}`);
    
    socket.on('join_chat', (data) => {
      const { chat } = data;
      
      socket.join(chat);
    });
    
    socket.on('leave_chat', (data) => {
      const { chat } = data;
      
      socket.leave(chat);
    });
    
    socket.on('join_notifications', (data) => {
      const { chat } = data;
      
      socket.join(notificationRoom + chat);
    });
    
    socket.on('leave_notifications', (data) => {
      const{ chat } = data;
      
      socket.leave(notificationRoom + chat);
    });
    
    socket.on('join_updates', () => {
      socket.join(updateRoom);
    });
    
    socket.on('leave_updates', () => {
      socket.leave(updateRoom);
    });
    
    socket.on('send_message', (data) => {
      const { chat, message } = data;
      
      io.in(chat).emit('receive_message', message);
    });
  });
}

exports.setupIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  
  init();
}

exports.emit = (chat, event, data, options = { notification: false, update: false }) => {
  let finalChat = chat;
  
  if (options.notification) finalChat = notificationRoom + chat;
  else if (options.update) finalChat = updateRoom + chat;
  
  io.in(finalChat).emit(event, data);
}