/*
选择用户头像的 UI 组件
 */

import React, {Component} from "react"
import { List, Grid } from 'antd-mobile'
import  PropTypes from 'prop-types'

class HeaderSelector extends Component {

    constructor(props) {
        super(props);
        // 准备需要显示的 头像 列表数据
        this.headerList = [];
        for(let i = 0; i < 20; i++) {
            let j = i + 1;
            const text = '头像' + j;
            this.headerList.push({
                text,
                icon: require(`../../assets/images/${text}.png`)
            })
        }
    }

    static poroTypes = {
        setHead: PropTypes.func.isRequired,
    }

    state = {
        icon: null    // 图片对象，没有默认值
    }

    handleClick = ({text, icon}) => {
        // 更新本组建的状态
        this.setState({icon})
        // 调用从父组件传进来的函数，更新复组建的状态
        this.props.setHead(text)
    }

    render() {
        const icon = this.state.icon;
        const listHead = icon ?  (
            <div>
                '已选择头像'<img src={icon} alt="用户头像"/>
            </div>
        ) :'请选择头像';
        return (
            <List renderHeader={() => listHead}>
                <Grid data={this.headerList}
                      columnNum={5}
                      onClick={this.handleClick}/>
            </List>

        )
    }
}

export default HeaderSelector