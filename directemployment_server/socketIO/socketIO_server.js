const {ChatModel} = require('../db/models')

module.exports = function(server){
    const io = require("socket.io")(server);

    // 监视客户端和服务器的连接
    io.on('connection', function (socket) {
        console.log("有一个客户端连接到了服务器");

        // 绑定监听，接收客户端发送过来的消息
        socket.on('sendMsg', function ({from, to, content}) {
            console.log('服务器接收到了从浏览器发送过来的消息：', {from, to, content});

            /* 处理数据： 保存消息到数据库 */

            // 准备 chatMsg 对象相关的数据 chat_id， create_time。chat_id 格式是 to 和 from 的 userid 拼成的字符串
            // from_to，或者 to_from。但是要保证无论 from_to 还是 to_from 都是一样的结果
            const chat_id = [from, to].sort().join('_');
            const create_time = Date.now();

            // 把信息保存到数据库
            new ChatModel({from, to, content, chat_id, create_time}).save(function(error, chatMsg) {
                if(error) { return console.log(error) }
                /*
                消息保存好以后，要向客户端发消息，那么究竟向哪个客户端发送消息呢？是 “我自己”，还是给我发消息的人呢？
                答案是两者都要发送。给我发消息的人这个客户端的聊天信息是全的，但是 “我自己” 聊天信息不全。
                缺少 chat_id，create_time。
                服务器不一定向目标客户端发送消息信息。因为目标客户端可能不在线
                */
                // socket.emit("receiveMsg", chatMsg);  这样只是给“我自己”发送了消息信息，没有给目标客户端发送
                // 向所有连接到服务器的人都发送消息，这种方法简单，但是不高效，会让所有人都收到这个消息。
                // 所以就要在浏览器端确认一下，这个消息需不需要显示。无关的客户端上不显示
                io.emit('receiveMsg', chatMsg)
            })


        })
    })

}