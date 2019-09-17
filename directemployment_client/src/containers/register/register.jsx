import React, {Component} from "react"
import {
    NavBar,
    WingBlank,
    List,
    InputItem,
    WhiteSpace,
    Radio,
    Button

} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"

import Logo from '../../components/logo/logo'
import {registerActionCreator} from '../../redux/actions'

const ListItem = List.Item;



class Register extends Component {
    state = {
        'username' : '',
        'password' : '',
        'password2' : '',
        'usertype' : '',
    }

    register = () => {
        this.props.registerActionCreator(this.state);
    }

    toLogin = () =>{
        this.props.history.replace('/login');
    }

    handleChange = (valueName, value) => {

        // 更新状态
        this.setState({
            // 这里的valuename 必须加 方括号，因为这里的valueName 是变量，
            // 不加方括号，就变成了字符串，state 没有 valueName 这个属性名
            [valueName] : value
        })
    }


    render() {
        const {usertype} = this.state;
        const {msg, redirectTo} = this.props.userState;

        if(redirectTo) {
            return  <Redirect to={redirectTo}/>
        }
        return (

            <div>
                <NavBar>直&nbsp;&nbsp;聘</NavBar>
                <Logo />
                <WingBlank>
                    <List>
                        {msg ? <div className='error-msg'>{msg}</div> : null}
                        <InputItem placeholder='请输入用户名' onChange={(value) => {this.handleChange('username', value)}}>用户名:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入密码' type='password' onChange={(value) => {this.handleChange('password', value)}}>密&nbsp;&nbsp;&nbsp;码:</InputItem>
                        <WhiteSpace />
                        <InputItem placeholder='请输入确认密码' type='password' onChange={(value) => {this.handleChange('password2', value)}}>确认密码:</InputItem>
                        <WhiteSpace />
                        <ListItem>
                            <span>用户类型</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={usertype === 'jobseek'} onChange={() => this.handleChange('usertype', 'jobseek')}>求职者</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={usertype === 'boss'} onChange={() => this.handleChange('usertype', 'boss')}>招聘者</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </ListItem>
                        <WhiteSpace />
                        <Button type='primary' onClick={this.register}>注&nbsp;&nbsp;&nbsp;&nbsp;册</Button>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>

            </div>
        )
    }
}

const mapStateToProps = state => ({userState: state.userState})

// 下面两种写法都可以
// 手动分发 action
// const mapDispatchToProps = dispatch => ({dipatchRegister: ()=> dispatch(dipatchRegister) });
// 纯对象的方式返回，会自动分发 action。
const mapDispatchToProps = {registerActionCreator};


export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)


// export default connect(
//     state => ({}),
//     {registerActionCreator}
// )(Register)