const express=require('express');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();


// main html 연결하는 라우터 정의 
router.get('/', async(req, res) =>{
    try{const rooms = await Room.find({});
        res.render('main', {rooms, title : 'GIF 채팅방'});  //room 정보들 출력할 수 있도록 함
} catch(error) {
    console.error(error);
    next(error);
   
}}
);

router.get('/room', (req,res) =>{
    res.render('room', {title : 'GIF 채팅방 생성'});

});

router.post('/room', async (req, res, next) =>{
    try {
        const newRoom = await Room.create({
            title : req.body.title,
            max : req.body.max,
            owner : req.session.color, //방장의 고유 색깔
            password : req.body.password,

        });
        const io = req.app.get('io'); //socket.io에서 app.set('io)를 받아옴 
        io.of('/room').emit('newRoom', newRoom); // 새로운 방의 정보가 방에 들어온 친구들이 그려와짐 : main.html에 출력해줄 정보들 
        res.redirect('/room/${newRoom._id}?password = ${req.body.password}'); //방에 입장할 수 있도록함
    } catch(error) {
        console.error(error);
        next(error);
    };
});

router.get('/room/:id', async(req,res,next) =>{
    try{
        const room = await Room.findOne({_id : req.params.id});
        const io = req.app.get('io');
        if(!room) {
            return res.redirect('/?error = 존재하지 않는 방입니다.');

        }
        if (room.password && room.password !== req.query.password){
            return res.redirect('/?error = 비밀번호가 틀렸습니다.');
        }
        const {rooms } = io.of('/chat').adapter; // 방 목록들이 들어 있음
        //io.of('/chat).adapter.rooms[방아이디]
        ////io.of('/chat).adapter.rooms[방아이디].length : 방 참가자수 
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length){
            return res.redirect('/?error = 허용 인원이 초과하였습니다.');
        }
        const chats = await Chat.find({room : room._id}).sort('createdAt');
        return res.render('chat',{
            rooms,
            title : room.title,
            chats : [],
            user:req.session.color,


        });
    } catch(error) {
        console.error(error);
        return next(error);
    }
});

router.delete('/room/:id', async(req, res,next) =>{
    try{
        await Room.removeAllListeners({_id : req.params.id});
        await Chat.removeAllListeners({room : req.params.id});
        res.send('ok');
        req.app.get('io').of('/room').emit('removeRoom' , req.params.id);
        setTimeout(() =>{
            req.app.get('io').of('/room').emit('removeRoom', req.params.id);
        } , 2000);
        
    } catch(error) {
        console.error(error);
        next(error);
    }
})

router.post('/room/:id/chat', async (req, res,next)=>{
    try{
        const chat = await Chat.create({
            room : req.params.id,
            user : req.session.color,
            chat : req.body.chat,
        });

        //req.app.get('io').broadcast.emit('chat',chat);
        req.app.get('io').of('/chat').emit('chat', chat); // 특정 방 사용자에게만 메세지를 수신하는 것 
        res.send('ok');
    }catch(error){
        console.error(error);
        next(error);
    }
});

try {
    fs.readdirSync('uploads');

}catch(err){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage : multer.diskStorage({
        destination(req, file,done){
            done(null, 'uploads/');
        },
        filename(req, file ,done){
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now()+ext);
        },
        
}),
limits : {fileSize : 5*1024*1024},});
router.post('/room/:id/gif', upload.single('gif'), async(req,res,next)=>{
    try{
        const chat = await Chat.create({
            room : req.params.id,
            user : req.session.color,
            gif : req.file.filename,

        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    }catch(error){
        console.error(error);
        next(error);

    }
});



module.exports = router;
