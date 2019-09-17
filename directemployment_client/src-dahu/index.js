/**
 * 入口
 */

import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import Register from './containers/register/register'
import Login from './containers/login/login'
import Main from './containers/main/main'
import store from './redux/store'

import {Button} from "antd-mobile"

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            {
                /*
                用于渲染与路径匹配的第一个子 <Route> 或 <Redirect>
                一次只渲染一个组件
                */
            }
            <Switch>
                {/*请求的path那么是/register，渲染Register组件*/}
                <Route path='/register' component={Register}></Route>
                <Route path='/login' component={Login}></Route>
                {
                    /*
                      不指定path，那么任何pathname都会匹配这个路由
                      就是说，只要不是上面两个请求路径
                      最终都会渲染main组件

                    */
                }
                <Route component={Main}></Route>
            </Switch>
        </HashRouter>
    </Provider>

), document.querySelector('#root')) ;