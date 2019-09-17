# 直聘项目
## 1. 项目描述
求职者和招聘者聊天的应用
- 客户端：
    - 1. 进入前端页面，必须注册登录
        - 用户类型：招聘者，应聘者
        - 注册后，可以完善用户信息，选取何时的头像
    - 2. 注册登录好以后，求职者跳转到招聘者的列表，招聘者可以跳转到求职者的列表。
    - 3. 页面最底下有三个跳转按钮：求职，消息，个人

## 2. 前端路由
这是一个项目中比较重要的点。要先对整体结构比较清楚的时候，去拆分路由，再做里面比较细节的东西。
### 2.1 UI 组件和容器组件的区别  
- UI 组件不需要和 redux 做交互，只起到展示作用，所以放在 components 文件夹中
- 容器组件，需要和 redux 做交互，要放在 containers 文件夹中
### 2.2 使用 react-router-dom 问题
#### 2.2.1 注册路由，HashRouter 和 BrowerRouter 的区别
- 相同点：目的都是为了 url 同步
#### 2.2.2 使用 Route 的问题
- 目的：当浏览器的 url 中的 path 和 Route 组件的 path 相同时就会渲染对应的组件。
- Route 组件会自动传入三个参数：match，location，history。
    - history：
    - location：
    - match：
- 在 '/' 后面增加参数 :filter?, 以便以后我们从 URL 中读取参数 :filter。可以在组件中获取 params 的属性。params 是一个包含 url 中所有指定参数的对象。 例如：如果我们访问 localhost:3000/SHOW_COMPLETED，那么 match.params 将等价于 { filter: 'SHOW_COMPLETED' }
#### 2.2.3 使用 Route 一般会伴随使用 Switch 组件
- 作用：只渲染第一个和 path 匹配的组件。具有唯一性，也就是只渲染一个匹配的组件；Route 会渲染所有匹配的组件。所以想要实现根据不同的 url 跳转不同页面的效果，要使用 Switch 组件把多个 Route 组件包起来。  
- 使用的时候要注意顺序。'/' 会匹配所有路径，再加上 Switch 会渲染匹配的第一个组件，那么如果把 main 组件放在第一位，那么无论页面上 url 是哪一个，都会渲染 main 组件，不会渲染其他组件。因为找到的匹配的第一个组件总是 main 组件。
```
<HashRouter>
    <Switch>
        <Route path='/register' component={Register}/>
        <Route path='/login' component={Login}/>
        <Route component={Main}/>
    </Switch>
</HashRouter>
```
### 2.4 使用 redux 遇到的问题
#### 2.4.1 多个 reducer 函数合并的问题
- 使用方法：
    1. 在 redux 引入 combineReducers
    2. `combineReducers({state1: reducer1, state2: reducer2})`   
    也可以用解构赋值的方法，把 state1 和 reducer1 的名字写成一样的，那么代码就变成了     
    `combineReducers({reducer1, reducer2})`
#### 2.4.2 redux 最核心的模块 —— store
##### 2.4.2.1 创建和使用异步 action
- 创建异步 action：   
    - 要注意 actionCreator 如果返回的是一个对象：{type：，data：} 那么创建的就是一个同步 action。 actionCreator 返回的是一个函数，那么创建的就是一个异步 action。而且异步 action 一般返回的函数要传递一个 dispatch 参数，在返回的函数中，最后也要分发一次对应的同步 action。
    - 中间件：thunk   
    把同步 action 和网络请求联系起来的标准做法是用 Redux Thunk 中间件。需要引入 redux-thunk 这个库。通过指定的 middleware，这样 actionCreator 可以返回函数，这样 actionCreator 就变成了 thunk。后面详细总结 middleware 是怎样工作的。   
    当 actionCreator 返回函数时，这个函数会被 Redux Thunk middleware 执行。这个函数并不需要保持纯净；它还可以带有副作用，包括执行异步 API 请求。这个函数还可以 dispatch action，就像 dispatch 前面定义的同步 action 一样。thunk 的一个优点是它的结果可以再次被 dispatch  
    - applyMiddleware()  
    我们是如何在 dispatch 机制中引入 Redux Thunk middleware 的呢？我们使用了 applyMiddleware()
    ```
    import {createStore, applyMiddleware} from 'redux'
    import thunk from 'redux-thunk'
    import {composeWithDevTools} from 'redux-devtools-extension'
    import reducers from './reducers'

    export default createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))
    ```
    将 reducer 传入 Redux 提供的 createStore 函数中，它返回了一个 store 对象。
