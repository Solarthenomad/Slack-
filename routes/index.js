const express = require('express');
const { renderLogin, createDomain } = require('../controllers');
const {v4 : uuidv4} = require('')
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/', renderLogin);


router.post('/domain', isLoggedIn, async(req, res, next) =>{
    try {
        await Domain.create({
            UserId : req.user.id,
            host : req.body.host,
            type : req.body.type,
            clientSecrete: UUIDV4(),
            //clientSecrete은 똑같은 키를 실수로 반복적으로 발급되는 것을 방지하기 위한 검사도구 
        });
        res.redirect('/');
    } catch(err) {
        console.error(err);
        next(err);
    }
})

router.post('/domain', isLoggedIn, createDomain);

module.exports = router;