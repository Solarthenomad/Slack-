//require로 라이브러리 받아오기 
const express=  require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

//환경설정은 config
dotenv.config();

//라우터 설정 페이지 서버에 가져오기 
const pageRouter = require('./routes/page');
const exp = require('constants');


// app서버는 express 사이드서버렌더링 프레임워크로 구축한다. 
const app =express();

 // 앱 서버 포트 연결 
 app.set('port' , process.env.PORT || 8001);
 app.set('view engine', 'html') // view 템플릿 : html으로 보여준다. 
 nunjucks.configure('view', {
    express : app,
    watch:true,
 });

 // 미들웨어(routes/pages를 연결해주도록 하는 친구들)
 app.use(morgan('dev'));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.json());
 app.use(express.urlencoded({extended : false}));
 app.use(cookieParser(process.env.COOKIE_SECRET));
 

