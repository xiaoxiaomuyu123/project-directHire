/**
 * 注册路由组件
 */
import React, {Component} from 'react'
import {Button, InputItem, List, NavBar, Radio, WhiteSpace, WingBlank} from "antd-mobile";
import Logo from "../../components/logo/logo";

const ListItem = List.Item ;

export default class Login extends Component {
    state = {
        username: '',
        password: '',
        type: ''
    }

    handleChange = (name, val) => {
        this.setState({
            [name]: val
        })
    }

    handleLogin = () => {
        console.log(this.state) ;
    }

    toRegister = () => {
        this.props.history.replace('/register') ;
    }

    render() {
        const {type} = this.state
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
                        <InputItem placeholder="请输入用户名" onChange={(val) => {this.handleChange('username', val)}}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder="请输入密码" type="password" onChange={(val) => {this.handleChange('password', val)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <ListItem>
                            <span>用户类型</span>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'jobhunter'} onChange={() => {this.handleChange('type', 'jobhunter')}}>求职</Radio>
                            &nbsp;&nbsp;&nbsp;
                            <Radio checked={type === 'boss'} onChange={() => {this.handleChange('type', 'boss')}}>招聘</Radio>
                        </ListItem>
                        <Button type='primary' onClick={this.handleLogin}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace />
                        <Button type='warning' onClick={this.toRegister}>注&nbsp;&nbsp;&nbsp;册</Button>
                    </List>

                </WingBlank>
            </div>
        )
    }
}