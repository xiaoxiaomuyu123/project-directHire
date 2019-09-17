import React, {Component} from "react"

import {
    NavBar,
    List,
    InputItem,
    WhiteSpace,
    WingBlank,
    Button
} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import Logo from '../../components/logo/logo'
import {loginActionCreator} from "../../redux/actions";

class Login extends Component {
    state = {
        'username' : '',
        'password' : '',
    };

    handleChange = (valueName, value) => {
        //更新 state
        this.setState({
            [valueName] : value
        })
    };
    toRegister = () => {
        this.props.history.replace('/register')
    };
    login = () => {
        console.log(this.state);
        this.props.loginActionCreator(this.state);
    };
    render() {
        const {msg, redirectTo} = this.props.userState;
        if(redirectTo) {
            return  <Redirect to={redirectTo}/>
        }

        return (
            <div>
                <NavBar>直&nbsp;&nbsp;&nbsp;聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <InputItem placeholder='请输入用户名' onChange={(value) => this.handleChange('username', value)}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type='password' onChange={(value) => this.handleChange('password', value)}>密码:</InputItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.login}>登&nbsp;&nbsp;&nbsp;录</Button>
                        <WhiteSpace />
                        <Button onClick={this.toRegister}>注&nbsp;&nbsp;&nbsp;册</Button>
                    </List>

                </WingBlank>
            </div>
        )
    }
}

const mapStateToProps = state => ({userState: state.userState});
const mapDispatchToProps = {loginActionCreator};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)