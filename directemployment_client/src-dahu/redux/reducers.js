/**
 * 包含多个reducer函数
 * 根据旧的state和action产生新的state
 */

import {combineReducers} from 'redux'

import {AUTH_SUCCESS, ERROR_MSG} from './action-types'

// 初始的状态
var initUser = {
    // 用户名
    username: '',
    // 用户类型 boss/jobseeker
    type: '',
    // 错误提示信息，登录/注册出现异常
    msg: ''
} ;


function user(state = initUser, action) {
    switch (action.type) {
        case AUTH_SUCCESS:
            return {...state, ...action.data} ;
        case ERROR_MSG:
            return {...state, msg: action.data} ;
        default:
            return state ;

    }
}



const Reducers =  combineReducers({
    user
})

export default Reducers ;