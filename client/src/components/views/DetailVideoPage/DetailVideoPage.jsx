import React, { useEffect, useMemo, useState, memo, useCallback } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import { COMMENT, VIDEO } from '../../Config';
import { useNavigate, useParams } from 'react-router-dom';
import SideVideo        from './Sections/SideVideo';
import Subscribe        from './Sections/Subscribe';
import Comment          from './Sections/Comment';
import LikeDislike      from './Sections/LikeDislike';
import { useSelector }  from 'react-redux';
import Delete           from './Sections/Delete';
import LoadingComponent      from '../LoadingComponent/LoadingComponent';

const { Item } = List;

const DetailVideoPage = () => {
    const { userData } = useSelector(state => state.user);
    const navigate = useNavigate();
    const params = useParams();
    const [detailVideo, setDetailVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [views, setViews] = useState(0);
    const userId = useMemo(() => {
        return localStorage.getItem('userId');
    }, []);
     
    useEffect(() => {
        async function fetchData(){
            const response = await axios.post(`${VIDEO}/getVideoDetail`, params);
            const { getVideoSuccess, video } = response.data;

            if(getVideoSuccess && video){
                setDetailVideo(video);
                setViews(video.views + 1);
            } else {        
                alert('비디오 가져오기에 실패하였습니다. 관리자에게 문의해주세요');
                navigate('/');
            }   

            const response2 = await axios.post(`${COMMENT}/getComments`, params);
            const { getCommentsSuccess, comments } = response2.data;    

            if(getCommentsSuccess){      
                setComments(comments);
            } else {               
                alert('댓글들의 정보를 가져올 수 없습니다');
            } 
        }

        fetchData();
    }, []);

    const subscribeAction = useMemo(() => {
        return (userData?.isAuth && detailVideo?.writer._id !== userId) && <Subscribe userTo={detailVideo?.writer && detailVideo?.writer._id} userFrom={userId} />
    }, [userData, detailVideo, userId, Subscribe]);

    const viewsAction = useMemo(() => {
        return `${views}views`;
    }, [views]);

    // 댓글 작성 / 삭제 관련 다시 리프레시 하는 구역
    const refresh = (newComments, deleteComments = null) => {
        if(!deleteComments){                                  // 새 댓글 작성 시                            
            setComments(state => state.concat(newComments));

        } else {                                              // 댓글 삭제 시
          //  setComments(state => state.splice(state.indexOf(deleteComments), 1));
            setComments(state => {
                let arr = [...state];
                let index = state.findIndex((v) => v?._id === deleteComments?._id);
                delete arr[index];
                return arr;
            });
        }        
    };

    return (       
        <Row gutter={[16, 16]} style={{ padding: '3rem 3rem' }}>
            <Col lg={18} xs={24}>
                <div style={{ width: '100%' }}>
                    <video style={{ width: '100%', borderRadius: '7px' }} src={detailVideo?.writer && `http://localhost:5000/server/uploads/${detailVideo?.filePath}`} controls />       
                    {
                        (userData && detailVideo && params && views && comments) ?
                        (<React.Fragment>
                            <Item actions={
                                [ (userData._id === detailVideo?.writer._id) && <Delete videoId={detailVideo._id} />, 
                                viewsAction, 
                                userData.isAuth && <LikeDislike video userId={userId} videoId={params.videoId} isAuth={userData.isAuth}/>, 
                                subscribeAction
                                ]}>
                                <Item.Meta avatar={<Avatar src={detailVideo?.writer.image}/>} title={detailVideo?.writer.name} description={detailVideo?.description} />                            
                            </Item>                        
                            <Comment commentList={comments} userId={userId} videoId={detailVideo._id} refresh={refresh}/>
                        </React.Fragment>) :
                        <LoadingComponent />
                    }
                </div>
            </Col>
            <Col lg={6} xs={24} >
                 <SideVideo selected={detailVideo?.writer} />
            </Col>
        </Row>  
    );
};

export default DetailVideoPage;