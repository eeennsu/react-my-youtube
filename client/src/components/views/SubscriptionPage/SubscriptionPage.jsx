import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios                from 'axios';
import { Row, Typography }  from 'antd';
import { SUBSCRIBE }        from '../../Config';
import VideoCard            from '../VideoCard/VideoCard';
import { useNavigate }      from 'react-router-dom';
const { Title } = Typography;

// 유저가 구독한 모든 사람들의 비디오들을 가져오는 페이지이다
const SubscriptionPage = () => {

    const [subscripteds, setSubscripteds] = useState([]);
    const navigate = useNavigate();

    // 본인의 아이디가 value가 들어가면 된다
    const subscriptionValue = useMemo(() => ({
        userFrom: localStorage.getItem('userId'),
    }), []);

    useEffect(() => {
        const fatchData = async () => {

            const result = await axios.post(`${SUBSCRIBE}/getSubscriptionVideos`, subscriptionValue);
            const { getSubVidSuccess, videos } = result.data;

            if(getSubVidSuccess){
                setSubscripteds(videos);
            } else {
                alert('가져오기에 실패하였습니다 다시 시도해주세요');
                navigate('/');
            }
        };

        fatchData();
    }, []);

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}>Subscribed Videos</Title>
            <hr />
            <Row gutter={[16, 16]}>
                { subscripteds.map((v, i) => {
                    return (
                        <VideoCard video={v} index={i} key={`${i+1}video`}/>
                    )
                }) }
            </Row>
        </div>
    );
};

export default SubscriptionPage;