- 异步数据流：  
默认情况下，createStore() 所创建的 Redux store 没有使用 middleware，所以只支持 同步数据流。也就是说要想支持 异步数据流，必须使用 middleware。
### 2.5 前端入口 index.jsx 配置
```
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {HashRouter, Switch, Route} from 'react-router-dom'

import store from './redux/store'
import Login from './containers/login/login'
import Register from './containers/register/register'
import Main from './containers/main/main'

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
                <Route component={Main}/>
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('root'))
```
这里需要说明的是从 react-redux 中引入的 Provider 的作用。将它挂载在组件树的根部，将 store 对象传入 Provider，目的是保证我们在任何时候通过 react-redux 的 connect 连接到 Redux 时，store 可以在组件中正常使用，也就是 使用 connect 将容器组件和 Redux 连接后，使得在任何组件中都可以访问到 state 对象里面的数据

### 2.6 react-app 引入静态资源问题：待完善
- 问题描述：想要在登录和注册页面引入一个 logo 图片，用的语法是   
 `<img src="./logo.png" alt="logo" className='logo-img'/>`  
 这样引入后，在页面并不能显示图片。
- 解决方案：
    - **方案一：** 用 ES6 的 import 语法，先在 jsx 文件最前面用 import 引入这个图片，将引入结果用一个变量接收    
    `import logo = "./logo.png"`    
    然后再 img 标签的 src 中使用变量的方式加载  
    `<img src={logo} alt="logo" className='logo-img'/>`
    - **方案二：**
### 2.7 模块化编程，前端 ES6 的 import，后端的 CommomJS
#### 2.7.1 ES6 模块化规范
- 引入：
```
import {connect} from "react-dex"
import ReactDom from "react"
```
- 导出：
```
// 导出多个模块
export xxx
export yyy

// 导出一个默认的模块
export default xxx
```
#### 2.7.2 CommomJS 规范
- 引入：
`const fs = require('fs')`
    - require 规则：
        1. / 表示绝对路径    ./ 表示当前文件所在路径
        2. 支持 js json node 这三个扩展名，如果调用的时候没有写扩展名，会根据这三个扩展名依次尝试
        3. 不写路径会被认为是 bulid-in 模块，或者是安装在各级目录内 node_modules 内的第三方模块。
        4. `const UserModel = require('./../db/module').UserModel;`  
       'db/module' 文件向外暴露了多个模块，所以在引用的时候要在文件后面再加上 .UserModel
   - require 特性：
        1. module 被加载的时候就会立即执行，加载之后会被缓存。只加载一次，第二次加载的时候直接用放在内存中的结果了
        2. 要避免模块之间循环依赖，因为循环依赖之后，只执行已经输出的部分，还未执行的部分不会输出。
- 导出:
```
// 向外暴露模块
module.exports = xxx    //暴露一个模块
exports.xxx = value  //暴露多个模块
exports.yyy = value  //暴露多个模块
```
### 2.8 在 react 发送 ajax 有两个地方：componentDidMount 和 回调函数，两种情况的应用场景是什么，有什么不同呢？
- 如果要让网页自动发送 ajax，请求数据，就把发送 ajax 的操作放在 componentDidMount。
- 如果是要点击某个按钮，才发送 ajax 请求数据，就把发送 ajax 的操作放在事件的回调函数里面。
### 2.9  同步 action 和 异步 action
- 需要和后台通信，需要发送 ajax，就用异步 action。
- 不需要和后台通信就用 同步 action。
### 2.10 非路由组件如何使用路由组建的 API？
使用 “react-router-dom” 里的 withRouter 包装组件，就能给包装后的组件传入路由组件的 history，location，match 这三个参数。
### 2.11 cookie
在发送请求的时候，不需要进行额外操作，浏览器中的 cookie 信息就会自动随着请求一起被发送到后端服务器中，cookie 中的信息时以键值对的形式存储的，所以可以用 resquest.cookies.key 来进行访问。
### 2.12 页面重定向跳转及自动登录问题
#### 2.12.1 注册和登录成功如何实现页面的跳转问题？
根据有没有 header 来判断该跳转到哪个页面。
- 没有 header，说明个人信息还没有完善，需要跳转到各自的信息完善界面 —— ‘bossinfor’，‘jobseekinfor’
- 有 heaser，说明个人信息已经完善，就跳转到各自的主页面 —— ‘boss’， ‘jobseek’
- **具体跳转方案**：   
    - redux 中 reducer 的 userState 添加重定向的跳转信息：属性名是 redirectTo，属性值就是字符串 ‘bossinfor’，‘jobseekinfor’，‘boss’ 或 ‘jobseek’。利用 函数 动态填写这部分的值
    - register 和 login 组件读取到 redux 中 userState 的值，根据 redirectTo 进行重定向跳转。
