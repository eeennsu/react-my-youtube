import React, { useCallback }           from 'react';
import { Menu    }     from 'antd';
import axios           from 'axios';
import { USER_SERVER } from '../../../Config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const RightMenu = ({ mode }) => {
    
    const navigate = useNavigate();

    // useSelector 는 리덕스의 상태값을 조회하기 위한 hook 함수로 이전의 connect를 통해 
    // 상태값을 조회하는 것보다 훨씬 간결하게 작성하고 코드가독성이 상승되는 장점이 있는 함수이다
    const user = useSelector(state => state.user);
    const logoutHandler = useCallback(() => {
        axios.get(`${USER_SERVER}/logout`)
             .then((res) => {
                if(res.status === 200){
                    navigate('/loginPage');
                } else {
                    alert('Logout Failed...');
                }
             });
    }, []);

    const menuItems_nonLogin = [
        {
            key: 'mail',
            label: <a href='/loginPage'>SignIn</a>,
        },
        {
            key: 'app',
            label: <a href='/registerPage'>SingUp</a>,
        }   
    ];

    const menuItems_Login = [
        {
            key: 'logout',
            label: <a onClick={logoutHandler}>Logout</a>
        },
        {
            key: 'videoUpload',
            label: <a href='/video/upload'>Video</a>
        }
    ];

    return (
        // 유저의 정보가 있으면서 로그인 상태가 아니면? 로그인이 어울리는 메뉴바로 변경     
        <Menu mode={mode} items={(user.userData && !user.userData.isAuth) ? menuItems_nonLogin : menuItems_Login}
            style={{width: '250px', marginTop: '10px'}}/>               
    );
};

export default RightMenu;