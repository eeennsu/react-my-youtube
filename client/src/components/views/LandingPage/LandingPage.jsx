import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Container_LP } from '../../styled/StyledComponent'
import { Card, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { VIDEO } from '../../Config';
import VideoCard from '../VideoCard/VideoCard';

const { Title } = Typography;

const LandingPage = () => {

    const [videos, setVideos] = useState([]);


    // 몽고디비에 저장된 비디오들을 가져오는 역할을 한다
    useEffect(() => {
        (async () => {
            const response = await axios.get(`${VIDEO}/getVideos`);
            const { getVideosSuccess, videos } = response.data;

            if(getVideosSuccess){
                setVideos(videos)
            } else {
                alert('get videos failed..');
            }
        })(); 
    }, []);    

    return (
        <Container_LP>
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[32, 16]}>
                {videos.map((v, i) => {
                    return <VideoCard video={v} index={i} key={`${i+1}video`}/>
                })}
            </Row>
        </Container_LP>
    );
};

export default LandingPage;