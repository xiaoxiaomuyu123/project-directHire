// // 引入客户端 io
// import io from 'socket.io-client'
//
// // 连接服务器 , 得到代表连接的 socket 对象
// const socket = io('ws://localhost:8080')
// // 绑定 'receiveMessage' 的监听 , 来接收服务器发送的消息
// socket.on('receiveMsg', function (data) {
//     console.log(' 浏览器端接收到消息:', data)
// })
// // 向服务器发送消息
// socket.emit('sendMsg', {name: 'Tom', date: Date.now()})
// console.log(' 浏览器端 向服务器发送 消息:', {name: 'Tom', date: Date.now()})

import io from "socket.io-client"

// 连接服务器，得到代表连接的 socket 对象
const socket = io("ws://localhost:8080");

// 绑定监听，客户端接收到了从服务器端发送回来的消息
socket.on('receiveMsg', function(data) {
    console.log("客户端接收到了从服务器端发送回来的消息:", data);
});

// 客户端发送消息
socket.emit('sendMsg', {name: 'qindahu is fool！'});
console.log("浏览器向服务器发送了消息：", {name: 'qindahu is fool！'});


