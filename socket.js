const WebSocket = require('ws');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });
  // express server와 웹소켓 서버를 연결해준다. 


  wss.on('connection', (ws, req) => { // 웹소켓 연결 시(프론트에서 요청이 들어오면 실행되는 콜백함수)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; //ip를 파악하는 코드
    console.log('새로운 클라이언트 접속', ip); //클라이언트가 접속했을 때 보내는 코드 
    ws.on('message', (message) => { // 클라이언트로부터 메시지를 send한 것이 들어올 대 실행됨
      console.log(message.toString());
    });
    ws.on('error', (error) => { // 에러처리 핸들러
      console.error(error);
    });
    ws.on('close', () => { // 연결 종료 시
      console.log('클라이언트 접속 해제', i러);
      clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => { // 3초마다 클라이언트로 메시지 전송
        // 이부분 코드 잘 이해가 안됨....한번 확인해야될듯
        //이건 서버에서 프론트로 데이터를 보내는 것이다. 
      if (ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트로 메시지를 보냅니다.');
      }
    }, 3000);
  });
};