const express        = require('express');
const router         = express.Router();
const { Subscriber } = require('../models/Subscriber');
const { Video }      = require('../models/Video');


// 구독자 수 가져오기
router.post('/getSubscribeCount', (req, res) => {

    Subscriber.find({ 'userTo': req.body.userTo })
              .exec((err, subscribes) => {
                  if(err) res.status(400).send(err);

                  res.status(200).json({ getCountSuccess: true, subscribeCount: subscribes.length });
    });
});


// 구독 여부 가져오기
router.post('/getSubscribed', (req, res) => {

    const { userTo, userFrom } = req.body;
    Subscriber.find({ 'userTo': userTo, 'userFrom': userFrom })
              .exec((err, data) => {
                  if(err) return res.status(400).send(err);
                 
                  let result = false;
                  if(data.length !== 0){                    
                    result = true;
                  }                   

                  return res.status(200).json({ getSubscribedSuccess: true, scribed: result })
    });
});


// 구독 하기 (state => state + 1)
router.post('/onSubscribe', (req, res) => {

    const subscriber = new Subscriber(req.body);

    subscriber.save((err, data) => {
        if(err) return res.status(400).json({ onSubscribeSuccess: false });
        console.log('구독했을 땐?');
        console.log(data);
        return res.status(200).json({ onSubscribeSuccess: true, data });
    });
});


router.post('/cancelSubscribe', (req, res) => {

    const { userTo, userFrom } = req.body;
    Subscriber.findOneAndDelete({ 'userTo': userTo, 'userFrom': userFrom })
              .exec((err, data) => {
                if(err) return res.status(400).json({ cancelSubscribeSuccess: false, err });

                return res.status(200).json({ cancelSubscribeSuccess: true, data });
    });
});


router.post('/getSubscriptionVideos', (req, res) => {
    // 자신의 아이디를 가지고 구독하는 사람들을 찾는다. 한개면 하나, 2개이상이면 그만큼의 데이터 개수가 탐색된다
    Subscriber.find({ 'userFrom': req.body.userFrom })
              .exec((err, subscriberInfo) => {              // subscriberInfo에는 구독을 당한 사람들의 유저 아이디가 담겨있다
                  if(err) return res.status(400).json({ getSubVidSuccess: false })

                  // 구독 당한 유저의 아이디를 배열에 넣어준다
                  let subscribedUser = [];
                  subscriberInfo.map((v) => {
                    subscribedUser.push(v.userTo);
                  });

                  // 찾은 사람들의 비디오를 가지고 온다     
                  Video.find({
                    writer: {
                        $in: subscribedUser     // 넘겨받은 값이 배열, 즉 2개 이상이어도, 그 사람들의 아이디를 가지고 값을 찾을 수 있다
                    }
                  }).populate('writer')
                    .exec((err, videos) => {
                        if(err) return res.status(400).send(err);

                        return res.status(200).json({ getSubVidSuccess: true, videos });
                    });
              }); 
});

module.exports = router;