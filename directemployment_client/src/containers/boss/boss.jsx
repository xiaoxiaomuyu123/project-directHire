/*
boss 主界面的路由容器组件，显示应聘者的用户列表
 */

import React, {Component} from "react"
import {connect} from "react-redux"

import UserList from "../../components/user-list/user-list"
import {usertypeUserlistActionCreator} from "../../redux/actions"

class Boss extends Component {

    componentDidMount() {
        this.props.usertypeUserlistActionCreator("jobseek");
    }

    render() {
        console.log("boss 组件中的 userList", this.props.userList);
        return (
            <UserList userList={this.props.userList} />
        )
    }
}

const mapStateToProps = state => ({userList: state.userListState});
const mapDispatchToProps = {usertypeUserlistActionCreator};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Boss)