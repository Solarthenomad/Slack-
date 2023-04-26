const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedin, isNotLoggedIn} = require('./middlewares');

//라우터 만들기 
const router = express.Router();

// 회원가입 라우터 만들기
router.post('/join', isNotLoggedIn, async(req, res,next) =>{
    //프론트엔드에서 이메일, 닉네임, 비밀번호를 보내준다.
    const {email, nick, password} = req.body;
    try {
        // 기존가입자가 있는지 검사해주기 
        const exUser = await User.findOne({where : {email}});
        if(exUser){
            //만약 기존 가입자가 있다면 join /error=exit페이지로 이동시키기 + error는 프론트엔드 페이지로 만들기 
            return res.redirect('/join?error=exit');
        }
        const hash = await bcrypt.hash(password, 12);  //bcrypt 해쉬화해서 비밀번호를 저장하는데, 강도는 12이다. 
        //회원가입시키기 
        await User.create({
            email,
            nick,
            password : hash,
        });
        return res.redirect('/');
    }catch(error){

    }
});

//프론트에서 로그인을 누를 때, 이 부분이 실행되는데, local까지 실행된다. -> localstrategy.js로 이동하게 됨 
router.post('/login', (req, res, next) =>{
    passport.authenticate('local', (authError,user, info) =>{
        if(authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.redirect('/?loginError=${info.message}');
            
        }
        return req.login(user, (loginError) =>{
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res,next); //미들웨어 내의 미들웨어에는 (req, res, next)를 붙여준다. = 미들웨어를 확장하는 패턴 
});


module.exports = router;