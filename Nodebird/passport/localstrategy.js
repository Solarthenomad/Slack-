// 회원가입할 때 적은 정보로 로그인하는 방법 정의 

const passport = require('.');
const User =require('../models/user');

module.exports =() =>{
    passport.use(new localStorage({
        usernameField : 'email', //req.body.email
        passportField : 'password', //req.body.password,
        // password, email은 아래의 email과 password와 일치해야지 async로 받아올 수있다. 

    }, async(email, password , done)=>{
        try {
            // 에매일 가진 사람있나 찾아보기 
            const exUser = await User.findOne({where :{email}});
            if (exUser) {
                // 만약 기존 회원가입 있는 사람이라면
                const result = await bcrypt.compare(password, exUser.password);
                // 이 사람이 입력한 비밀번호와 db 안의 비밀번호가 동일한지 확인한다. 
                if (result) { //비밀번호 일치할 때 
                    done(null, exUser);
                } else {
                    done(null, false, {message : '비밀번호가 일치하지 않습니다.'});
                }
            } else {
                done(null, false, {message : '가입되지 않은 회원입니다.'});
                //done은 세개의 인자를 받는데, 첫 번째는 서버 에러(null) 두 번째는 로그인 성공실패 여부(false/exUser), 마지막은 로그인 실패시 메세지를 넣어준다.
            }
        } catch (error) {
            console.error(error);
            done (error);
        }
    }))
}