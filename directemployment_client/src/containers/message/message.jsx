/*
Message 对话消息列表组件 主界面的路由容器组件
 */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
const Item = List.Item
const Brief = Item.Brief

/* 对 chatMsgs 进行分组，按照 chat_id 进行分组，并得到每个分组最后一条消息组成的数组
    1. 找出每个分组的最后一条消息 lastMsg，并用一个对象保存 {chat_id1： lastMsg1, chat_id2： lastMsg2, ...}
    2. 得到所有这样的 lastMsg，并保存在一个数组中 [lastMsg1, lastMsg2, ...]
    3. 对数组进行排序（按照创建时间 create_time 降序排序）
 */
function getLastMsgs(chatMsgs, userid) {
    // 1. 找出每个分组的最后一条消息 lastMsg，并用一个对象保存
    const lastMsgObjs = {};
    chatMsgs.forEach(msg => {

        // 对 msg 消息是已读还是未读进行统计：1. 别人发给我的； 2. 消息是未读的
        if(msg.to === userid && !msg.read) {
            msg.unReadCount = 1;
        } else {
            msg.unReadCount = 0;
        }


        const chatId = msg.chat_id;
        // 在 lastMsgObjs 尝试取出这条 msg，结果可能是有或者没有
        const lastMsg = lastMsgObjs[chatId];
        if(!lastMsg) { // 如果没有，就证明当前的这个 msg 就是所在组的 lastMsg。
            // 但是目前这个 msg 是不是最后的 msg，还不确定，需要遍历完了，才知道
            lastMsgObjs[chatId] = msg;
        } else {
            // 在 unReadCount = 已经统计过得未读数量 + 最新的未读数量
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;
            // 如果有，就再判断，如果 msg 比之前存入的 lastMsg 创建的时间晚，那么就让这条 msg 替换掉之前的 lastMsg
            if(msg.create_time > lastMsg.create_time) {
                lastMsgObjs[chatId] = msg;
            }
            lastMsgObjs[chatId].unReadCount = unReadCount;

        }
    })
    // 2. 得到所有这样的 lastMsg 对象，并将这些对象保存在一个数组中
    const lastMsgs = Object.values(lastMsgObjs);
    // 3. 对数组进行排序（按照创建时间 create_time 降序排序）
    lastMsgs.sort((m1, m2) => m2.create_time - m1.create_time);
    return lastMsgs;
}

class Message extends Component {
    render() {
        const {userState} = this.props;
        const {users, chatMsgs} = this.props.chatState;

        /*
        msg 的格式
        const chatSchema = new mongoose.Schema({
        from: {type: String, required: true}, // 发送用户的 id
        to: {type: String, required: true}, // 接收用户的 id
        chat_id: {type: String, required: true}, // from 和 to 组成的字符串
        content: {type: String, required: true}, // 内容
        read: {type:Boolean, default: false}, // 标识是否已读
        create_time: {type: Number} // 创建时间
        unReadCount
        });
         */
        // 对 chatMsgs 进行分组，按照 chat_id 进行分组
        const lastMsgs = getLastMsgs(chatMsgs, userState._id);

        return (
            <List style={{marginTop: 50, marginBottom: 50}}>

                {
                    lastMsgs.map(msg => {
                        const targetId = msg.to === userState._id ? msg.from : msg.to;

                        return (
                            <Item key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={users[targetId].header ? require(`../../assets/images/${users[targetId].header}.png`) : null}
                                arrow='horizontal'
                                  onClick={() => this.props.history.push(`/chat/${targetId}`)}
                            >
                                {msg.content}
                                <Brief>{users[targetId].username}</Brief>
                            </Item>
                            )
                    })
                }

            </List>
        )
    }
}

const mapStateToProps = state => ({userState: state.userState, chatState: state.chatState});
const mapDispatchToProps = {};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message)