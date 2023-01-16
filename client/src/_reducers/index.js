import { combineReducers } from 'redux';
import user from './user_reducer';
// import comment from './comment_reducer'
/* 스토어는 리듀서들의 집합이다. 리듀서들은 여러가지가 있을 수 있다. 리듀서 안에서 하는 일이 어떻게 스테이트가 변하는 것을 보여준 다음에
 리듀서는 여러개를 가질 수 있다. 유저, 코멘트, 포스트, 넘버, 구독 등등.. 
 이들을 combineReducers를 이용해 루트 리듀서로 하나로 합치는 역할을 한다 */
 
const rootReducer = combineReducers({
   user
});

 export default rootReducer;