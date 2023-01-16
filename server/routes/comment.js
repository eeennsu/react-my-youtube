const express     = require('express');
const router      = express.Router();
const { Comment } = require('../models/Comment');

router.post('/saveComment', (req, res) => {
    
    const comment = new Comment(req.body);
    comment.save((err, comment) => {
        if(err) return res.status(400).json({ saveCommentSuccess: false, err });
        // 저장한 댓글에 대한 전체 정보를 가져온다 (writer의 이름, 이미지등)
        Comment.findOne({ '_id': comment._id })
               .populate('writer')
               .exec((err, result) => {
                  if(err) return res.status(400).json({ saveCommentSuccess: false, err });
              
                  return res.status(200).json({ saveCommentSuccess: true, result });  
               }); 
    });   
});

router.post('/getComments', (req, res) => {

    Comment.find({ 'videoId': req.body.videoId })       // 해당 비디오에 등록된 모든 코멘트들을 찾는다
           .populate('writer')                          // 코멘트하나하나의 writer에 대한 정보도 찾도록 해준다
           .exec((err, comments) => {
              if(err) return res.status(400).json({ getCommentsSuccess: false, err });
              
              return res.status(200).json({ getCommentsSuccess: true, comments });
           });           
});


router.post('/deleteComment', (req, res) => {

    Comment.findOneAndDelete({ '_id': req.body.commentId })
           .populate('writer')
           .exec((err, result) => {
                if(err) return res.status(400).send(err);

                res.status(200).json({ deleteCommentSuccess: true, result });
            });
});

module.exports = router;