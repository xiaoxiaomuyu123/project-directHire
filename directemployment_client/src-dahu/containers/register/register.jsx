/**
 * 注册路由组件
 */
import React, {Component} from 'react'

import {connect} from 'react-redux'

import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button
} from 'antd-mobile'

import Logo from '../../components/logo/logo'
import Reducers from '../../redux/reducers'
import {register} from '../../redux/actions'


const ListItem = List.Item ;

// 对注册组件进行改造
class Register extends Component {
    state = {
        // 用户名
        username: '',
        // 密码
        password: '',
        // 确认密码
        passwordConfirm: '',
        // 用户类型
        type: ''
    }



    /**
     * 收集输入框的数据，修改state
     * @param name 要修改的属性名
     * @param val 输入框的数据
     */
    handleChange = (name, val) => {
        this.setState({
            // name是变量，所以不能直接写成name: val的形式（name会被作为字符串）
            // 使用[]使得属性名可以是变量
            [name]: val
        })
    }

    handleRegister = () => {
        console.log(this.state) ;

        // 调用register()进行注册
        this.props.register(this.state) ;
    }
    /**
     * 点击已有账户按钮，跳转到登录界面
     *
     */
    toLogin = () => {
        // Register被注册为路由组件，所以会给Register组件传入一个history对象
        // 这个对象用来管理浏览器会话历史
        // 浏览器的会话历史是一个栈结构
        // replace()方法会用一个新的历史记录替换当前的记录
        this.props.history.replace('/login') ;
    }

    render() {
        const {type} = this.state ;
        return (
            <div>
                <div>
                    <NavBar>
                        直&nbsp;聘
                    </NavBar>
                </div>
                <Logo />
                <WingBlank>
                    <List>
                        <WhiteSpace />
                        <InputItem placeholder="请输入用户名" onChange={(val) => this.handleChange('username', val)}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请输入密码" type="password" onChange={(val) => this.handleChange('password', val)}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请确认密码" type="password" onChange={(val) => this.handleChange('passwordConfirm', val)}>确认密码:</InputItem>
                        <WhiteSpace />
                        <ListItem>
                            <span>用户类型</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'jobhunter'} onChange={() => this.handleChange('type', 'jobhunter')}>求职</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'boss'} onChange={() => this.handleChange('type', 'boss')}>招聘</Radio>
                        </ListItem>
                        <Button type='primary' onClick={this.handleRegister}>注&nbsp;&nbsp;&nbsp;册</Button>
                        <WhiteSpace />
                        <Button type='warning' onClick={this.toLogin}>已有账户</Button>
                    </List>

                </WingBlank>
            </div>
        )
    }
}

// mapStateToProps 作为connect()的第一个参数
// 是一个函数，返回值是一个对象，对象里面的每一个键值对就是一个映射
// 将state映射到UI组件中props
// 一旦state发生变化，mapStateToProps()就会自动执行，重新计算 UI 组件的参数，从而触发 UI 组件的重新渲染。
const mapStateToProps = (state) => {
    return {
        state: {}
    }
}

// mapDispatchToProps作为connect()第二个参数
// mapDispatchToProps可以是一个对象，属性名是传入UI组件的的同名参数，属性值是action creator
// UI组件一旦调用这个register，就会自动分发一个action，就是自动调用dispatch()，并传入register这个action creator
const mapDispatchToProps = {
    register: register
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register) ;