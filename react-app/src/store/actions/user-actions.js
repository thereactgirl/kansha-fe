import {axiosWithAuth} from "../../utils/axiosWithAuth";
import axios from 'axios';

export const USER_LOGIN_START = "USER_LOGIN_START"
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS"
export const USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE"
export const USER_ONBOARDING_START = "USER_ONBOARDING_START"
export const USER_ONBOARDING_SUCCESS = "USER_ONBOARDING_SUCCESS"
export const USER_ONBOARDING_FAILURE = "USER_ONBOARDING_FAILURE"


export const login = (userProfile) => dispatch => {
    dispatch({ type: USER_LOGIN_START })   
    axiosWithAuth().get()
}

export const onboard = (creds) => dispatch => {
    dispatch({ type: USER_ONBOARDING_START })
        // axiosWithAuth()
        axios
            .post("http://localhost:8000/users", creds)
            .then(res => {
                dispatch({ type: USER_ONBOARDING_SUCCESS, payload: res.data });
            })
            .catch(err => {
                console.log(err)
                dispatch({ type: USER_ONBOARDING_FAILURE, payload: err });
            })
};