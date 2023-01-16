const mongoose      = require('mongoose');
const { ObjectId }  = mongoose.Schema.Types;
const dislikeSchema = mongoose.Schema({
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

const Dislike = mongoose.model('Dislike', dislikeSchema);


module.exports = { Dislike };