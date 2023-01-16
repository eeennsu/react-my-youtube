import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SingleComment from './SingleComment';

const ReplyComment = ({ commentList, parentCommentId, userId, videoId, refresh }) => {
    const [replyCount, setReplyCount] = useState(0);
    const [onReplyComments, setOnReplyComments] = useState(false);

    const handleChange = useCallback(() => {
        setOnReplyComments(state => !state);
    }, [onReplyComments]);


    useEffect(() => {
        let isReply = commentList.filter((v) => v.responseTo).filter((v, i) => v.responseTo === parentCommentId);
        setReplyCount(isReply.length);
    }, [commentList, parentCommentId]);


    const renderReplyComments = useCallback(() => {
       return commentList.filter((v) => v.responseTo === parentCommentId).map((v, i) => {
            return (
                <div style={{ width: '80%', marginLeft: '40px' }} key={`${i+1}답글`}>
                    <SingleComment videoId={videoId} writer={userId} responseTo={v.responseTo} comment={v} refresh={refresh} isReply={true}/>
                </div>
        );})
    }, [onReplyComments, commentList, parentCommentId]);

    const viewerReplyComments = useMemo(() => {
        return onReplyComments && renderReplyComments()
    }, [onReplyComments, commentList, parentCommentId]);
  
    return (
        <React.Fragment>
            <div>
                {/* 답글이 있는 것만 보여져야 한다 */}
                {
                    replyCount > 0 &&    
                    <span id='viewMoreComment' style={{ fontSize: '13px', color: 'grey', marginLeft: '25px', color: 'orange' }} onClick={handleChange}>
                        View {replyCount} more comment(s)
                    </span>
                }                                      
            </div>
            <div id='replyComments'>
                { viewerReplyComments }    
            </div>
        </React.Fragment>      
    );
};

export default ReplyComment;