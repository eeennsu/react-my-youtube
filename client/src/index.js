import React                            from 'react';
import ReactDOM                         from 'react-dom/client';
import App                              from './App';
import { Provider }                     from 'react-redux';                      // 리덕스 연결
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware                from 'redux-promise';
import ReduxThunk                       from 'redux-thunk';
import Reducer                          from './_reducers';
import 'antd/dist/antd.css';


// 프로미스와 함수를 받을 수 있게 적용해주는 로직이다
const createStoreMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={createStoreMiddleware(Reducer,
                 window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
              )}>
    <App />
  </Provider> 
);