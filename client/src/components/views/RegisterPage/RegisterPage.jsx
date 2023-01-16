import React, { useCallback, useState } from 'react'
import { useDispatch }      from 'react-redux';
import { useNavigate }      from 'react-router-dom';
import { regitserUser }     from '../../../_actions/user_action';
import { Container, Form }  from '../../styled/StyledComponent';

const RegisterPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const nameHandler = useCallback((e) => {
    setName(e.target.value);
  });

  const lastNameHandler = useCallback((e) => {
    setLastName(e.target.value);
  });

  const emailHandler = useCallback((e) => {
    setEmail(e.target.value);
  });

  const passwordHandler = useCallback((e) => {
    setPassword(e.target.value);
  });

  const confirmHandler = useCallback((e) => {
    setConfirm(e.target.value);
  });

  const submitHandler = useCallback((e) => {
    e.preventDefault();

    if(password !== confirm){
      setConfirm('');
      return alert('비밀번호가 일치하는지 확인해주세요');
    }

    let body = {
      name: name,
      lastName: lastName,
      email: email,
      password: password,
    };

    dispatch(regitserUser(body))
		.then(res => {
			if(res.payload.registerSuccess){						// 회원가입에 성공하였으면
				navigate('/loginPage');
			} else {
				alert('Register Faild...');
			}
		});
  }, [name, lastName, email, password, confirm]);

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <label>
          Name <br/>
          <input type='text' placeholder='your name' value={name} onChange={nameHandler} required/>
        </label>
        <label>
          LastName <br/>
          <input type='text' placeholder='your lastName' value={lastName} onChange={lastNameHandler} required/>
        </label>
        <label>
          Email <br/>
          <input type='email' placeholder='your email' value={email} onChange={emailHandler} required/>
        </label>
        <label>
          Password <br/>
          <input type='password' placeholder='your password' value={password} onChange={passwordHandler} required/>
        </label>
        <label>
          Password <br/>
          <input type='password' placeholder='confirm password' value={confirm} onChange={confirmHandler} required/>
        </label>
        <br />
        <button type='submit'>
          Register
        </button>
      </Form>
    </Container> 
  )
};

export default RegisterPage;