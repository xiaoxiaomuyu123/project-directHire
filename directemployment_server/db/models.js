/*
包含 n 个操纵数据库集合数据的 module 模块
 */

// 引入 mongoose
const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/directEmployment', {useNewUrlParser: true});

// 获取数据库连接对象
const connection = mongoose.connection;

// 给连接对象绑定连接事件
connection.on('connected', function() {
    console.log('连接数据库成功')
})

/************ 设计保存用户信息的文档模型  *********************/
// const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    usertype: {type: String, required: true}, // 用户类别，只有 ‘jobSeek’ 和 ‘boss’
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})

// 发布文档模型，这里返回的是一个构造函数
const UserModel = mongoose.model('user', userSchema)

// 向外暴露模块
// module.exports = xxx  暴露一个模块
// exports.xxx = value 暴露多个模块
// exports.yyy = value 暴露多个模块

// 这个文件中不止会创建一个模型，还会有谈话记录等等多个模型都需要被暴露
exports.UserModel = UserModel;


/******** 设计聊天相关信息的文档模型  ***********/
const chatSchema = new mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的 id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
});

const ChatModel = mongoose.model('chat', chatSchema);  // 集合为 chats

// 向外暴露模块
// module.exports = xxx  暴露一个模块
// exports.xxx = value 暴露多个模块
// exports.yyy = value 暴露多个模块

// 这个文件中不止会创建一个模型，还会有谈话记录等等多个模型都需要被暴露
exports.ChatModel = ChatModel;