import React, { useEffect, useState, useMemo, useCallback  } from 'react';
import { LikeOutlined, DislikeOutlined, LikeTwoTone, DislikeTwoTone } from '@ant-design/icons'
import axios        from 'axios';
import { message, Tooltip }  from 'antd';
import { LIKE }     from '../../../Config';


const LikeDislike = ({ video, comment, userId, videoId, commentId, isAuth }) => {

    const [likeCount, setLikeCount]       = useState(0);
    const [isLike, setIsLike]             = useState(false); 
    const [dislikeCount, setDislikeCount] = useState(0);
    const [isDislike, setIsDislike]       = useState(false);

    const variable = useMemo(() => {
        if(video){
           return {
                userId: userId,
                videoId: videoId,
            };
        } 
        
        return {
            userId: userId,
            commentId: commentId,
        };
    }, [userId, videoId, commentId]);

    useEffect(() => {
        
        (async () => {          
            const response = await axios.post(`${LIKE}/getLikes`, variable);
            const { getLikeSuccess, likes } = response.data;

            if(getLikeSuccess){
                // 좋아요와 싫어요의 숫자와를 세팅하고
                setLikeCount(likes.length);

                // 내가 좋아요나 싫어요 둘중 하나를 이미 눌렀는지에 대한 정보이다
                let alreadyLike = likes.filter((v) => v.userId === userId).length > 0
                setIsLike(alreadyLike && true);
            } else {
                alert('좋아요 가져오기에 실패하였습니다')
            }

            const response2 = await axios.post(`${LIKE}/getDislikes`, variable);
            const { getDislikeSuccess, dislikes } = response2.data;
            
            if(getDislikeSuccess){
                setDislikeCount(dislikes.length);

                let alreadyDislike = dislikes.filter((v) => v.userId === userId).length > 0
                setIsDislike(alreadyDislike && true);
            } else {
                alert('싫어요 가져오기에 실패하였습니다')
            }
        })();
    }, []);

    const authCheck = useCallback(() => {
        if(!isAuth){
            message.error('로그인을 진행');
        }
    }, [isAuth]);

    const upLike = useCallback(() => {

        if(!isAuth){
            message.error('먼저 로그인을 진행해주세요!');
            return;
        }

        if(!isLike){                                    // 좋아요가 눌러져있지 않을 때
            (async () => {
                const response = await axios.post(`${LIKE}/upLike`, variable);
                const { upLikeSuccess } = response.data;

                if(upLikeSuccess){  
                    setIsLike(true);                  
                    setLikeCount(state => state + 1);                   

                    // 싫어요가 눌러져 있는 상태라면?
                    if(isDislike){;
                        setIsDislike(false);
                        setDislikeCount(state => state - 1);
                    }
                } else {
                    alert('좋아요에 실패하였습니다');
                }
            })();  
        } else {                                          // 좋아요가 눌러져 있을 때
            (async () => {
                const response = await axios.post(`${LIKE}/cancelLike`, variable);
                const { cancelLikeSuccess } = response.data;

                if(cancelLikeSuccess){
                    setIsLike(false);
                    setLikeCount(state => state - 1);                    
                } else {
                    alert('좋아요 취소에 실패하였습니다!');
                }
            })(); 
        }                    
        
    }, [likeCount, isLike, dislikeCount, isDislike]);

    const upDislike = useCallback(() => {
        if(!isAuth){
            message.error('먼저 로그인을 진행해주세요!');
            return;
        }

        // 싫어요가 클릭이 되지 않았을 때
        if(!isDislike){
            (async () => {
                const response = await axios.post(`${LIKE}/upDislike`, variable);
                const { upDislikeSuccess } = response.data;

                if(upDislikeSuccess){            
                    setIsDislike(true);
                    setDislikeCount(state => state + 1);                    

                    if(isLike){                        
                        setIsLike(false);
                        setLikeCount(state => state - 1);
                    }
                } else {
                    alert('싫어요에 실패하였습니다');
                }
            })();            
        } else {                                                // 싫어요가 이미 클릭되어 있을 때 ? 취소를 한다
            (async () => {
                const response = await axios.post(`${LIKE}/cancelDislike`, variable);
                const { cancelDislikeSuccess } = response.data;

                if(cancelDislikeSuccess){
                    setIsDislike(false);
                    setDislikeCount(state => state - 1);
                } else {
                    alert('싫어요 취소에 실패하였습니다!');
                }
            })();
        }
    }, [likeCount, isLike, dislikeCount, isDislike]);
    
    
    return (
        <div style={{ display: 'flex' }}>
            <span key='comment-basic-like'>
                <Tooltip title='like' >
                    <div style={{ cursor: 'pointer', marginRight: '20px' }} onClick={upLike}>
                        {isLike ? <LikeTwoTone /> : <LikeOutlined />}
                        <span style={{ paddingLeft: '4px' }}>{likeCount}</span> 
                    </div>                                        
                </Tooltip>
            </span>   
            <span key='comment-basic-dislike'>
                <Tooltip title='dislike' >
                    <div style={{ cursor: 'pointer' }} onClick={upDislike}>
                        {isDislike ? <DislikeTwoTone /> : <DislikeOutlined />}       
                        <span style={{ paddingLeft: '4px' }}>{dislikeCount}</span>
                    </div>                   
                </Tooltip>
            </span>       
        </div>
    );
};

export default LikeDislike;