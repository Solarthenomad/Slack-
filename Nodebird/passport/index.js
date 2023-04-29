// passport는 passport 설정을 해준다. 
const passport = require('passport');
const local = require('./localstrategy');
const kakao = require('./kakaostrategy');
const User = require('../models/user');

module.exports=() =>{
    passport.serializeUser((user, done) =>{
        //세션에 user.id만 저장함 만약 user 정보 전체를 저장하고 싶다면 null, user로 인자로 받으면 된다. 
        done(null, user.id);

    });

    // {id : 3, 'connect.sid : s%242353524 세션의 쿠키는 connect.sid}

    //유저 정보 복구 : deseializeUser
    passport.deserializeUser((id, done) =>{
        User.findOne({
            where : {id},
            include : [{
                model : Post,  //내가 쓴 포스트 글 가져오기 
            },{
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followers',

            }, {
                model : User,
                attributes : ['id', 'nick'],
                as : 'Followings',
            }],
        })
        .then(user => done(null, user)).catch(err => done(err));

    });

    local();
    kakao();
};