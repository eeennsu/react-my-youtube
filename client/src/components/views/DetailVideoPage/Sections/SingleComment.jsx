import React, { memo, useState, useCallback, useMemo } from 'react';
import { Comment, Avatar, Button } from 'antd';
import axios                       from 'axios';
import { COMMENT }                 from '../../../Config';
import LikeDislike                 from './LikeDislike';
import { useSelector }             from 'react-redux';
import Delete                      from './Delete';

const SingleComment = memo(({ videoId, writer, comment, refresh, isReply, userId }) => {
    const { userData } = useSelector(state => state.user);
    const [openReply, setOpenReply] = useState(false);
    const [replyText, setReplyText] = useState('');

    const onClickReplyOpen = useCallback(() => {
        setOpenReply(state => !state);
    }, [openReply]);

    const textareaChange = useCallback((e) => {
        setReplyText(e.target.value);
    }, [replyText]);

    // 모든 Comment정보를 몽고디비에서 가져와야 한다
    const replyVariable = useMemo(() => ({ 
        writer: writer,
        videoId: videoId,
        content: replyText,
        responseTo: comment._id,
    }), [replyText]);

    // 답글을 다는 모든 정보 submit
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        if(replyText.length === 0 ){
            alert('답글을 입력해주세요');
            return;
        }

        async function fetchData(){
            const response = await axios.post(`${COMMENT}/saveComment`, replyVariable);
            const { saveCommentSuccess, result } = response.data;

            if(saveCommentSuccess){
                setReplyText('');
                setOpenReply(state => !state);
                console.log(result);
                refresh(result);                                
            } else {
                alert('답글 등록에 실패하였습니다');
            }
        }

        fetchData();
    }, [replyText]);

    // 댓글폼이 사라지고 나타나게 하는 키 역할이다
    const reply = useMemo(() => {
        return !isReply && <span onClick={onClickReplyOpen} style={{ marginLeft: '2rem' }} key='comment-basic-reply-to'>Reply to</span>;
    }, [openReply]); 
    
    const replyForm = useMemo(() => {
        return openReply && 
            <form style={{ display: 'flex', marginLeft: '40px', marginBottom: '15px' }} onSubmit={onSubmit}>
                <textarea value={replyText} style={{ width: '100%', borderRadius: '5px', marginRight: '5px' }} 
                    onChange={textareaChange} placeholder='Input your opinions!'>
                </textarea>
                <Button style={{ width: '20%', height: '52px', lineHeight: '52px', borderRadius: '15px', textAlign: 'center', background: 'lightskyblue' }} onClick={onSubmit}>
                    Comment!
                </Button>
            </form> 
    }, [replyText, openReply]);

    const deleteContainer = useMemo(() => {
        return userData.isAuth && userData._id === comment?.writer._id && (
            <div style={{ position: 'absolute', right: 0 , bottom: '2px'}}>
                <Delete commentId={comment?._id} refresh={refresh}/>
            </div>
        );
    }, [userData, comment]);
    
    return (
        <div>
            <Comment actions={[
                <LikeDislike comment userId={userId} commentId={comment?._id} isAuth={userData.isAuth}/>,
                userData.isAuth && reply,
                deleteContainer
            ]} 
              avatar={<Avatar src={comment?.writer.image} alt />} author={comment?.writer.name} content={<p>{comment?.content}</p>} style={{ fontWeight: 'bold' }}/> 
            { replyForm }            
        </div>
    );
});

export default SingleComment;


