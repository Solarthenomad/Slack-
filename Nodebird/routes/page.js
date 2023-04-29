


// app.js에서 app.use('/', pageRouter);로 설정해주었기 때문에 router의 경로를 /profile, /about 등으로 설정해주어야 한다. 
// 만약, app.js에서 app.use('/user/', pageRouter)로 설정되어 있으면 router의 경로를 /user/profile, /user/about 등으로 설정해줄 수 있다. 근데 여기서는 /만 있음 페이지 경로도 따라서 /profile, /user 등등이 됨 


const express= require('express');
const { Post, User } = require('../models');
const { renderString } = require('nunjucks');

const router = express.Router();

router.use((req,res, next) => {
    res.locals.user = req.user;
    //req.user ? :로그인을 한 경우
    res.locals.followerCount =  req.user ? req.user.Follwers.length:0; //mainhtml에 들어가는 요소들 그대로 가져와서 적어주어야 한다. 
    res.locals.followingCount = res.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    next();

});

// 라우터와 클라이언트 페이지의 연결 
router.get('/profile', (req,res) =>{
    res.render('profile', {title : '내 정보 - NodeBird'});
    // /profile 경로를 따라오면 profile이라는 이름의 페이지를 보여준다. 
});

router.get('/join', (req,res) =>{
    res.render('join', {title : '회원가입 - NodeBird'});
    // /join 경로를 따라오면 join이라는 이름의 페이지를 보여준다. 
})

router.get('/', async (req,res,next) =>{
   try {
    
    const posts = await Post.findAll({
        include : {
            //게시글의 작성자
            model : User,
            attirbytes : ['id', 'nick'],
        },
        order : [['createdAt', 'DESC']],
    });
    res.render('main', {
        title : 'NodeBird',
        twits : posts,
        user : req.user,
    });
   } catch (err) {
    console.error(err);
    next(err);
   }

});

//해쉬태그 검색 페이지기 때문에 page.js에 추가해준다. 

//GET /hashtag?hashtag=검색해쉬태그
router.get('/hashtag', async(req, res ,next) => {
    const query = decodeURIComponent(req.query.hashtag);
    if(!query) {
        return res.query.redirect('/');
    }
    try {
        const hashtag = await Hashtag.findOne({where : {title :query}});
        let posts = [];
        // 게시글의 작성자도 받아줘
        if (hashtag) {
            posts = await hashtag.getPost({include : [{model : User, attributes : ['id', 'nick']}]});
            //attributes : 프론트로 보낼 때 필요한 속성들만 보내줌 
        }

        return res.render('main', {
            title : '${query} | NodeBird',
            twits : posts,
        });
    } catch(error) {
        console.error(error);
        return next(error);
    }
})

module.exports = router;

