/* 
    모델은 몽고 디비에서 데이터를 저장하는 형태를 뜻한다.
    스키마는 데이터 형태에 대한 세팅이다
*/
const mongoose   = require('mongoose');
const bcrypt     = require('bcrypt');                                      // 유저 정보 암호화에 사용되는 모듈이다
const saltRounds = 10;                                                 // 암호화된 문자의 길이
const jwt        = require('jsonwebtoken');
const TOKEN_KEY  = 'secretToken';
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,                                 // 공백을 없애준다
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {                                        // 쿠키에 사용되는 토큰
        type: String,
    },
    tokenExp: {                                     // 토큰 유효 기간
        type: Number,
    }
});


// 유저 모델의 save함수가 실행되기 전에 먼저 이 부분이 실행되는 로직이다
userSchema.pre('save', function(next) {
    let user = this;
    
    // 여기서 대비해야할 점이 있다. 이메일을 바꿀 때는 다시 한번 비밀번호 암호화가 이루어져 오류가 발생한다. 
    // 때문에 암호화에 있어서 비밀번호가 변환될 때만 암호화를 진행하는 것으로 한다
    if(user.isModified('password')){
        // 비밀번호의 암호화를 진행한다
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err);                        // 에러가 발생한 순간 next 콜백함수에 에러를 전달한다

            // 암호화를 진행한다. hash 인자에는 암호화에 성공한 비밀번호가 담겨있다
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err);

                user.password = hash;                        // 암호화에 성공하면 암호화된 암호로 비밀번호를 교체한다
                return next();
            });                           
        });
    } else {
        next();
    }   
});


userSchema.methods.comparePassword = function(plainPassword, next){
    // plainPassword 가 1234567이면, mongoDB에 저장되어있는 비번은 암호화를 했기에 잡문자가 들어있다.
    // 비교하기 위해선 plainPassword 역시 암호화를 진행한뒤 비교하는 bycrpt.compare()함수를 이용한다
    let user = this;
    bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
        if(err) return next(err);
        next(null, isMatch);
    });
};


userSchema.methods.generateToken = function(next){
    let user = this;

    // jsonwebtoken을 이용해 토큰을 생성한다
    let token = jwt.sign(user._id.toHexString(), 'secretToken');   // user_id + 'secretToken' = token;
    user.token = token;

    user.save((err, user) => {
        if(err) return next(err);

        next(null, user);
    });  
}


userSchema.statics.findByToken = function(token, next) {  
    let user = this;
  
    // 토큰을 decode (복호화) 한다
    jwt.verify(token, 'secretToken', (err, decoded) => {  

        user.findOne({ '_id': decoded, 'token': token, }, (err, user) => {
            if(err) return next(err);

            next(null, user);
        });
    });
};


const User = mongoose.model('User', userSchema);

module.exports = { User, TOKEN_KEY };