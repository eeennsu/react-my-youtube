import React, { memo, useRef, useCallback, useEffect, useMemo, useState } from 'react';
import axios         from 'axios';
import { SUBSCRIBE } from '../../../Config';

const Subscribe = memo(({ userTo, userFrom }) => {
    
    const [subscribeCount, setSubscribeCount] = useState(0);
    const [subscribed, setSubscribed] = useState(false);    
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const postValue = useMemo(() => ({
        userTo: userTo,                         // 구독할 사람의 아이디 (동영상 주인의 아이디)
        userFrom: userFrom,                     // 구독하는 사람의 아이디 (본인의 아이디)
    }), []);
    
    const clickAble = useRef(true);

    // // 얼마의 조회수를 가지는지 가져와야 한다
    // useEffect(() => {
    //     async function fetchData(){
    //         const response = await axios.get(`${VIDEO}/getSubscribeFlag`, params);
    //         const { getViewsSuccess, views } = response.data;

    //         if(getViewsSuccess && views){
    //             setViews(Number(views));
    //         } else {
    //             alert('조회수 가져오기에 실패하였습니다.. 다시 시도해주세요');
    //         }
    //     }

    //     fetchData(); 
    // }, []);

    // const onSubscribe = useCallback(() => {
    //     setSubscribe(true);
    // }, [subscribe]);

    // const cancelSubscribe = useCallback(() => {
    //     setSubscribe(false);
    // }, [subscribe]);

    // const btnSubsc = useMemo(() => {       
    //     return (
    //         <button style={{ background: subscribe ? 'grey' : 'red', color: 'white', padding: '10px 16px', fontWeight: '500', 
    //             fontSize: '1rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }} onClick={subscribe ? cancelSubscribe :onSubscribe}  >
    //             { subscribe ? '구독 중' : '구독하기' }
    //         </button>
    //     );        
    // });  

    // return (
    //     <div>
    //         {btnSubsc}        
    //     </div>
    // );
  
    // useEffect(() => {
    //     async function fatchData(){
    //         const value = {
    //             userTo: userTo,
    //         };
    //         const response = await axios.post(`${SUBSCRIBE}/subscribeNumber`, value);
    //         const { getSubscribeSuccess, subscribeCount } = response.data;

    //         if(getSubscribeSuccess && !isNaN(subscribeCount)){
    //             setSubscribeCount(subscribeCount);
    //         } else {
    //             alert('구독자 수 가져오기에 실패하였습니다');
    //         }

    //         //또한 내가 이 비디오 업로드한 유저를 구독하는지 정보 가져오기
    //         const subscribedValue = {
    //             userTo: userTo,
    //             userFrom: localStorage.getItem('user_id'),
    //         };
    //         const response2 = await axios.post(`${SUBSCRIBE}/subscribed`, subscribedValue);
    //         const { getSubscribedSuccess, subscribed } = response2.data;
    //         if(getSubscribedSuccess){
    //             setSubscribed(subscribed);
    //         } else {
    //             alert('구독여부 정보를 가져오지 못했습니다');
    //         }
    //     }

    //     fatchData();
    // }, []);

    // useEffect(() => {
    //     var key = [];
    //     for(let i = 0; i < localStorage.length; i++){
    //         key.push(localStorage.key(i));
    //     }
    //     alert(key);
    // }, []);

    const onSubscribe = useCallback(() => {
        if(!clickAble.current) return;
        const fetchData = async () => {
            // 구독 중이 아니라면? 구독을 하면 된다
            if(!subscribed){
                const result = await axios.post(`${SUBSCRIBE}/onSubscribe`, postValue);
                const { onSubscribeSuccess } = result.data;
    
                if(onSubscribeSuccess){
                    setSubscribed(true);
                    setSubscribeCount(state => state + 1);
                } else {
                    alert('구독에 실패하였습니다.');
                }
            } else {                    // 구독 취소
                const result = await axios.post(`${SUBSCRIBE}/cancelSubscribe`, postValue);
                const { cancelSubscribeSuccess } = result.data;
    
                if(cancelSubscribeSuccess){
                    setSubscribed(state => !state);
                    setSubscribeCount(state => state - 1);
                } else {
                    alert('구독 취소에 실패하였습니다.');
                }
            }                  
            clickAble.current = true;         
        }         

        clickAble.current = false;
        fetchData();
    }, [subscribed, subscribeCount, clickAble.current]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.post(`${SUBSCRIBE}/getSubscribeCount`, postValue);
            const { getCountSuccess, subscribeCount } = result.data;
            if(getCountSuccess && subscribeCount > 0){
                setSubscribeCount(subscribeCount);
            }

            const result2 = await axios.post(`${SUBSCRIBE}/getSubscribed`, postValue);
            const { getSubscribedSuccess, scribed } = result2.data;
            if(getSubscribedSuccess){
                setSubscribed(scribed);              
            }          

            setLoadingSuccess(true);
        };

        fetchData();
    }, []);


    return (   
        <div>
            { loadingSuccess && (
            <button style={{ background: subscribed ? 'grey' : 'red', color: 'white', padding: '10px 16px', fontWeight: '500', 
                fontSize: '1rem', borderRadius: '10px', border: 'none', cursor: 'pointer' }} onClick={onSubscribe}>
                {subscribeCount} {subscribed ? '구독 중' : '구독하기'}
            </button>)}
        </div>      
    );
});

export default Subscribe;