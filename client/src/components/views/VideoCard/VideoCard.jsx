import React, { memo, useCallback } from 'react';
import { Card, Avatar, Col }        from 'antd';
import moment                       from 'moment';

const { Meta } = Card;

const VideoCard = memo(({ video, index }) => {
    let hour = Math.floor(video.duration / 60 / 60);
    let min = Math.floor(video.duration / 60);
    let sec = Math.floor((video.duration - min * 60));
    sec = sec < 10 ? `0${sec}` : sec;         
    const timeFormat = useCallback(() => hour < 1 ? `${min}:${sec}` : `${hour}:${min}:${sec}`, [video.duration]);
   
    return (
        <Col lg={6} md={8} xs={24}>
            <a href={`/video/${video?._id}`}>
                <div style={{ position: 'relative' }}>
                    <img style={{ width: '96%', borderRadius: '20px' }} src={`http://localhost:5000/${video?.thumbnail}`} alt="thumbnail" />
                    <div className='duration'>
                        <span>{timeFormat()}</span>                                
                    </div>
                </div>
            </a>
            <br />
            <Meta avatar={<Avatar src={video.writer.image}/>} title={video.title} description='' />
            <span>{video.writer.name}</span>
            <br />
            <span style={{ marginLeft: '3rem', color: 'palevioletred' }}>{video.views} views</span> 
            <br />
            <span style={{ marginLeft: '3rem' }}>Created At - </span>
            <span>{moment(video.createdAt).format('YY / MM / DD')}</span>
        </Col>
    );
});

export default VideoCard;