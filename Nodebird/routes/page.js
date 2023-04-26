


// app.js에서 app.use('/', pageRouter);로 설정해주었기 때문에 router의 경로를 /profile, /about 등으로 설정해주어야 한다. 
// 만약, app.js에서 app.use('/user/', pageRouter)로 설정되어 있으면 router의 경로를 /user/profile, /user/about 등으로 설정해줄 수 있다. 근데 여기서는 /만 있음 페이지 경로도 따라서 /profile, /user 등등이 됨 


const express= require('express');

const router = express.Router();

router.use((req,res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
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

router.get('/', (req,res,next) =>{
    const twits = [];  //지금은 게시물이 없으니까 빈 배열 여기서 twits는 메인에서 보여줄 twiting
    res.render('main', {
        title : 'NodeBird',
        twits,
        // /경로를 따라오면 main이라는 이름의 페이지를 보여준다. 
    });

});

module.exports = router;

