import React, { memo, useCallback, useState } from 'react'
import { useNavigate }          from 'react-router-dom';
import { Container, Form }      from '../../styled/StyledComponent';
import { useDispatch }          from 'react-redux';
import { loginUser }            from '../../../_actions/user_action';

const LoginPage = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  const emailHandler = useCallback((e) => {
    setInputEmail(e.target.value);
  });

  const passwordHandler = useCallback((e) => {
    setInputPassword(e.target.value);
  });

  const submitHandler = useCallback((e) => {
      e.preventDefault(); 

      let body = {
        email: inputEmail,
        password: inputPassword,
      };
      
      // dispatch를 통해 loginUser액션을 취한다
      dispatch(loginUser(body))
       .then(res => {
        if(res.payload.loginSuccess){
          localStorage.setItem('userId', res.payload.userId);
          navigate('/');
        } else {
          alert('Login Failed');
        }
      });   
    
  }, [inputEmail, inputPassword]);

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <label>
          Email
        </label>
          <input type='email' placeholder='your email' onChange={emailHandler} value={inputEmail} />    
        <label>
          Password     
        </label>
          <input type='password' placeholder='your password' onChange={passwordHandler} value={inputPassword}  />  
        <br />
        <button type='submit'>
          Login
        </button>
      </Form>
    </Container>
  );
};

export default LoginPage;