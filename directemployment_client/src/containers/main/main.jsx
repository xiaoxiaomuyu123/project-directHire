import React, {Component} from "react"
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from "react-redux"
import  Cookies from "js-cookie"  //
import {NavBar} from "antd-mobile"

import BossInfo from '../boss-info/boss-info'
import JobSeekInfo from '../jobSeek-info/jobSeek-info'
import {getRedirectTo} from "../../utils/index"
import {useridUserMsgActionCreator} from "../../redux/actions"
import Boss from "../boss/boss"
import JobSeek from "../jobSeek/jobSeek"
import Message from "../message/message"
import Personal from "../personal/personal"
import NotFound from "../../components/not-found/not-found"
import NavFooter from "../../components/nav-footer/nav-footer"
import Chat from "../chat/chat"

class Main extends Component {
    // 给组件对象添加属性，这是一个实例属性，如果前面是加上 static 就是类属性
    // 包含所有导航组件的相关信息
    navList = [
        {
            path: '/boss',
            component: Boss,
            title: '求职者列表',
            icon: 'jobseek',
            text: '求职者'
        },
        {
            path: '/jobseek',
            component: JobSeek,
            title: '公司列表',
            icon: 'boss',
            text: '公司'
        },
        {
            path: '/message',
            component: Message,
            title: '消息列表',
            icon: 'message',
            text: '消息'
        },
        {
            path: '/personal',
            component: Personal,
            title: '个人中心',
            icon: 'personal',
            text: '个人中心'
        }
    ];


    /*
    1. 先判断 浏览器中的 cookie 中有没有 userid ，没有，就跳转到登录界面
        有（证明曾经登陆过），就继续判断 redux 中的 userState 中的 user 状态， 主要是看 有没有
        _id(例如重新刷新了界面, userState 就被清空了，此时 _id 就没有了)，如果没有 _id 就发送 ajax 请求，
        如果有 _id 就根据 userState 状态来渲染对应的界面（？）。
    2. 如果有 userState 中有 _id , 但是请求的是根路径，就用 userState 中的 usertype 和 header
        判定应该跳转到那个界面（如果登陆的是 boss，且个人信息设置完整，就对应显示 jobseek 的列表界面；
        若个人信息设置的不完整，就跳转到个人信息设置界面，设置完成后，再跳转到 jobseek 的列表界面）

     */


    // 先判断 浏览器中的 cookie 中有没有 userid ，没有，就跳转到登录界面
    // 有（证明曾经登陆过），就继续判断 redux 中的 userState 中的 user 状态， 主要是看 有没有
    // _id(例如重新刷新了界面, userState 就被清空了，此时 _id 就没有了)，如果没有 _id 就发送 ajax 请求，
    componentDidMount() {
        const userid = Cookies.get('userid');
        const {_id} = this.props.userState;
        if(userid && !_id) {
            // 发送异步 ajax 请求，获取用户信息
            console.log("在 main 组件中的 componentDidMount 中，发送 ajax 请求");
            this.props.useridUserMsgActionCreator();
        }
    }

    render() {
        // 判断 cookie 中有没有 userid
        const userid = Cookies.get('userid');
        if(!userid) {// 没有这个 userid 就跳转到登录界面
            return <Redirect to='/login'/>
        }

        // cookie 中有 userid，就继续判断 redux 中的 userState 中的 user 状态里面的 _id, 没有就返回 null
        const {userState} = this.props;
        if(!userState._id) {
            return null
        }

        // redux 中的 userState 中的 user 状态里面的 _id 有值，就判断是否请求的是根路径
        let path = this.props.location.pathname;
        if(path === '/') {
            
            // 如果请求的是根路径，根据 userState 里面的 usertype 和 header 来判断应该跳转到哪个页面
            path = getRedirectTo(userState.header, userState.usertype);
            return <Redirect to={path}/>
        }

        const { navList } = this;
        // 找到 navList 中和当前请求的路径一样的信息，方便展示出主界面相应的 NavBar，
        // 因为 navList 中只有四种组件配套的路径信息，所以可能找得到也可能找不到
        const currentNav = navList.find(nav => nav.path === path);
        // 给不同的 navList 中的元素添加 hide：true
        if(currentNav) {
            const userMsg = this.props.userState;
            if(userMsg.usertype === 'boss') {
                // 如果当前用户类型是 ‘boss’，就把 currentNav 数组中 第二个位置添加隐藏属性
                navList[1].hide = true;
            } else {
                navList[0].hide = true;
            }
        }

        return (
            <div>
                {currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null}
                <Switch>
                    {
                        navList.map((nav, index) => <Route path={nav.path} component={nav.component} key={index}/>)
                    }
                    <Route path='/bossinfo' component={BossInfo}/>
                    <Route path='/jobseekinfo' component={JobSeekInfo}/>
                    <Route path='/chat/:userid' component={Chat}/>


                    {/*<Route path='/jobseek' component={JobSeek}/>*/}
                    {/*<Route path='/boss' component={Boss}/>*/}
                    {/*<Route path='/message' component={Message}/>*/}
                    {/*<Route path='/personal' component={Personal}/>*/}

                    <Route component={NotFound}/>
                </Switch>
                {currentNav ? <NavFooter  navList={this.navList} unReadCount={this.props.unReadCount}/> : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({userState: state.userState, unReadCount: state.chatState.unReadCount});
const mapDispatchToProps = {useridUserMsgActionCreator}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main)

/*
1. 实现自动登录：
    ~ 如果 cookie 中有 userid，就发请求，获得对应的 用户信息
    ~ 如果 coolkie 中没有 userid，就自动进入 登录界面
2. 如果已经登陆了，再次请求根路径，/ ，要根据 usertype 进行自动跳转
    根据 usertype 和 header 来计算一个重定向的路径

 */