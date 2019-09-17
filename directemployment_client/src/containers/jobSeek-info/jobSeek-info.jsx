/*
招聘者信息的路由组件
 */

import React, {Component} from "react"
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'

import {updateActionCreator} from "../../redux/actions"
import HeaderSelector from '../../components/header-selector/header-selector'

class JobSeekInfo extends Component {

    state = {
        header: '',    // 默认头像为空
        post: '',    // 职位名称
        info: '',    // 个人介绍
    }

    handleChange = (valuename, value) => {
        this.setState({
            [valuename] : value
        })
    }

    save = () => {
        console.log(this.state);
        this.props.updateActionCreator(this.state);
    }

    setHead = (header) => {
        this.setState({header})
    }

    render() {
        const {header, usertype} = this.props.userState;
        console.log(header, usertype);
        if(header) {
            let path = usertype === "jobseek" ? "/jobseek" : "/boss";
            return <Redirect to={path} />
        }

        return(
            <div>
                <NavBar>求职者个人信息完善</NavBar>
                <HeaderSelector setHead={this.setHead}/>
                <InputItem onChange={(value) => this.handleChange('post', value)}>求职岗位:</InputItem>
                <TextareaItem title='个人介绍:' raw={4}
                                onChange={value => this.handleChange('info', value)}/>
                <Button type='primary' onClick={this.save}>保存</Button>
            </div>
        )
    }
}

const mapStateToProps = state => ({userState: state.userState});
const mapDispatchToProps = {updateActionCreator};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(JobSeekInfo)