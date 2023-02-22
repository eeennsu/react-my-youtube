import React, { memo, useCallback, useState }       from 'react';
import { Typography, Button, Form, message, Input } from 'antd';
import { VideoRoot }                                from '../../styled/StyledComponent';
import Dropzone                                     from 'react-dropzone';
import { VideoCameraAddOutlined }                   from '@ant-design/icons';
import axios                                        from 'axios';
import { VIDEO }                                    from '../../Config'
import { useSelector }                              from 'react-redux';
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input;
const { Title } = Typography;



const VideoUploadPage = () => {
    const user = useSelector(state => state.user);              // 스테이트에 가서 유저 스테이트를 가져올 수 있다. user변수에 이제 유저 스테이트정보가 다 담겨있다
    const navigate = useNavigate();

    let accessArr = [
        { value: 0, label: 'Private' },
        { value: 1, label: 'Public'  },      
    ];
    let categoryArr = [
        { value: 0, label: 'Film & Animation' },
        { value: 1, label: 'Autos & Vehicles'  },   
        { value: 2, label: 'Music'  },  
        { value: 3, label: 'Pets & Animals'  },  
        { value: 4, label: 'Sprots'  },  
    ];

    const [videoTitle, setVideoTitle] = useState('');
    const [videoDisc, setVideoDisc]   = useState('');
    const [privacy, setPrivacy]       = useState(0);                                // 0 - private, 1 - public
    const [category, setCategory]     = useState('Film & Animation');
    const [filePath, setFilePath]     = useState('');                               // 업로드한 파일의 경로
    const [duration, setDuration]     = useState('');                               // 업로드한 파일의 재생 시간
    const [thumbPath, setThumbPath]   = useState('');

    const thumbnail = useCallback(({ getRootProps, getInputProps }) => {
        return (
            <div style={{ width: '290px', height: '240px', border: '1px solid lightgray', 
                display: 'flex', alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                    <input {...getInputProps()} />            
                    <VideoCameraAddOutlined style={{ fontSize: '3rem' }} />        
            </div>
        ); 
    }, [Dropzone]); 
 
    const handVideoTitle = useCallback((e) => {
        setVideoTitle(e.currentTarget.value);
    }, [videoTitle]);
    
    const handVideoDisc = useCallback((e) => {
        setVideoDisc(e.currentTarget.value);
    }, [videoDisc]);

    const handPrivacy = useCallback((e) => {
        setPrivacy(e.currentTarget.value);
    }, [privacy]);

    const handCategory = useCallback((e) => {
        setCategory(e.currentTarget.value);
    }, [category]);

    // 1. 노드 서버에 파일을 저장하기 위해 Dependency를 먼저 다운로드
    // 2. 비디오 파일을 서버에 보낸다
    // 3. 받은 비디오 파일을 서버에 저장
    // 4. 파일 저장 경로를 클라이언트에 전달해준다
    const onDrop = useCallback((files) => {
        // 이들을 같이 보내줘야 오류가 생기지 않는다
        let formData = new FormData;
        const config = {
            header: { 'content-type': 'multipart/form-data' },
        };
        formData.append('file', files[0]);                          // 폼의 데이터에 추가

        const response = async () => {
            const result = await axios.post(`${VIDEO}/uploadfiles`, formData, config);
            const { videoUploadSuccess, filePath, filename } = result.data;
            console.log(result.data);
            if(videoUploadSuccess){
                console.log(result.data);
                setFilePath(filename);

                const value = {
                    filePath: filePath, 
                    filename: filename 
                };

                const result2 = await axios.post(`${VIDEO}/thumbnail`, value);
                const { thumbnailSuccess, thumbsFilePath, fileDuration  } = result2.data;

                if(thumbnailSuccess){
                    console.log(result2.data);
                    setThumbPath(thumbsFilePath);
                    setDuration(fileDuration);
                } else {
                    alert('generate thumbnail failed..');
                }
            } else {
                alert('file upload faild..');
            }
        }

        response();      
    }, [filePath, duration, thumbPath]);

    const onSubmitVideo = useCallback((e) => {
        e.preventDefault();

        const value = {
            writer: user.userData._id,                               // 리덕스를 통해 유저 아이디를 가져온다
            title: videoTitle,
            description: videoDisc,
            privacy: privacy,
            filePath: filePath,
            category: category,
            duration: duration,
            thumbnail: thumbPath,
        };

        axios.post(`${VIDEO}/setup`, value)
             .then((res) => {
                if(res.data.videoSetupSuccess){
                    console.log(res.data);
                    message.success('video setup successed!!');
                    setTimeout(() => {
                        navigate('/')
                    }, 1000);
                    
                } else {
                    alert('video setup failed..');
                }
             });
    }, [user, videoTitle, videoDisc, privacy, filePath, category, duration, thumbPath]);



    return (    
        <VideoRoot>
            <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload</Title>
            </div>
            <Form onSubmit={onSubmitVideo}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* Drop zone */}
                    <div style={{ background: 'white', borderRadius: '2rem',  }}>
                         {/* onDrop은 적용할 함수, 멀티플은 여러개가 가능한지, maxSize는 최대크기 */}
                        <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000000}>  
                            {thumbnail}
                        </Dropzone>    
                    </div>                                 
                    {/* Thumbnail */}
                    {
                       thumbPath &&  <div>
                                         <img src={`http://localhost:5000/${thumbPath}`} alt='thumbnail' style={{borderRadius: '2rem', width: '290px', height: '240px'}}/>
                                     </div> 
                    }                   
                </div>           
                <br />
                <br />
                <label>Title
                    <Input onChange={handVideoTitle} value={videoTitle}/>
                </label>
                <br />
                <br />
                <label>Description
                    <TextArea onChange={handVideoDisc} value={videoDisc}/>
                </label>
                <br />
                <br />
                <select onChange={handPrivacy} value={privacy}>
                   {accessArr.map((v, i) => <option value={v.value} key={`접근옵션-${i}`}>{v.label}</option>)}
                </select>
                <br />
                <br />
                <select onChange={handCategory}>          
                  {categoryArr.map((v, i) => <option value={v.value} key={`카테고리옵션-${i}`}>{v.label}</option>)}                   
                </select>
                <br />
                <br />
                <Button type='primary' size='large' onClick={onSubmitVideo}>
                    Submit
                </Button>
            </Form>
        </VideoRoot>
    );
};

export default VideoUploadPage;