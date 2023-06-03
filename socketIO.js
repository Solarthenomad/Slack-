const SocketIO = require('socket.io');
//io(전체 사용자들끼리 데이터 공유) > namespace(namespace끼리 소통 제한) >> 방(방에 참가한 사람들끼리만 제한)
module.exports =(server ,app) =>{
    const io = SocketIO(server , {path : '/socket.io'});
    this.app.set('io', io); //req.app.set과 같음 // req.app.get('io)
    const room = io.of('/room');
    const chat = io.of('/chat');

    io.use((socket, next)=>{
      //미들웨어 확장패턴 : 다른 미들웨어에서도 미들웨어를 사용할수있도록 작성 
      cookieParser(process.env.COOKIE_SECRET)(socket.request, socket.request.res, next);
      sessionMiddleware(socket.request, socket.request.res, next);

    });

  //   const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
  // chat.use(wrap(sessionMiddleware));

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request.session.color;
    const {headers : {referer}}  = req;
    const roomUd = referer.split('/')[referer.split('/').length -1].replace(/\?+/, '');
    socket.join(roomId)

    socket.on('join', (data) => {
      socket.join(data);
      socket.to(data).emit('join', {
        user: 'system',
        chat: `${socket.request.session.color}님이 입장하셨습니다.`,
      });
    });

    socket.on('disconnect', async () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);
      const { referer } = socket.request.headers; // 브라우저 주소가 들어있음
      const roomId = new URL(referer).pathname.split('/').at(-1);
      const currentRoom = chat.adapter.rooms.get(roomId);
      const userCount = currentRoom?.size || 0;
      if (userCount === 0) { // 유저가 0명이면 방 삭제
        await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용
        room.emit('removeRoom', roomId);
        console.log('방 제거 요청 성공');
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${socket.request.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};

    io.on('connection', (socket) =>{ //웹 소켓 연결 시
        const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip); //요청에서 ip를 찾아서 꺼내쓰면 된다. 

    socket.on('disconnect', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
      socket.leave(roomId)함
      const currentRoom = socekt.adapter.rooms[roomId];
      const userCount = currentRoom ? currentRoom.length :0;
      if(usercount === 0) { //유저가 0명이면 방 삭제함

      }else {
        socket.to(roomId).emit('exit',{
          user : 'system',
          chat : '${req.session.color}님이 퇴장하셨습니다!',
        });
      }

    });
    socket.on('error', (error) => { // 에러 시
      console.error(error);
    });
    socket.on('reply', (data) => { // 클라이언트로부터 메시지
      console.log(data) // 
    });
    socket.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
      socket.emit('news', 'Hello Socket.IO');// 이벤트이름, 메세지 순서대로 보낸다. 이벤트이름까지 같이 보낸다. 
      //news라는 이벤트에 Helo Socket.IO라는 메세지를 보내라
    }, 3000);


    })
}