/*
jobSeek 主界面的路由容器组件，显示招聘者的用户列表
 */

import React, {Component} from "react"
import {connect} from "react-redux"

import {usertypeUserlistActionCreator} from "../../redux/actions"
import UserList from "../../components/user-list/user-list"

class JobSeek extends Component {

    componentDidMount() {
        this.props.usertypeUserlistActionCreator('boss')
    }

    render() {
        return (
            <UserList userList={this.props.userList}/>
        )
    }
}


const mapStateToProps = state => ({userList: state.userListState});
const mapDispatchToProps = {usertypeUserlistActionCreator};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobSeek)