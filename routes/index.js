const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderMain, renderJoin, renderGood, createGood, renderAuction, bid, renderList,
} = require('../controllers');
// const {Good, Auction, User} = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', async(req,res,next) =>{
    try{
        const goods = await Good.findAll({where : {SoldId : null}})
        res.render('main', {
            title : 'NodeAuction',
            goods,

        });
    } catch(error) {
        console.error(error);
        next(error);
    }
});

router.get('/', renderMain);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/join', isNotLoggedIn, (req,res) =>{
    res.render('join', {
        title : '회원가입 - NodeAuction',

    });
})

router.get('/good', isLoggedIn, renderGood);
router.get('/good' ,isLoggedIn, (req,res)=>{
    res.render('godd', {title : '상품 등록 - NodeAuction'});

})

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/good', isLoggedIn, upload.single('img'), createGood);
router.post('/good', isLoggedIn, upload.single('img', async(req,res,next)=>{
    try {
        const {name, price} =req.body;
        await Good.create({
            OwnerId : req.user.id,
            name,
            img: req.file.filename,
            price,
        });
        res.redirect('/');
    } catch(error) {
        console.error(error);
        next(error);
    }
}))

//입찰상품 페이지 : 로그인 되어있을 경우
router.get('/good/:id', isLoggedIn, async(req,res,next)=>{
  try{
    const [good, auction] = await Promise.all([
      Good.findOne({
        where : {id : req.params.id},
        include :{
          modal : User,
          as :'Owner',
        },
      }),
      Auction.findAll({
        where : {GoodId : req.params.id},
        include : {model : User},
        order : [['bid', 'ASC']]
      })
    ]);
    res.render('auction',{
      title : '${good.name}- NodeAuction',
      good,
      auction,
    });

  }catch(error){
    console.error(error);
    next(error);

  }
})

router.post('/good/:id/bid', isLoggedIn, async(req,res,next)=>{
  try {
    const {bid, msg} = req.body;
    const good = await Good.findOne({
      where :{id : req.params.id},
      include : {model : Auction },
      order : [[{model : Auction}, 'bid', 'DESC']],

    });
    if (good.price >=bid){
      return res.status(403).send('시작 가격보다 높게 입찰해야합니다.');
    }
    if (new Date(good.createAt). valueOf()+())
  }
})

//서버센트 이벤트 : npm i sse socket.io : 서버에서 클라이언트로만 주기적으로 데이터를 보내고, 클라이언트에서는 서버로 데이터를 보낼 수 없음 즉 서버 시간을 주기적으로 크라이언트로 내려보내준다. 실시간 입찰 시 사용한다. 

//메인 페이지에서 보여주는 것들에 대해서 작성해준다.
//메인페이지에서는 내 정보, 상품, 업로드 상품들에 대해서 보여주기 때문에 그것들에대한 요청들이 필요하고 그것들을 정의해놓은 것 
router.get('/good/:id', isLoggedIn, renderAuction);

router.post('/good/:id/bid', isLoggedIn, bid);

router.get('/list', isLoggedIn, renderList);

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderMain, renderJoin, renderGood, createGood, renderAuction, bid, renderList,
} = require('../controllers');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

router.get('/', renderMain);

router.get('/join', isNotLoggedIn, renderJoin);

router.get('/good', isLoggedIn, renderGood);

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
router.post('/good', isLoggedIn, upload.single('img'), createGood);

router.get('/good/:id', isLoggedIn, renderAuction);

router.post('/good/:id/bid', isLoggedIn, bid);

router.get('/list', isLoggedIn, renderList);

module.exports = router;