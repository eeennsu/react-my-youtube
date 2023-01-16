import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import LandingPage              from './components/views/LandingPage/LandingPage';
import LoginPage                from './components/views/LoginPage/LoginPage';
import RegisterPage             from './components/views/RegisterPage/RegisterPage';
import Auth                     from './hoc/auth'                 // 로그인여부, 관리자여부등의 확인을 담당해주는 Auth를 모든 페이지에 감싸면 HOC 기능이 적용된다
import Footer                   from './components/views/Footer/Footer';
import NavBar                   from './components/views/NavBar/NavBar';
import VideoUploadPage          from './components/views/VideoUploadPage/VideoUploadPage';
import DetailVideoPage          from './components/views/DetailVideoPage/DetailVideoPage';
import SubscriptionPage         from './components/views/SubscriptionPage/SubscriptionPage';
import { RootParent }           from './components/styled/StyledComponent';
import './App.css';

const Auth_LandingPage     = Auth(LandingPage, null);              // 아무나 들어갈 수 있도록
const Auth_LoginPage       = Auth(LoginPage, false);               // 로그인 하지 않은 사람만 들어갈 수 있도록
const Auth_RegisterPage    = Auth(RegisterPage, false);            // 로그인 하지 않은 사람만 들어갈 수 있도록
const Auth_VideoUploadPAge = Auth(VideoUploadPage, true);          // 로그인한 사람만 들어갈 수 있도록
const Auth_DetailVideoPage = Auth(DetailVideoPage, null);
const Auth_SubscriptionPage = Auth(SubscriptionPage, true);

const App = () => {

  return (
    <Router>
      <NavBar />
      <RootParent>
        <Routes>
          <Route exact path='/' element={<Auth_LandingPage />} />               {/*관리자만 들어가야하는 페이지는 3번째 인자로 true를 준다*/}
          <Route exact path='/loginPage' element={<Auth_LoginPage /> } />    
          <Route exact path='/registerPage' element={<Auth_RegisterPage />} />
          <Route exact path='/video/upload' element={<Auth_VideoUploadPAge />} />   
          <Route exact path='/video/:videoId' element={<Auth_DetailVideoPage />}/>
          <Route exact path='/subscription' element={<Auth_SubscriptionPage />}/>
        </Routes>
      </RootParent>       
      <Footer />
    </Router> 
  );
};

export default App;