import React, { useMemo, useState, memo, useCallback } from 'react';
import axios            from 'axios';
import { COMMENT }      from '../../../Config';
import SingleComment    from './SingleComment';
import { Button }       from 'antd/lib/radio';
import ReplyComment     from './ReplyComment';
import { useSelector }  from 'react-redux';

const Comment = memo(({ commentList, userId, videoId, refresh }) => {

    const { userData } = useSelector(state => state.user);
    const [content, setContent] = useState('');
    const textareaChage = useCallback((e) => {
        setContent(e.target.value);
    }, [content]);
    
    const commentValue = useMemo(() => ({
        writer: userId,
        videoId: videoId,                  // 로컬스토리지에서 가져올 수 있지만, 리덕스에서도 가져올 수 있다
        content: content,
    }), [userId, videoId, content]);

    const onSubmit = useCallback((e) => {
        e.preventDefault();  
        if(content.length === 0) {
            alert('댓글을 입력해 주세요!');
            return;
        } 

        async function fatchData(){
            const response = await axios.post(`${COMMENT}/saveComment`, commentValue);
            const { saveCommentSuccess, result } = response.data;
            
            if(saveCommentSuccess){
                //리셋
                setContent('');            
                // 댓글 등록에 성공을 하면 DetailVideoPage에다가 등록을 해야하고, 다시 리로드해야 한다                       
                refresh(result);
            } else {
                alert('댓글을 저장하지 못했습니다');
            }
        };

        fatchData();
    }, [commentValue]);


    const commentForm = useMemo(() => {
        return (
            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <textarea value={content} style={{ width: '100%', borderRadius: '5px', marginRight: '5px' }} 
                    onChange={textareaChage} placeholder='Input your opinions!'>
                </textarea>
                <Button style={{ width: '20%', height: '52px', lineHeight: '52px', borderRadius: '15px', textAlign: 'center', background: 'orange' }} onClick={onSubmit}>
                    Comment!
                </Button>
            </form>
        );     
    }, [content]);

    const notForm = useMemo(() => {
        return (
            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea placeholder='로그인을 해주세요!' readOnly style={{ width: '100%', borderRadius: '5px', marginRight: '5px' }} >
                </textarea>
                <Button style={{ width: '20%', height: '52px', lineHeight: '52px', borderRadius: '15px', textAlign: 'center', background: 'violet' }}>
                   <a href='/loginPage'>로그인 하러 가기</a>
                </Button>
            </form>
        );
    });
  
    return (
        <div style={{ marginTop: '30px' }}>
            <p>Comments</p>
            <hr />    
        
          
            {/* Comment Lists : responseTo가 없는 것은 답글이 아닌 댓글이라는 뜻이고, 이 댓글들만 가져와야 한다 */}
            { commentList && commentList.filter((v) => !v?.responseTo).map((v, i) => (
                <React.Fragment key={`${i+1}댓글`}>
                    <SingleComment videoId={videoId} writer={userId} comment={v} refresh={refresh} isReply={false} userId={userId}/> 
                    <ReplyComment commentList={commentList} parentCommentId={v?._id} userId={userId} videoId={videoId} refresh={refresh} is/>
                </React.Fragment>
            ))}


            {/* Root Comment Form */}
            {
                userData?.isAuth ? commentForm : notForm              
            }
        </div>
    );
});

export default Comment;