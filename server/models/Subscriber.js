const mongoose   = require('mongoose');
const { Schema } = mongoose;

const subscriberSchema = mongoose.Schema({
    userTo: {                                       // 구독할 다른 유저
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    userFrom: {                                     // 유저 본인
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber };