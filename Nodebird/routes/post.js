const express= require('express');
const multer = require('multer');
const path = require('path');
const fs= require('fs');

const {Post, Hashtag}  =require("../models");
const {isLoggedIn} =require('./middlewares');

const router = express.Router();

try {
    fs.readdirSync('uploads'); //uploads 폴더에 파일 업로드

}
catch(error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.')
    fs.mkdirSync('uploads');

}

const upload = multer({
    storage : multer.diskStorage({
        destination(req,file,cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            const ext = path.extname(file.originalname);
            cb(null, pth.basename(file.originalname, ext) + Date.now() + ext);

        },

    }), limits : {fileSize : 5 *1024 *1024},
});

//이미지 따로 게시글 따로 
router.post('/img', isLoggedIn, upload.single('img'), (req,res) =>{
    console.log(req.file); //업로드 결과물이 req.file에 적혀있게 됨 
    res.json({url : '/img/${req.file.filename}'}); //요청주소 : /img/filename
});


router.post('/', isLoggedIn, upload.none(),async ( req,res,next)=>{
    try{
        req.body.content.match(/#[^\s#]*/g);
        const post= await Post.create({
            content : req.body.content,
            img : req.body.url,
            UserId : req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        // [#노드, #익스프레스]
        //[노드, 익스프레스]
        //[findOrCreate(노드), findoOrCreate(익스프레스)]
        //디비에 저장되어있으면 찾고, 디비에 없으면 생성해줌 
        // [[해쉬태그, false], [해쉬태그, false]]
        if (hashtags) {
            const result = await Promise.all(
                hashtags.map(tag => {
                    return Hashtag.findOrCreate({
                        where : {title : tag.slice(1).toLowerCase()},
                    })
                }),
                Hashtag.upsert //hash태그가 존재하지 않는다면 넣고, 존재한다면 업데이트 시켜주기  
            );
            console.log(result);
            //첫 번쨰해쉬태그를 꺼내서 넣기 
            await post.addHashtags(result.map( r=>r[0]));
            // addHashtags([해쉬태그, 해쉬태그])
        }
        res.redirect('/');

    } catch(error){
        console.error(error);
        next(error);
    }
    


});

module.exports = router;

