/*
包含 n 个 action type 名称常量
 */

export const AUTH_SUCCESS = 'auth_success';   // 注册或登陆成功，有权利返回主页面
export const ERROR_MSG = 'error_msg';   // 显示出错信息 请求前后
export const RECEIVE_USER = 'receive_user';   // 接收用户信息
export const RESET_USER = 'reset_user';   // 重置用户信息
export const RECEIVE_USER_LIST = 'receive_user_list';

// 接收当前用户所有相关聊天消息的列表
export const RECEIVE_CHATMSG_LIST = 'receive_chatmsg_list';

// 接收到一条消息
export const RECEIVE_MSG = 'receive_msg';

// 读取消息
export const READ_MSG = 'read_msg';
