import React, { useEffect }         from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { auth }                     from '../_actions/user_action';
import { useNavigate }              from 'react-router-dom';

export default function (SpecificComponent, option, adminRoute = null){

    /* option -> null || true || false 가 올 수 있다.
       null은 아무나 출입이 가능한 페이지이다.
       true는 로그인한 유저만 출입이 가능한 페이지이다.
       false는 로그인한 유저는 출입이 불가능한 페이지이다
    */

    // 백엔드에 리퀘스트를 탈려서 유저의 현재 상태를 가져와준다
    function AuthenticationCheck(){
        const user = useSelector(state => state.user);
        const dispatch = useDispatch();
        const navigate = useNavigate();
    
        useEffect(() => {
            dispatch(auth())
             .then(async (res) => {
                // 로그인하지 않은 상태
                if(await !res.payload.isAuth){
                    // 만약 로그인한 상태이면?
                    if(option){
                        navigate('/loginPage');
                    }
                } else {        // 로그인한 상태

                    // 관리자 페이지 인데 로그인유저가 관리자가 아니면?
                    if(adminRoute && !res.payload.isAdmin){
                        navigate('/');
                    } else {
                        if(option === false){        // 로그인한 유저가 출입 불가능한 페이지를 갈 때는? (로그인, 회원가입 페이지)
                           navigate('/');
                        }
                    }                    
                }

                // 이외에 모든 페이지는 출입 가능하도록 작동
             });           
        }, []);

        return <SpecificComponent />
    }   

    return AuthenticationCheck
}