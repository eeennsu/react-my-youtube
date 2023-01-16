const express     = require('express');
const router      = express.Router();
const { Like }    = require('../models/Like');
const { Dislike } = require('../models/Dislike');


function getVariable(videoId, commentId, userId) {
    if(videoId){
        return { 'videoId': videoId, 'userId': userId }
    }

    return { 'commentId': commentId, 'userId': userId }
}


router.post('/getLikes', (req, res) => {

    function getData(){
        return req.body.videoId ? { videoId: req.body.videoId } : { commentId: req.body.commentId };
    }

    Like.find(getData())
        .exec((err, likes) => {
            if(err) return res.json(400).send(err);

            res.status(200).json({ getLikeSuccess: true, likes })
        });
});

router.post('/getDislikes', (req, res) => {

    function getData(){
        return req.body.videoId ? { videoId: req.body.videoId } : { commentId: req.body.commentId };
    }

    Dislike.find(getData())
        .exec((err, dislikes) => {
            if(err) return res.json(400).send(err);

            res.status(200).json({ getDislikeSuccess: true, dislikes })
        });
});

router.post('/upLike', (req, res) => {
   
    const result = getVariable(req.body.videoId, req.body.commentId, req.body.userId);
    const like = new Like(result);

    // like 컬렉션에 정보를 넣어준다
    like.save((err, likeData) => {
        if(err) return res.status(400).json({ upLikeSuccess: false, err });


        // 만약 disLike이 이미 클릭되어 있다면 DisLike를 1 줄여준다
        Dislike.findOneAndDelete(result)   
                .exec((err, dislikeResult) => {
                    if(err) return res.status(400).json({ upLikeSuccess: false, err });  

                    res.status(200).json({ upLikeSuccess: true });
                });
    });     
});



router.post('/cancelLike', (req, res) => {
    
    Like.findOneAndDelete(getVariable(req.body.videoId, req.body.commentId, req.body.userId))
        .exec((err, result) => {
            if(err) return res.status(400).json({ cancelLikeSuccess: false, err });
   
            res.status(200).json({ cancelLikeSuccess: true });
        });
});



router.post('/upDislike', (req, res) => {

    const result = getVariable(req.body.videoId, req.body.commentId, req.body.userId);
    const dislike = new Dislike(result);

    // Dislike 컬렉션에 정보를 넣어준다
    dislike.save((err, dislikeData) => {
        if(err) return res.status(400).json({ upDislikeSuccess: false, err });

        // 만약 disLike이 이미 클릭되어 있다면 Like를 1 줄여준다
        Like.findOneAndDelete(result)   
               .exec((err, dislikeResult) => {
                   if(err) return res.status(400).json({ upDislikeSuccess: false, err });  

                   res.status(200).json({ upDislikeSuccess: true });
               });
    });  
});


router.post('/cancelDislike', (req, res) => {    
    Dislike.findOneAndDelete(getVariable(req.body.videoId, req.body.commentId, req.body.userId))
           .exec((err, data) => {
                if(err) return res.status(400).json({ cancelDislikeSuccess: false, err });
                res.status(200).json({ cancelDislikeSuccess: true });
            }); 
});





module.exports = router;