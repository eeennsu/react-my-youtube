import axios from 'axios';
import { LOGIN_USER, REGISTER_USER, LOGOUT_USER, AUTH_USER } from './types';
import { USER_SERVER } from '../components/Config'

export function loginUser(data){
    const request = async () => {
        const result = await axios.post(`${USER_SERVER}/login`, data);
        return result.data;
    };

    return {
        type: LOGIN_USER,
        payload: request(),
    }
};

export function regitserUser(data){
    const request = async () => {
        const result = await axios.post(`${USER_SERVER}/register`, data);
        return result.data;
    };

    return {
        type: REGISTER_USER,
        payload: request(),
    };
}

export function logoutUser(){
    const request = async () => {
        const result = await axios.get(`${USER_SERVER}/logout`);
        return result.data;
    };

    return {
        type: LOGOUT_USER,
        payload: request(),
    };
}

export function auth(){
    const request = async () => {
        const result = await axios.get(`/api/users/auth`);
        return result.data;
    };

    return {
        type: AUTH_USER,
        payload: request(),
    };
}