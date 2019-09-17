// module.exports = function (server) {
// // 得到 IO 对象
//     const io = require('socket.io')(server)
// // 监视连接 ( 当有一个客户连接上时回调 )
//     io.on('connection', function (socket) {
//         console.log('soketio connected')
// // 绑定 sendMsg 监听 , 接收客户端发送的消息
//         socket.on('sendMsg', function (data) {
//             console.log(' 服务器接收到浏览器的消息', data)
// // 向客户端发送消息 ( 名称 , 数据 )
//             io.emit('receiveMsg', data.name + '_' + data.date)
//             console.log(' 服务器向浏览器发送消息', data)
//         })
//     })
// }

module.exports = function(server){
    const io = require("socket.io")(server);

    // 监视客户端和服务器的连接
    io.on('connection', function (socket) {
        console.log("有一个客户端连接到了服务器");

        // 绑定监听，接收客户端发送过来的消息
        socket.on('sendMsg', function (data) {
            console.log('服务器接收到了从浏览器发送过来的消息：', data);
            // 对接收到的数据进行处理
            data.name = data.name.toUpperCase();

            // 服务器把处理好的数据发送给浏览器
            socket.emit('receiveMsg', data);
            console.log("服务器向浏览器发送了消息：", data);
        })
    })

}