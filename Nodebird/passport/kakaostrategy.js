// 카카오톡으로 로그인하는 방법 정의
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports =() =>{
    passport.use(new kakaoStrategy({
        clientID : process.env.KAKAO_ID,
        callbackURL : '/auth/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) =>{
        console.log('kakao profile', profile);
        try {
            const exUser = await User.findOne({
                where : {snsId : profile.id, provider : 'kakao'},
            });
            if (exUser) {
                done(null, exUser);
            } else {
                const newUser = await User.create({
                    email : profile._json && profile._json.kakao_accout_email,
                    nick : profile.displayName,
                    snsId : profile.id,
                    provider : 'kakao',

                });
                done(null, newUser);
            } 
            } catch (error) {
                console.error(error);
                done(error);
            }
    }));
};

//화면 보고 아이패드에 그려서 동작 과정 확인하기 