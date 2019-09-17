/*
包含多个 reducer 函数，根据 老的 state 和 指定的 action 返回新的 state

目前有两个操作要和后台发送请求，注册和登录。这两个操作要发送 ajax 请求
 */
import {combineReducers} from 'redux';

import {AUTH_SUCCESS, ERROR_MSG, RESET_USER, RECEIVE_USER,
    RECEIVE_USER_LIST, RECEIVE_MSG, RECEIVE_CHATMSG_LIST, READ_MSG} from './action-types'
import {getRedirectTo} from '../utils/index'

let initState = {
    header: '',     // 用户头像
    username: '', // 用户名
    usertype: '', // 用户类型，只有 ‘jobSeek’ 和 ‘boss'
    msg: '',       // 错误提示信息
    redirectTo: ''
};
// 管理用户信息
function userReducer(state = initState, action) {
    switch(action.type) {
        case AUTH_SUCCESS:   // data 是 userMsg
            const {head, usertype} = action.data;
            return {...action.data, redirectTo: getRedirectTo(head, usertype)};
        case ERROR_MSG:    // data 是 msg
            return {...state, msg : action.data};
        case RECEIVE_USER:   // data 是 userMsg
            return action.data;
        case RESET_USER:    // data 是 msg
            return {...initState, msg: action.data};
        default:
            return state;
    }
}


const initUserListState = [];
// 产生 userlist 的 reducer
function userListReducer(state=initUserListState, action) {
    switch (action.type) {
        case RECEIVE_USER_LIST:
            console.log('userListReducer', action.data) ;
            return action.data; // action.data 是一个 list
        default:
            return state;
    }
}

// 产生聊天信息状态的 reducer
const initChatState = {
    users: {},  // 包含所有户用的信息的对象。属性名是 _id，属性值是 {username, header}
    chatMsgs: [], // 与当前登录的用户信息相关的聊天内容
    unReadCount: 0  // 未读信息数量
};

function chatReducer(state=initChatState, action) {
    switch (action.type) {
        case RECEIVE_CHATMSG_LIST:  // data 是 {users: {}, chatMsgs: []}
            const {users, chatMsgs, userid} = action.data;
            const unReadCount =
                chatMsgs.reduce((preTotal, msg) => preTotal + (!msg.read && msg.to === userid ? 1 : 0), 0)
            return {
                users,
                chatMsgs,
                unReadCount
            }
        case RECEIVE_MSG:  // data 是 chatMsg = {to, from, chat_id, content, read, create_time}
            const {chatMsg} = action.data;
            const userId = action.data.userid;
            return {
                users: state.users,
                chatMsgs: [...state.chatMsgs, chatMsg],
                unReadCount: state.unReadCount + (!chatMsg.read && chatMsg.to === userId ? 1 : 0)
            }
        case READ_MSG:
            const {count, from, to} = action.data;
            return {
                users: state.users,
                chatMsgs: state.chatMsgs.map(msg => {
                    if(msg.from === from && msg.to === to && !msg.read) {
                        return {...msg, read: true}
                    } else {
                        return msg;
                    }
                }),
                unReadCount: state.unReadCount - count
            }
        default:
            return state
    }
}

// 合并所有的 reducer
export default combineReducers({
    userState: userReducer,
    userListState: userListReducer,
    chatState: chatReducer
    })


// 向外暴露的结构 state = {userState： {}， userListState: []}
