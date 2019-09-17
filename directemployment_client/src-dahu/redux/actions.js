/**
 * 包含多个action creator
 * 用于构造action，包括同步action和异步action
 *
 * 异步action包括注册和登录
 */

import {
    reqLogin,
    reqRegister
} from '../api/index'

import {AUTH_SUCCESS, ERROR_MSG} from './action-types'

// 授权成功
const authSuccess = (user) => {
    return {
        type: AUTH_SUCCESS,
        data: user
    }
} ;

// 登录/注册出现异常，错误提示信息
const errorMsg = (msg) => {
    return {
        type: ERROR_MSG,
        data: msg
    }
} ;

export const register = (user) => {

    var {username, password, passwordConfirm, type} = user ;

    // 表单的前台验证
    if (!username) {

        return errorMsg('用户名不能为空！！') ;

    } else if (password !== passwordConfirm) {
        // 对密码进行校验
        // 两次输入的密码必须一致，才能注册
        // 两次不一致，分发一个错误提示的action
        return errorMsg('两次输入的密码不一致！！')
    }

    // 返回值是一个函数，而不是action对象
    // 这个函数接收两个参数：dispatch和getState，都是函数
    return (dispatch, getState) => {
        // 先分发一个同步action，表示异步操作即将开始

        // 异步操作开始
        reqRegister({username, password, type})
            .then(response => {
                // response对象是服务端从服务端获取的响应
                // 包含多个信息，我们需要的数据存放在data这个属性中
                console.log('response', response);
                var ret = response.data ;

                if (ret.code === 0) {
                    // 注册成功，分发一个授权成功的同步action
                    dispatch(authSuccess(ret.data)) ;
                } else {
                    // 注册失败，分发一个错误信息提示的同步action
                    dispatch(errorMsg(ret.msg)) ;
                }
            }, error => {

                return console.log('服务器异常！', error) ;
            })

    }
}


export const login = (user) => {

    var {username, password} = user ;

    // 表单的前台验证
    if (!username) {

        return errorMsg('用户名不能为空！！') ;

    } else if (!password) {
        // 对密码进行校验
        return errorMsg('密码不能为空！！')
    }

    // 使用async和await关键字处理异步操作
    // 定义函数时，使用async关键字定义，表示函数内部存在异步操作
    return async (dispatch, getState) => {

        // await 后面跟的是一个异步操作，可以返回一个promise对象，也可以是其他值
        // await 会等待异步操作结束，拿到返回值
        // 如果是promise对象，那么await会阻塞后面的代码执行，
        // 等到resolve()函数运行，拿到resolve()中的value，作为 await 表达式的运算结果
        var response = await reqLogin({username, password}) ;

        var ret = response.data ;

        if (ret.code === 0) {
            // 注册成功，分发一个授权成功的同步action
            dispatch(authSuccess(ret.data)) ;
        } else {
            // 注册失败，分发一个错误信息提示的同步action
            dispatch(errorMsg(ret.msg)) ;
        }
    }
}