const SSE = require('sse');

module.exports=()=>{
    const sse = new SSE(server);
    sse.on('connection', (client)=>{  //서버센트이벤트를 연결하는 과정
      setInterval(()=>{
        client.send(Date.now().toString());
      }, 1000);
    });
}