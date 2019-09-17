/*
包含 n 个 action creator 函数：
异步 action，同步 action
 */

import { reqRegister,
    reqLogin, reqUpdateUser, reqUseridUserMsg,
    requsertypeuserlist, reqChatMsgList, reqModifyReadMsg} from '../api/index';
import {AUTH_SUCCESS, ERROR_MSG, RECEIVE_USER, RESET_USER,
    RECEIVE_USER_LIST, RECEIVE_CHATMSG_LIST, RECEIVE_MSG, READ_MSG} from './action-types'
import io from "socket.io-client"

// 每一个 action.type 都会对应 同步 action

// 授权成功同步 action
const authSuccess = (userMsg) => ({type: AUTH_SUCCESS, data: userMsg});

// 错误信息的同步 action
const errorMsg = (msg) => ({type: ERROR_MSG, data: msg});

// 接收用户信息的同步 action
const receiveUser = (userMsg) => ({type: RECEIVE_USER, data: userMsg});

// 重置用户信息的同步 action
export const resetUser = (msg) => ({type: RESET_USER, data: msg});

// 根据不同的 usertype ，接受到的所有用户信息的 同步 action
export const receiveuserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

// 虽然上面的 两组看起来都一样，但是在 reducer 函数里面的处理不一样，就能修改不同的 state

// 接收消息列表的同步 action
const receiveMsgList = ({users, chatMsgs, userid}) => ({type: RECEIVE_CHATMSG_LIST, data: {users, chatMsgs, userid}})

// 接收一条消息的同步 action
const receiveOneMsg = (chatMsg, userid) => ({type: RECEIVE_MSG, data: {chatMsg, userid}});

// 读取消息的同步 action
const readMsg = ({count, from ,to}) => ({type: READ_MSG, data: {count, from ,to}})

/********** 注册的 异步 action，因为是异步的 action，所以 return 的是一个函数 **************/
// export function registerActionCreator(userMsg) {
//     const {username, password, password2, usertype} = userMsg;
//
//     // 在发送 ajax 前就进行表单验证，查看用户名是否填写，密码和确认密码是否一样，若不一样，就返回错误提示信息
//     if(!username) {
//         return errorMsg('用户名不能为空！！')
//     } else if(password !== password2) {
//         return errorMsg('两次密码不一致')
//     }
//
//     // 前台验证成功之后，分发异步 ajax 请求
//     return async dispatch => {
//         console.log('registerActionCreator', {username, password, password2, usertype})
//         // 发送注册的异步请求
//         // 得到的 response.data 的结构是 {conde： 0/1，data：user，msg：’‘}?
//         // 返回的 response 到底是什么结构，为什么 data 里面有这些值
//         const response = await reqRegister({username, password, usertype});
//         // response？
//         console.log('在注册的时候，用 axios 发送的 ajax 请求，返回的结果是什么？response 是什么结构', response)
//         const result = response.data;
//         if(result.code === 0) { // 返回成功
//             // 分发成功的 action
//             dispatch(authSuccess(result.data));
//         } else { // 返回失败
//             // 分发失败的 action
//             dispatch(errorMsg(result.msg));
//         }
//     }
// }


/************ 用 promise 形式 *****************/

export function registerActionCreator(userMsg) {
    const {username, password, password2, usertype} = userMsg;

    // 在发送 ajax 前就进行表单验证，查看用户名是否填写，密码和确认密码是否一样，若不一样，就返回错误提示信息
    if(!username) {
        return errorMsg('用户名不能为空！！')
    } else if(password !== password2) {
        return errorMsg('两次密码不一致')
    }

    // 前台验证成功之后，分发异步 ajax 请求
    return dispatch => {
        console.log('registerActionCreator', {username, password, password2, usertype})
        // 发送注册的异步请求
        // 得到的 response.data 的结构是 {conde： 0/1，data：user，msg：’‘}?
        // 返回的 response 到底是什么结构，为什么 data 里面有这些值
        // const promise = reqRegister({username, password, usertype});
        // response？
        reqRegister({username, password, usertype}).then(response => {
            console.log('在注册的时候，用 axios 发送的 ajax 请求，返回的结果是什么？response 是什么结构', response)
            const result = response.data;
            if(result.code === 0) { // 返回成功
                // 分发成功的 action
                const userid = result.data._id;
                getChatMsgList(dispatch, userid);
                dispatch(authSuccess(result.data));
            } else { // 返回失败
                // 分发失败的 action
                dispatch(errorMsg(result.msg));
            }
        }, error => {
            console.log('服务器异常', error) ;
        })
    }
}





