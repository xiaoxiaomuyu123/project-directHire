import React, {Component} from "react"
import {connect} from "react-redux"
import {NavBar, List, InputItem, Grid, Icon} from "antd-mobile"

import {sendMsgActionCreator, readMsgActionCreator} from '../../redux/actions'

const Item = List.Item;

class Chat extends Component {

    state = {
        content: '',
        isShow: false   // 是否显示表情列表

    }

    componentDidMount() {
        // 初始化表情数据
        const emojis = [
            '😃', '😄', '😄', '😁', '😆', '😅', '😇', '😂', '😍',
            '😃', '😄', '😄', '😁', '😆', '😅', '😇', '😂', '😍',
            '😃', '😄', '😄', '😁', '😆', '😅', '😇', '😂', '😍',
            '😃', '😄', '😄', '😁', '😆', '😅', '😇', '😂', '😍',
            '😃', '😄', '😄', '😁', '😆', '😅', '😇', '😂', '😍'
        ]
        this.emojis = emojis.map((emoji) => ({text: emoji}))
        // 初始显示列表，显示最底部的消息
        window.scrollTo(0, document.body.scrollHeight);



    }

    componentDidUpdate () {
        // 更新显示列表的最底部
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount() {
        // 发送请求，更新消息未读数量,将就需要有一个异步 action。
        // 但是为什么要在这里面有一个异步 action？可以直接发送 ajax 吗？
        const from = this.props.match.params.userid;
        const to = this.props.userState._id;
        this.props.readMsgActionCreator(from, to)
    }

    handleChange = (value) => {
        this.setState({content: value})
    }

    handleClick = () => {
        // 收集数据，谁发给谁什么内容。“我” 给别人发送数据。
        // 从 redux 里的 state 中获取 “我” 的 _id
        const from = this.props.userState._id;
        // 从路由组件里传进来的参数获得别人的 userid
        const to = this.props.match.params.userid;

        const content = this.state.content.trim();

        // 发送请求(发消息)
        if(content) {
            this.props.sendMsgActionCreator({from, to, content})
        }

        // 清除输入框内的文字
        this.setState({content: '', isShow: false});

    };

    // 切换表情列表的显示
    toggleShow = () => {
        const isShow = !this.state.isShow;
        this.setState({isShow});
        if(isShow) {
            // 异步手动派发 resize 事件,解决表情列表显示的 bug
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'))
            }, 0)
        }
    };

    render() {
        // 当前登录用户所有的相关信息，头像，用户名，职位，信息，薪资
        const userState = this.props.userState;
        // users 包含所有户用的信息的对象。属性名是 _id，属性值是 {username, header},
        // chatMsgs 与当前登录的用户信息相关的聊天内容
        const {users, chatMsgs} = this.props.chatState;

        // 我们要显示的是，当前用户“我”和某一个特定的人的聊天信息，而 chatMsgs 是对所有人和“我”的聊天信息
        // 所以需要对 chatMsgs 进行过滤。要根据 chat_id 来过滤

        // 1. 计算当前聊天的 chatId
        //      a. 计算当前登录用户的 id
        const meId = userState._id;

        // 页面渲染的时候有可能 users 为空，这样就找不到 header，会报错，所以加一个判断
        // 当 users[meId] 没有值的时候，就返回 null。这里注意，不能用 ！users
        // 因为 object 都是真 ，即使是空对象也是真。
        if(!users[meId]) {
            return null;
        }
        //      b. 目标用户的 id
        const targetId = this.props.match.params.userid;
        console.log("targetId", targetId)

        //      c. 计算当前聊天的 chatId
        const chatId = [meId, targetId].sort().join('_');

        // 对 chatMsgs 进行过滤。要根据 chat_id 来过滤。过滤好的 msgs 有两种情况:
        // 可能是“我”发给对方的，也可能是对方发给我的
        const msgs = chatMsgs.filter((chatMsg) => chatMsg.chat_id === chatId);

        // 得到目标用户的头像。还要考虑一下对方信息不完善的情况
        const targetHeader = users[targetId].header;
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null;

        return (
            <div id="chat-page">
                <NavBar
                    icon={<Icon type='left'/>}
                    className='sticky-header' onLeftClick={() => this.props.history.goBack()}>
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop: 50, marginBottom: 50}}>
                    {
                        msgs.map((msg) => {
                            if(msg.to === meId) { // 对方发给“我”
                                return (
                                    <Item key={msg._id} thumb={targetIcon}>
                                        {msg.content}
                                    </Item>
                                )
                            } else { // “我”发给对方
                                return (
                                    <Item key={msg._id} className='chat-me' extra='我'>
                                        {msg.content}
                                    </Item>
                                )
                            }
                        })
                    }

                </List>
                <div className='am-tab-bar'>
                    <InputItem
                        placeholder='请输入'
                        value={this.state.content}
                        onChange={(value) => this.handleChange(value)}
                        onFocus={() => this.setState({isShow: false})}
                        extra={
                            <span>
                                <span onClick={this.toggleShow} style={{marginRight: 5}}>😊</span>
                                 <span  onClick={this.handleClick}>发送</span>
                            </span>

                        }
                    />

                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                carouselMaxRow={4}
                                isCarousel={true}
                                onClick={(item) => {
                                    this.setState({content: this.state.content + item.text})
                                }}
                            />
                        ) : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({userState: state.userState, chatState: state.chatState});
const mapDispatchToProps = {sendMsgActionCreator, readMsgActionCreator};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat)