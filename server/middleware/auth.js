const { User } = require('../models/User');

// 로그인 유무, 관리자 / 일반인 인증에 대한 확인을 시켜주는 미들웨어 파일이다
const auth = (req, res, next) => {  

    // 쿠키파서를 통해 클라이언트에서 쿠키를 가져온다
    let token = req.cookies.x_auth;
    
    // 토큰을 복호화한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {       
        if(err) throw err; 
        
        if(!user) {
            return res.json({ isAuth: false, err: true });
        }

        req.token = token;              // 토큰과 
        req.user = user;                // 유저 정보를 넣어준다
        
        // 다음으로 넘어갈 수 있게 콜백함수를 호출한다. 이것이 없으면 이 안에서 끝이다.
        next();
    });

    // 유저가 있으면 인증 true

    // 유저가 없으면 인증 false
};


module.exports = { auth };