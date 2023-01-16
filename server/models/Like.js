const mongoose     = require('mongoose');
const { ObjectId } =  mongoose.Schema.Types;
const likeSchema   = mongoose.Schema({
    // 좋아요를 누르는 유저 본인
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    commentId: {
        type: ObjectId,
        ref: 'Comment'
    },
    videoId: {
        type: ObjectId,
        ref: 'Video'
    }
}, { timeStamps: true });

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like };