#### 2.12.2 用 Redirect 组件进行重定向和用 this.props.history.replace('/路径') 的使用场景分别是什么？
需要浏览器自己判断自动跳转的时候，用 Redirect 这个组件；需要再页面中给按钮绑定事件，点击按钮的时候才进行跳转，就用 this.props.history.replace('/路径')。这个结论还有疑点，需要再继续查证。
#### 2.12.3 实现自动登录功能：
- 场景：在前端浏览器中已经登陆过了，但是关闭浏览器或刷新页面的时候，实现自动登录。
- 解决方案： 第一次登陆的时候，后端会设置响应头，把 userid 写入前端浏览器的 cookie 中。这样，浏览器在每次发送请求的时候，都会自动携带 cookie 信息里面的 userid 发送到后端。一旦发生页面刷新或者关闭浏览器再启动的情况，如果 cookie 信息没有过期，那么在渲染页面的时候会想后端发送 ajax 请求，同时携带了 cookie 信息里面的 userid。那么后端服务器会在数据库中根据 userid 查找用户信息，返回相应的用户信息到前端，在渲染页面，这样就实现了自动登录。
### 2.13 如何实现退出登录的功能
删除 cookie 中的 userid 和 redux 里面的 userState。具体方法：
- 删除 cookie 中的 userid 可以使用 “js-cookies” 这个库，用 `Cookies.remove('userid')`
- 删除 redux 中的 userState：
修改任何 redux 中的 state 都必须最受流程：分发 action，触发 reducer 来进行改变。
### 2.13 父子组件见得通信
### 2.14 如何实现在 message 组件中点击用户头像，跳转到 chat 页面。
首先需要明确不同的用户跳转到的 chat 页面是不同的。那么，我们如何来标记不同的用户呢？用的是 userid。具体做法是在 main 组件中注册 chat 的路由。此时 chat 组建的路由 path 的形式和其他组件的不一样。   
`<Route path='/chat/:userid' component={Chat}></Route>`  
`:userid` 实际上是一个占位符，用来标记不同用户锁掉转的不同网址。后面如何使用这个参数呢？在 UserList 组件中的 Card 组件绑定点击事件。这个绑定的事件的内容是：要用到路由组件的 `history.push('/chat/${userid}')`

## 3. 后端
### 3.1 数据库：mongdb
- 只要在全局安装了 mongdb，那么可以用任何与延连接他，不需要每一次创建新的项目都要安装，只要在本机启动服务器就行啦
- 每一次创建新的项目，都需要安装一次 moooges，用于本项目连接数据库。

### 3.2 跨域问题
前端注册界面的 url 是 http://localhost:3000/#/login ，在点击注册按钮的时候，会向后端发送 ajax 请求，后端的 url 是 http://localhost:4000/#/login ，前后端的端口号不一致，会产生跨域请求，不加处理会跨域请求失败。一般的跨域请求有两种方式：jsonp 和 cros。jsonp 只能对 get 方法进行使用，而我们这里是 post 方法，所以 jsonp 这种方法排除。 CROS 要对后端进行设置。我们在这里用第三种方法——代理服务器的方式，来解决跨域的问题。   

**代理服务器的思路**     
跨域的问题存在于浏览器，我们在前端的 3000 端口开一个代理服务器，先将前端的请求发送到代理服务器上，然后在将这个请求从代理服务器发送到正正的服务器，从前端的角度来看，请求还是发送到 3000 端口的，就不是跨域了。这样就解决了跨域问题。

### 3.3 前端使用 get 方法发送请求，后端如何在 url 中解析出想要的参数？
### 3.4 实时聊天的功能怎么实现？
#### 3.4 1 利用 socketIO 实现前后端通信
用 socket.io 这个库实现，前后端应用都要下载，它能实现多人远程实时聊天的库。
- socket.io 包装的是 H5 websocket 和 轮询。如果是新版的浏览器，就使用 H5 websocket，老的浏览器就使用轮询。HTTP x协议只能由浏览器向服务器端发送消息，但是实时聊天需要 浏览器和服务器在一个平等的位置上，进行相互通信，也就是，希望浏览器在向服务器端发送请求的同时，服务器也可以向浏览器发送请求，传输消息。
    - 使用了单例对象，实现只对下面的代码调用一次。
    ```
    // 连接服务器，得到代表连接的 socket 对象
    const socket = io("ws://localhost:8080");
    ```
- 聊天消息的内容要用数据库存起来。  

