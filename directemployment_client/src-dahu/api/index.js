/**
 * 包含了n个接口请求函数的模块
 * 函数返回值为promise对象
 */

import ajax from './ajax'

// 注册接口
// user参数是一个对象，包含：username、password、type
export const reqRegister = (user) => ajax('/register', user, 'POST') ;

// 登录接口
// 这里我们指明了形参的组成，有助于我们熟悉这个形参需要哪些东西，以及形参的形式
export const reqLogin = ({username, password}) => ajax('/login', {username, password}, 'POST') ;

// 更新用户信息接口
export const reqUpdate = (user) => ajax('/update', user, 'POST') ;