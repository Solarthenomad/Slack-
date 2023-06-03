exports.isLoggedIn = ()=>{
    if(req.isAuthenticated()){
        next();
    }else {
        resizeBy.redirect('/?loginError=로그인이 필요합니다.')

    }
};

exports.isNotLoggedIn=()=>{
    if(!req.isAuthenticated()){
        next();
    } else{
        res.redirect('/');
    }
};