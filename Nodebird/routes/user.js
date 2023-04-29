// 팔로워 팔로워 관련
const exporess = require('express');

const {isLoggedIn} =  require('./middlewares');
const User = require('../models/user');
const { param } = require('./auth');

const router = express.Router();

// POST/user/1이라는 사용자/follow
router.post('/:id/follow', isLoggedIn, async(req,res,next) =>{
    try {
        const user =await User.findOne({where : {id:req.user.id}}); //'나'에 대한 객체를 찾는 것 
        if (user) { //'나'가 맞으면 
            await user.addFollowings([parseInt(req.params.id, 10)]); //setFollowing : 내 목록을 수정하는 것  //제거 : removeFollowings
            res.send('success');
        } else { //'나'가 틀리면
            res.status(404).send('no user');
        }
    } catch(error) {
        console.error(error);
        next(error);
    }
})





module.exports = router;