**具体做法是：**
1. **服务器和客户端分别引入 socketIO 模块。**  
但是要注意服务器端的引入方法：新建 socketIO 文件夹，在该文件夹新疆 socketio_server.js 文件。下面是该文件的内容，`require('socket.io')` 是一个函数，需要传入参数 server。传入这个参数并执行之后，才会返回一个 io 对象。该文件导出的是一个函数，函数的参数是 express 的服务器 server。那么怎么得到这个 server 呢？在后端 bin 文件夹的 www.js 文件中进行引用这个socket。引用的位置是，在设置好服务器后，也就是 `var server = http.createServer(app);` 的后面引用这个 socketio —— `require('../socketio/socket_server')(server);` 直接引用文件，但是注意，该文件返回的是一个下面这样的函数，所以后面要传入创建好的服务器 server。
```
module.export = function(server) {
    const io = require('socket.io')(server)
}
```
客户端引用的方法就是正常引入 `import io from "socket.io-client"` 在 index.js 入口文件中引入这个前端的 socketIO.js 文件。`import "../../socketIO/socketIO"`
也就是说，无论客户端还是服务器端先要产生一个 io。  

2. **客户端连接服务器**
浏览器端的连接方法：`const socket = io('ws://loaclhost:20000');`     
3. **服务器监视是否有客户端连接进服务器**  
传入的 socket 是连接对象？是什么呢？是连接吗？
```
module.exports = function (server) {
    const io = require('socket.io')(server)

    // 监视客户端和服务器的连接
    io.on('connection', function(socket) {
        console.log("有一个客户端连接上了服务器")
    })
}
```  
4. 客户端发送消息和服务器端接收消息：emit 是指分发消息  
- 客户端发送消息：`socket.emit('sendMsgFromClient', {name: 'abc'});`
- 服务器端接收消息并进行处理，处理之后再向客户端发送消息：  
```// 绑定监听，用来监听客户端发送过来的消息
        socket.on('sendMsgFromClient', function(data) {
            console.log('服务器接收到客户端发送的消息：', data);

            // 接收到数据后，对数据进行处理
            data.name = data.name.toUpperCase();

            // 服务器端向客户端发送消息
            socket.emit('receiveMsgFromServer', data)
            console.log("服务器向客户端发送了消息：", data)
```
完整的代码：
```
module.exports = function (server) {
    const io = require('socket.io')(server);

    // 监视客户端和服务器的连接
    io.on('connection', function(socket) {
        console.log("有一个客户端连接上了服务器")

        // 绑定监听，用来监听客户端发送过来的消息
        socket.on('sendMsgFromClient', function(data) {
            console.log('服务器接收到客户端发送的消息：', data);

            // 接收到数据后，对数据进行处理
            data.name = data.name.toUpperCase();

            // 服务器端向客户端发送消息
            socket.emit('receiveMsgFromServer', data)
            console.log("服务器向客户端发送了消息：", data)

        })
    })
}
```
- 客户端接收客户端发送的消息  
`// 绑定监听接受服务器发送的消息
socket.on('receiveMsgFromServer', function(data) {
    console.log("客户端接收到服务器发送的消息：", data)
})`
这样就完成了前后端的通信。

#### 3.4.
### 3.5 实时聊天出现延迟，发送消息不能及时显示在界面上，需要刷新或者发送下一条的时候才能显示
实际上不是延迟显示在界面上，而是被底部的发送信息的组件挡住了，我们看不见了。用 css 样式，设置消息显示的内容的 margin-botton 为 50px，问题就解决了。

### 3.6 express 语法问题：
#### 3.6.1 编写后台注册接口时，报错：“Can't set headers after they are sent”
当时写的程序是：
```
new UserModel({username, password: md5(password), usertype}).save(function(error, userDoc) {
                if(error) { return console.log(error)}

                console.log("新注册的用户已经在数据库中保存好了：", userDoc);
                response.send({code: 0, data: {_id: userDoc._id, username, usertype}});

                response.cookie({userid: userDoc._id}, {maxAge: 1000*60*60*24*7})

```
response.send() 这条语句执行以后，也就是已经向前端发送完数据后，改代码块就已经结束，不会再向下执行了，也就是说当执行完 response.send() 语句以后，向前端是发送不了 cookie 的。正确的过程是，先执行   
`response.cookie({userid: userDoc._id}, {maxAge: 1000*60*60*24*7})`  
这句话设置了响应头里面的 cookie 信息，然后再执行 response.send() 语句，向前端发送数据。
### 3.7 写后端用户更新的路由接口碰到的问题
#### 3.7.1 思路：
在后端用 cookie 获取前端注册或者登录用户的 userid，用 userid 在数据库中查询。不用用户名 来袭哈讯的原因是，确保现在用户是登录状态。
- 后端 express 用 cookie 获取 userid 的语法   
`const userid = request.cookies.userid`
- node 后端不能用扩展运算符 `...`
- Object.assign(obj1, obj2, obj3) 将多个对象合并，返回合并后的对象

# 4. 亮点
## 4.1 跨域问题
