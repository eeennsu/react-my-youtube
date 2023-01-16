const express  = require('express');
const router   = express.Router();
const { User } = require('../models/User');
const { auth } = require('../middleware/auth');
 


router.get('/auth', auth, (req, res) => {
    // auth가 잘 넘어 올 때 실행되는 로직이다
    const { _id, email, name, lastname, role, image } = req.user;
    res.status(200).json({ 
        isAdmin: role === 0 ? false : true,
        isAuth: true,
        _id: _id, 
        email: email,
        name: name,
        lastname: lastname,
        role: role,
        image: image,
    });
});


router.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다
    const user = new User(req.body);
    
    // mongodb에서 선언된 함수 save이다. 저장되기 전에 유저 정보의 암호화가 진행되어야 한다
    user.save((err, data) => {
        if(err) {
            return res.json({ registerSuccess: false, err });
        }

        return res.status(200).json({
            registerSuccess: true,
        }); 
    });
});


router.post('/login', (req, res) => {
    const { email, password } = req.body;

    // 요청된 이메일을 데이터베이스에서 있는지 검사한다. findOne은 mongoDB에서 제공하는 메소드이다
    User.findOne({ email: email }, (err, user) => {
        if(!user){            
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.',
            });
        }

        // 요청된 이메일이 데이터베이스에 있다면 비밀번호까지 일치하는 지 확인한다
        user.comparePassword(password, (err, isMatch) => {
        //  if(err) return res.status(400).json({ loginSuccess: false, message: err });
            if(!isMatch){
                return res.json({ 
                    loginSuccess: false,
                    message: '비밀번호가 틀렸습니다.' 
                });
            }

            // 비밀번호까지 맞다면 쿠키에 쓰일 용도인 토큰을 생성한다
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                if(user){
                    res.cookie('x_auth', user.token)
                     .status(200)
                     .json({
                        loginSuccess: true,
                        userId: user._id,
                    });
                }
            });
        });
    });   
});


// 로그인된 상태이기 때문에 auth를 넣어준다
router.get('/logout', auth, (req, res) => {
    const { _id } = req.user;

    // 첫번째 인자는 찾으려는 것, 두번 째 인자는 업데이트 내용
    User.findOneAndUpdate({ _id: _id }, { token: '' }, (err, user) => {
        if(err) res.json({ logoutSuccess: false, err });       
        
        return res.status(200).json({
            logoutSuccess: true,
        });
    });
});

module.exports = router;