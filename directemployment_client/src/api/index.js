/*
包含了 n 个接口请求的函数
返回的是 promise 对象
 */

import ajax from './ajax'

// 前端注册接口
export const reqRegister = (userMsg) => {
    return ajax('/register', userMsg, 'POST')
}


// 前端 登陆接口
export function reqLogin({username, password}) {
    return ajax('/login', {username, password}, 'POST')
}

// 前端更新个人信息的接口
export function reqUpdateUser(userMsg) {
    return ajax('/update', userMsg, 'POST')
}

// 根据用户 cookie 中的 userid 向后端发送 ajax 请求，得到用户信息。
// cookie 信息自动携带传到后端，所以这里不需要传递参数
export function reqUseridUserMsg() {
    return ajax('/user')
}

// 根据不同的用户类型，获取所有用户的信息
export function requsertypeuserlist(usertype) {
    return ajax('/userlist', usertype)
}

// 获取当前用户的聊天消息列表
export function reqChatMsgList() {
    return ajax('/msglist')
}

// 修改指定消息为已读 from 是发送者的 userid
export function reqModifyReadMsg(from) {
    return ajax('/readmsg', {from}, 'POST')
}

