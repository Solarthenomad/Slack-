//require로 라이브러리 받아오기 
const express=  require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
//dotenv는 최대한 위로 올려서 작성해주기(.env 파일 연결해준다는 것 승인해주기)
const morgan = require('morgan')
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const passport = require('passport');

//환경설정은 config
dotenv.config();

//라우터 설정 페이지 서버에 가져오기 
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

const exp = require('constants');
//dotenv보다 밑에 해야지 dotenv 설정의 영향을 받음(쿠키 발행 관련 보안 설정)
const {sequelize} = require('/models');
const passportconfig = 


// app서버는 express 사이드서버렌더링 프레임워크로 구축한다. 
const app =express();

 // 앱 서버 포트 연결 
 app.set('port' , process.env.PORT || 8001); //port는 process.env.PORT 번이나 8001번을 사용한다는 의미임 
 app.set('view engine', 'html') // view 템플릿 : html으로 보여준다. 
 nunjucks.configure('view', {
    express : app,
    watch:true,
 });
 sequelize.sync({force :false}).then(() => {
    console.log('데이터 베이스 연결 성공하였습니다.')
 })  //sequelize 연결
 //models의 sequelize의 sql 설정을 바꾸면 force :true 라고 하면 데이터베이스가 지워졌다가 새로 만들어짐
 // 지워지지 않게 하려면 false를 적어주는 게 좋음 

 // 미들웨어(routes/pages를 연결해주도록 하는 친구들)
 app.use(morgan('dev'));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.json());
 app.use(express.urlencoded({extended : true}));
 app.use(cookieParser(process.env.COOKIE_SECRET));
 app.use(session({
    resave:false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cooki : {
        httpOnly : true,
        secure :false,
    },
 }));

 //세션이 익스프레스 세션으로부터 받아와서 패스토프에서 처리해주는 것이기 때문에 express, express session 설정보다 아래에 있어야 된다. 
app.use(passport, passport.initialize());
app.use(passport.session());
 // page 라우터 뒤에 만들기 
 app.use('/', pageRouter);
 app.use('/auth', authRouter);

 // 404처리 미들웨어 : 라우터가 없으면 404 에러가 뜨고, 라우터를 만들어주어야 한다. 
 app.use((req,res, next) => {
    const error = new Error('${req.method} ${req.url} 라우터가 없습니다.');
    error.status = 404;
    next(error);
 });


 // 에러 미들웨어
 // 무조건 4개의 변수를 사용해야 한다. 
 // next를 안쓴다해도 무조건 넣어주어야 한다. 
 app.use((err, req, res,next)=>{
    res.locals.message = err.message;
    res.locals.error = process.env.
    // production(개발환경설정) 상태일 때 에러가 보이도록 하고, 배포일 때는 안보이게 함 :{}으로 값 없음 처리를 해주었다. 
    NODE_ENV !== 'production'  ? err:{};
    res.status(err.status || 500);
    res.render('error');

    //res.status.render도 가넝함 
 });

 app.listen(app.get('port', () =>{
    console.log(app.get('port'), '번 포트ㅔ서 대기중입니다🤔')

 }))