/********** 登录的 异步 action，因为是异步的 action，所以 return 的是一个函数 **************/
// 因为是 分发异步的 action，所以返回的是一个函数，来达到异步的效果。
export function loginActionCreator(userMsg) {
    const {username, password} = userMsg;
    if(!username) {
        return errorMsg('用户名不能为空！！')
    } else if(!password) {
        return errorMsg('密码不能为空！！')
    }

    return async dispatch => {
        const response = await reqLogin({username, password});
        // response.data 的结构是 {code: 0/1, data: userMsg, msg: ''}
        const result = response.data;
        if(result.code === 0) { // 登陆成功
            const userid = result.data._id;
            getChatMsgList(dispatch, userid);
            // 分发登录成功的 action
            dispatch(authSuccess(result.data))
        } else { // 登录失败
            // 分发登录失败的 action
            dispatch(errorMsg(result.msg))
        }

    }
}


/********** 更新用户信息的 异步 action，因为是异步的 action，所以 return 的是一个函数 **************/
// 因为是 分发异步的 action，所以返回的是一个函数，来达到异步的效果。
export function updateActionCreator(userMsg) {
    return async dispatch => {
        const response = await reqUpdateUser(userMsg);
        const result = response.data;

        if(result.code === 0) {

            return dispatch(receiveUser(result.data))
        } else {
            return dispatch(resetUser(result.msg))
        }


    }
}



/****************
 *  通过userid 向后端发送请求，返回的数据后，获取了用户信息从而实现自动登录的异步 action，
 *  因为是异步的 action，所以 return 的是一个函数 **************/

export function useridUserMsgActionCreator() {
    return async dispatch => {
        const response = await reqUseridUserMsg();
        const result = response.data;
        console.log("result", result)
        if(result.code === 1) {
            return dispatch(resetUser(result.msg));
        }
        const userid = result.data._id;
        getChatMsgList(dispatch, userid);
        dispatch(receiveUser(result.data))
    }
}

/**********  获取用户列表的异步 action  *************/
export function usertypeUserlistActionCreator(usertype) {
    return async dispatch => {
        console.log("发送请求 userList 的 ajax 请求")
        const response = await requsertypeuserlist({usertype})
        const result = response.data; // 获取的就是后端返回来的数组
        console.log('返回的 result 信息', result)
        if(result.code === 1) { return console.log("code=1，服务器没能返回正确的userList，返回的信息 result 是：", result)}
        dispatch(receiveuserList(result.data))
    }
}

/**********  发送消息的异步 action  用 socketio 来实现*************/

/*
单例对象：
1. 创建对象之前： 判断对象是否已经存在，只有不存在的时候采取创建
2. 创建对象之后： 保存这个对象。保存在哪里呢？一是全局，而是挂载某个全局对象上。这里我们选择第二种，挂在全局对象 io 上
 */

function initIO(dispatch, userid) {
    // 创建对象之前： 判断对象是否已经存在，只有不存在的时候采取创建
    if(!io.socket) {
        // 连接服务器，得到代表连接的 socket 对象, 并保存在 io 对象上
        io.socket = io("ws://localhost:8080");

        // 绑定监听，客户端接收到了从服务器端发送回来的消息
        io.socket.on('receiveMsg', function(chatMsg) {
            console.log("客户端接收到了从服务器端发送回来的消息:", chatMsg);
            // 只有当 chatMsg 是与当前用户相关的消息，才去分发同步 action 来保存这条消息
            if(userid === chatMsg.from || userid === chatMsg.to) {
                dispatch(receiveOneMsg(chatMsg, userid))
            }

        });
    }


}

// 用户登录后异步获取聊天消息列表
async function getChatMsgList(dispatch, userid) {
    // 因为 getChatMsgList 是在用户登录成功的时候调用，和 initIO 调用的时间一样，所以就在 这个函数下 调用 initIO,
    // 来初始化 io
    initIO(dispatch, userid);
    const response = await reqChatMsgList();
    const result = response.data;
    if(result.code === 0) {
        const {users, chatMsgs} = result.data;
        // 分发 同步 action
        dispatch(receiveMsgList({users, chatMsgs, userid}))
    }
}



export function sendMsgActionCreator({from, to, content}) {
    return dispatch => {
        console.log("客户端向服务器发送消息：", {from, to, content})

        // 发消息
        io.socket.emit('sendMsg', {from, to, content})
    }
}

// 读取消息的异步 action
export function readMsgActionCreator (from, to) {
    return async dispatch => {
        const response = await reqModifyReadMsg(from);
        const result = response.data;
        if(result.code === 0) {
            // 分发同步 action
            const count = result.data;
            dispatch(readMsg({count, from ,to}))
        }
    }
}


//
