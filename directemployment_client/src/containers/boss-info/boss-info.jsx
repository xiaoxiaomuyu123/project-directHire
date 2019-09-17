/*
招聘者信息的路由组件
 */

import React, {Component} from "react"
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"
import {NavBar, InputItem, TextareaItem, Button} from 'antd-mobile'

import HeadSelector from '../../components/header-selector/header-selector'
import {updateActionCreator} from "../../redux/actions"

class BossInfo extends Component {

    state = {
        header: '',
        post: '',    // 职位名称
        company: '', // 公司名称
        info: '',    // 职位要求
        salary: ''   // 工资
    }

    setHead = (header) => {
        this.setState({header})
    }

    handleChange = (valuename, value) => {
        this.setState({
            [valuename] : value
        })
    }

    save = () => {
        this.props.updateActionCreator(this.state)

    }

    render() {
        const {header, usertype} = this.props.userState;
        if(header) {
            let path = usertype === "boss" ? "/boss" : "/jobseek"
            return <Redirect to={path}/>
        }

        return(
            <div>
                <NavBar>招聘者信息完善</NavBar>
                <HeadSelector setHead={this.setHead}/>
                <InputItem placeholder='请输入职位名称' onChange={(value) => this.handleChange('post', value)}>招聘职位:</InputItem>
                <InputItem placeholder='请输入公司名称' onChange={(value) => this.handleChange('company', value)}>公司名称:</InputItem>
                <InputItem placeholder='请输入职位薪资' onChange={(value) => this.handleChange('salary', value)}>职位薪资:</InputItem>
                <TextareaItem title='职位要求' rows={3}
                              placeholder='请输入职位要求'
                              onChange={(value) => this.handleChange('info', value)} />
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
)(BossInfo)