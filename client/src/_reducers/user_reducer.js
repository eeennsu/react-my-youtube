import { LOGIN_USER, REGISTER_USER, LOGOUT_USER, AUTH_USER } from "../_actions/types";

const user_reducer = (state = {}, action) => {
    switch(action.type){
        case LOGIN_USER:
            return {
                ...state,
                loginSuccess: action.payload,
            };
         
        case REGISTER_USER:
            return {
                ...state,
                registerSucess: action.payload,
            };        

        case LOGOUT_USER:
            return {
                ...state,
                logoutSucess: action.payload,
            };      
            
        case AUTH_USER: 
            return {
                ...state,
                userData: action.payload,
            };
        
        default: 
            return state;
    }
};

export default user_reducer;