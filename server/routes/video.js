const express   = require('express');
const router    = express.Router();
const multer    = require('multer');                                    // 파일을 저장하게 해주는 모듈
const path      = require('path');
const ffmpeg    = require('fluent-ffmpeg');
const { Video } = require('../models/Video');


const storage = multer.diskStorage({
    // 어디에 저장할지
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');   
    },

    // 파일의 이름
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);             // 1220013091339_hello
    }
});

// 필터 
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    
    if (ext === '.mp4') return cb(null, true);

    cb(new Error('only mp4 is allowed'));
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');


// 클라이언트에서 가져온 비디오를 서버에 저장한다
router.post('/uploadfiles', (req, res) => {
    
    upload(req, res, (err) => {
        if(err) return res.json({ videoUploadSuccess: false, err });
        
        // filePath은 업로드하는 폴더명을 클라이언트에 보내준다
        return res.json({ videoUploadSuccess: true, filePath: res.req.file.path, filename: res.req.file.filename });
    });
});


// 썸네일을 생성하고 비디오 러닝타임 가져오기
router.post('/thumbnail', (req, res) => {

    // filePath에는 유저가 추가한 비디오 파일의 폴더명이 들어있다
    const { filePath } = req.body;
    let fileDuration;
    let thumbsFilePath;
    
    // 비디오 정보 가져오기
    ffmpeg.ffprobe(filePath, (err, metadata) => {
        fileDuration = metadata.format.duration;
    });
    
    // uploads폴더에 저장된 파일의 경로를 넣는다
    ffmpeg(filePath)

     // 파일 이름을 생성한다
     .on('filenames', (filenames) => {
        console.log(`will generate ${filenames.join(', ')}`);
        console.log(`file name - ${filenames}`);

        thumbsFilePath = `server/uploads/thumbnails/${filenames[0]}`
     })

      // filenames 구역이 끝난 뒤 마지막으로 실행되는 함수 
     .on('end', () => {
        console.log('Screenshots taken');
        return res.json({ thumbnailSuccess: true, thumbsFilePath: thumbsFilePath, fileDuration: fileDuration});
     })

     // 에러가 발생시 실행되는 곳
     .on('error', (err) => {
        console.error('에러발생!! ㅜㅜ' + err);
        return res.json({ thumbnailSuccess: false, err })
     })

     // 옵션기능
     .screenshots({
        count:    3,                                                        // 3개의 썸네일을 찍을 수 있다
        folder:   path.join(__dirname, '..', 'uploads/thumbnails'),         // 업로드 폴더안에 섬네일 폴더안에 섬네일이 저장된다
        size:     '320x240',                      
        filename: 'thumbnail-%b.png'                                        // 파일 이름은 썸네일-원본이름.png 이다. %b는 베이스네임을 입력한다
     });
});


// 저장할 비디오를 셋업한다
router.post('/setup', (req, res) => {
    
    const video = new Video(req.body);
    video.save((err, data) => {
        if(err) return res.json({ videoSetupSuccess: false, err });

        return res.json({ videoSetupSuccess: true });
    });
});


// 비디오 컬렉션안에 있는 모든 비디오를 가져온다. 유저는 하나만 가져와야하기에 findOne이다
router.get('/getVideos', (req, res) => {

    Video.find()
         .populate('writer')                    // 파퓰레이트를 해줘야 가져올 수 있다. 해주지 않으면 write의 id만 가져올 수 있다
         .exec((err, videos) => {               // 가져온 것들을 반환해준다
            if(err) return res.status(400).send(err);
           
            res.status(200).json({ getVideosSuccess: true, videos });        
        });                      
});


router.post('/getVideoDetail', (req, res) => {

    let views = 0;

    Video.findOne({ '_id': req.body.videoId })
         .populate('writer')
         .exec((err, video) => {
            if(err) return res.status(400).send(err);
            views = video.views;          
            res.status(200).json({ getVideoSuccess: true, video }); 
            
            Video.findOneAndUpdate({ '_id': req.body.videoId }, { 'views': views + 1 })
                 .exec((err, result) => {
                    if(err) return res.status(400).send(err);                                                    
                 });
         });
});


router.post('/getVideoSubscribe', (req, res) => {
    Video.findOne({ '_id': req.body.videoId })
         .populate('writer')
         .exec((err, video) => {
            if(err) return res.status(400).send(err);

            res.status(200).json({ getSubscribeFlag: true, views: video.views});
         });   
});


router.post('/deleteVideo', (req, res) => {
    Video.findOneAndDelete({ '_id': req.body.videoId })
         .exec((err, result) => {
            if(err) return res.status(400).send(err);

            res.status(200).json({ deleteVideoSuccess: true, result });
         });
});


module.exports = router;