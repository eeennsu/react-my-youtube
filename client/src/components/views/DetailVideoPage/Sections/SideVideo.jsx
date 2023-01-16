import React, { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import axios            from 'axios';
import { useNavigate }  from 'react-router-dom';
import { VIDEO }        from '../../../Config';

const SubSpan = ({ children }) => {
    return (
        <span style={{ color: 'peru', fontWeight: '500' }}>
            {children}
        </span>
    );
};

const SideVideo = memo(({ selected }) => {
    const navigate = useNavigate();
    const [sideVideos, setSideVideos] = useState([]);
    const renderCards = useRef();

    useEffect(() => {
        axios.get(`${VIDEO}/getVideos`)
             .then((res) => {
                const { getVideosSuccess, videos } = res.data;
                if(getVideosSuccess && videos){
                    setSideVideos(videos);
                } else {
                    alert('다른 비디오 가져오기에 실패했습니다. 다시 접속해주세요');
                    navigate('/');
                }
             });
    }, []);

    useMemo(() => {
        renderCards.current = sideVideos.map((v, i) => {
            if(v._id === selected?._id) return;

            let hour = Math.floor(v?.duration / 60 / 60);
            let min = Math.floor(v?.duration / 60);
            let sec = Math.floor((v?.duration - min * 60));          
            let timeFormat = () => hour < 1 ? `${min}:${sec}` : `${hour}:${min}:${sec}`;
            
            return (
                <div style={{ display: 'flex', marginBottom: '1rem', padding: '0 2rem' }} key={`${i}sideVideo`}>
                    <div style={{ width: '40%', marginBottom: '1rem' }}>
                        <a href={`/video/${v._id}`}>
                            <img src={`http://localhost:5000/${v?.thumbnail}`} alt='Side Video' style={{ width: '98%', borderRadius: '6px' }}/>
                        </a>
                    </div>
                    <div style={{ width: '55%', marginLeft: '10px' }}>
                        <a href={`/video/${v._id}`}>
                            <span style={{ fontSize: '1rem', color: 'black', fontWeight: '1000' }}>{v?.title}</span>
                            <br />
                            <span><SubSpan>Writer : </SubSpan>{v?.writer.name}</span>
                            <br />
                            <span><SubSpan>Views : </SubSpan>{v?.views}</span>
                            <br />
                            <span><SubSpan>Time : </SubSpan>{timeFormat()}</span>  
                        </a>                  
                    </div>
                </div>
            );
        });
    }, [renderCards.current, sideVideos]);

    return (
        <Fragment>
            {renderCards.current || ''}
        </Fragment>
    )   
});

export default SideVideo;