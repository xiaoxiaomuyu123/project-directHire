/*
Personal 主界面的路由容器组件
 */

import React, {Component} from "react"
import {connect} from "react-redux"
import {WhiteSpace, Button, List, Result, Modal} from "antd-mobile"
import Cookies from "js-cookie"

import {resetUser} from "../../redux/actions"

const Item = List.Item;
const Brief = Item.Brief;

class Personal extends Component {

    logout = () => {
        Modal.alert('退出', '确认退出登录吗？', [
            {text: '取消'},
            {
                text: '确定',
                onPress: () => {
                    // 删除浏览器中 cookie 里的 userid
                    Cookies.remove('userid');
                    // 删除 redux 里面的 userState 信息，也就是把 userState 变成 initState
                    this.props.resetUser();
                }
            }
        ])
    }

    render() {
        const {userState} = this.props;
        const {header, username, post, info, salary, company} = userState;
        console.log("userState", userState)
        return (
            <div style={{marginBottom: 50, marginTop: 50}}>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt="header"/>}
                    title={username}  message={company}
                />
                <List renderHeader={() => "相关信息"}>
                    <Item  multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary ? <Brief>薪资：{salary}</Brief> : null}
                    </Item>
                    <WhiteSpace />
                </List>
                <WhiteSpace />
                <Button type="warning" onClick={this.logout}>退出登录</Button>
            </div>
        )
    }
}


const mapStateToProps = state => ({userState: state.userState});
const mapDispatchToProps = {resetUser};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Personal)