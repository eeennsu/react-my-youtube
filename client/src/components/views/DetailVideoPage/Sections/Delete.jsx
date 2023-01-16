import React, { useMemo, useCallback } from 'react';
import axios                from 'axios';
import { Button }           from 'antd/lib/radio';
import { COMMENT, VIDEO }   from '../../../Config';
import { useNavigate }      from 'react-router-dom';
import { message }          from 'antd';

const Delete = ({ videoId, commentId, refresh }) => {

    const navigate = useNavigate();
    const variable = useMemo(() => {
        if(videoId){
            return { videoId: videoId }
        }

        return { commentId: commentId };
    }, [videoId, commentId]);

    const onDelete = useCallback(() => {
        if(videoId){
            (async () => {            
                const response = await axios.post(`${VIDEO}/deleteVideo`, variable);
                const { deleteVideoSuccess } = response.data;
                
                if(deleteVideoSuccess){                
                    message.success('삭제되었습니다.');                 
                } else {
                    message.error('삭제에 실패하였습니다. 지속되면 관리자에게 문의해주세요');               
                }   
    
                navigate('/');
           })();
        } else if(commentId){
            (async () => {
                const response = await axios.post(`${COMMENT}/deleteComment`, variable);
                const { deleteCommentSuccess, result } = response.data;

                if(deleteCommentSuccess){
                    message.success('댓글이 삭제되었습니다');                     
                    refresh(null, result);
                } else {
                    message.error('삭제에 실패하였습니다. 지속되면 관리자에게 문의해주세요');               
                }   
            })();
        }
   
    }, [videoId, commentId]);

    return (
        <React.Fragment >
            <Button style={{ backgroundColor: 'coral', borderRadius: '15px', color: 'whitesmoke', fontWeight: 400 }} onClick={onDelete}>
                Delete
            </Button>
        </React.Fragment>     
    );
};

export default Delete;