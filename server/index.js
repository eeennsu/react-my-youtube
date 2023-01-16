const express      = require('express');
const app          = express();
const PORT         = process.env.PORT || 5000;
const mongoose     = require('mongoose');
const bodyParser   = require('body-parser');
const { mongoURI } = require('./config/key');
const cookieParser = require('cookie-parser');
const { USER_SERVER, VIDEO, SUBSCRIBE, COMMENT, LIKE } = require('../client/src/components/Config');


// 정적파일 사용할 수 있도록 설정

app.use('/server', express.static('server'));

app.use(bodyParser.urlencoded({ extended: true }));                    // application/x-www-form-urlencoded를 분석해서 가져와준다
app.use(bodyParser.json());                                            // json타입으로 된 것을 분석해서 가져올 수 있게 해준다
app.use(cookieParser());


mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
 // useCreateIndex: true,
 // useFindAndModify: false,
}).then(() => console.log('MongoDB is connected!!')).catch((e) => console.log(e));



app.use(USER_SERVER, require('./routes/users'));
app.use(VIDEO, require('./routes/video'));
app.use(SUBSCRIBE, require('./routes/subscribe'));
app.use(COMMENT, require('./routes/comment'));
app.use(LIKE, require('./routes/like'));



app.listen(PORT, () => {
    console.log(`Server is connected at ${PORT} port!!`);
});