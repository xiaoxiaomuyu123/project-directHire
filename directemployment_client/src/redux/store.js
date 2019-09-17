/*
redux 最核心的管理对象模块
 */
// 最重要向外暴露 store 对象
import {createStore, applyMiddleware} from 'redux'
// 引入异步中间件
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'

import reducers from './reducers'

export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))