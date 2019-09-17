import React, {Component} from "react"
import { TabBar } from "antd-mobile"
import PropTypes from "prop-types"
import {withRouter} from "react-router-dom"

const Item = TabBar.Item;

// 希望在非路由组件中使用路由组件的方法：用 react-router-dom 中的 withRouter，
// 用法类似于 react-redux 里面的 connect
class NavFooter extends Component {

    static propTypes = {
        navList: PropTypes.array.isRequired,
        unReadCount: PropTypes.number.isRequired
    }

    render() {
        let {navList, unReadCount} = this.props;
        navList = navList.filter(nav => !nav.hide);
        // 请求的 path
        const path = this.props.location.pathname;
        return (
            <div className='an-tab-bar'>
                 <TabBar>
                     {navList.map((nav, index) => (
                         <Item key={index}  title={nav.text}
                               badge={nav.path === "/message" ? unReadCount : 0}
                               icon={{uri: require(`./images/${nav.icon}.png`)}}
                               selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                               selected={nav.path === path}
                               onPress={() => this.props.history.replace(nav.path)}/>
                     ))}
                 </TabBar>
            </div>
        )
    }
}

export default withRouter(NavFooter)