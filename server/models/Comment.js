const mongoose   = require('mongoose');
const { Schema } = mongoose;

// 작성자, 비디오의 아이디, 답글을 달 때 타겟의 아이디, 댓글 내용
const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        maxlength: 500
    }
}, { timeStamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment };