const mongoose = require('mongoose');


// db저장용 비디오 스키마를 몽구스 컬렉션에 생성한다
const videoSchema = mongoose.Schema({
    writer: {                                            // 올리는 사람 (user)
        type: mongoose.Schema.Types.ObjectId,            // 유저의 오브젝트 아이디를 타입에 넣어준다
        ref: 'User'                                      // User 모델을 참조하여 모든 정보를 가져올 수 있다
    },
    title: {                                             // 제목
        type: String,
        maxlength: 50
    },
    description: {                                       // 설명
        type: String,
        maxlength: 200
    },
    privacy: {                                           // 공개 여부
        type: Number
    },
    filePath: {                                          // 동영상 경로
        type: String
    },
    category: {                                          // 카테고리
        type: String  
    },
    views: {                                             // 조회수
        type: Number,
        default: 0
    },
    duration: {                                          // 재생 시간
        type: String
    },
    thumbnail: {                                         // 썸네일 이미지
        type: String
    }
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };