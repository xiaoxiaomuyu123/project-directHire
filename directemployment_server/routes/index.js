const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5');
const filter = {password: 0}

const {UserModel, ChatModel} = require('../db/models');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由，用于用户注册

/*
需求:
a. 后台应用运行端口指定为 4000
b. 提供一个用户注册的接口
a) path 为: /register
b) 请求方式为: POST
c) 接收 username 和 password 参数
d) admin 是已注册用户
e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
f) 注册失败返回: {code: 1, msg: '此用户已存在'}
 */

console.log('后端 Router')

// 注册路由  这是一个接口，写好这个接口要测试一下
router.post('/register', function(request, response) {
  // console.log('router.post', request);
  // 获取数据信息：想明白从哪里获得信息，获取哪些信息
  const {username, password, usertype} = request.body;
  console.log(request.body) ;

  // 处理数据信息：获取信息后在数据库中查询，如果数据库已经存在，就返回提示错误的信息；不存在，就保存入数据库
  UserModel.findOne({username}, function(error, userDoc) {

    if(userDoc) {// 数据库中已经存在，查看接口文档，应该返回什么样的信息。
      // response.send({code: 1, msg: '该用户已存在'})
      response.status(200).json({code: 1, msg: '该用户已存在'})
    } else { // 在数据可中找不到用户名，就可以注册，将新用户的注册信息保存在 数据库中，
      // 为了让用户注册完以后直接就是登录状态，就把用户信息返回给前端
      // 标识登录有两种技术，一种是 cookie，一种是 sesion。现在是从服务器端返回数据给客户端，
      // 所以要在返回给客户端的信息中添加 cookie 信息，持久化 cookie，保存在浏览器本地，
      // 关掉浏览器 cookie 信息还会存在
      // 可以设置过期的时间是 一周，也就是说，一周免登录。
      // cookie 是一个键值对的对象

      new UserModel({username, password: md5(password), usertype}).save(function(error, userDoc) {
        if(error) {
          console.log(error)
          return  response.status(500).json({code: 0, msg: "数据库读写异常"})
        }
        console.log(userDoc);
        response.cookie('userid', userDoc._id, {maxAge : 1000*60*60*24*7});
        const data = {username, usertype, _id: userDoc._id};
        // response.send({code: 0, data})
        // response.set('content-type', 'text/text;charset=utf-8') ;
        // response.set('character-encoding', 'utf-8') ;
        response.status(200).json({code: 0, data})
      });
    }
  })
})


// 登录路由
router.post('/login', function(request, response) {
  // 获取数据
  const {username, password} = request.body;
  console.log(username, password)

  // 处理数据：在数据库中查询，没有，就返回错误信息，有，就返回用户信息。注意用户信息不要返回密码
  UserModel.findOne({username, password: md5(password)}, filter,  function(error, userDoc) {
    if(error) {
      console.log(error)
    } else {
      if (userDoc) {
        console.log(userDoc);
        response.cookie('userid', userDoc._id, {maxAge: 1000*60*60*24*7})
        response.send({code: 0, data: userDoc})
      } else {
        response.send({code: 1, msg: '用户名或密码错误'})
      }
    }
  })
})

// 更新用户信息的路由接口
router.post('/update', function(request, response) {
    // 获取前台发送的需要更新的用户信息
    const userMsg = request.body;
    console.log('request.body', request.body);
    // 读取 cookie 信息中的 userid
    const userid = request.cookies.userid;
    // 判断 cookie 里面有没有内容，有没有 userid，没有就通知浏览器，给出提示信息，“请登录”
    if(!userid) {
        return response.send({code: 1, msg: "请先登录！"})
    }
    // 有内容，在数据库中查询。如果查询不到，说明该 cookie 中的 userid 是错误的，就通知浏览器删除。
    UserModel.findByIdAndUpdate(userid, userMsg, function(error, oldUserMsg) {
        if(error) { return console.log(error)}
        if(!oldUserMsg) {
            response.clearCookie('userid')
            response.send({code: 1, msg: "请先登录"})
        } else {
            const {username, usertype, _id} = oldUserMsg;
            const data = Object.assign(userMsg, {username, usertype, _id});
            response.send({code: 0, data})
        }
    })
})


// 根据 cookie 中的 userid 获取用户信息的后端路由
router.get('/user', function(request, response) {
    const {userid} = request.cookies;
    if(!userid) {
        return response.send({code: 1, msg: "请先登录"})
    }
    UserModel.findOne({_id: userid}, filter, function(error, userMsg) {
        if(error) {return console.log(error)}
        if(!userMsg) {
            console.log("根据 userid 没有找到该用户")
            return response.send({code: 1, msg: "请先登录"})
        }
        console.log("根据 userid 找到的用户信息时", userMsg)
        response.send({code: 0, data: userMsg})
    })

})

// 根据不同的 usertype，获取不同类型的用户列表 userList
router.get('/userlist', function(request, response) {
    const {usertype} = request.query;
    UserModel.find({usertype}, filter, function(error, users) {
        if(error){return console.log(error)}
        console.log("userList", users)
        response.send({code: 0, data: users})
    })

})


/****************  获取当前用户所有的相关聊天信息  ************************/

// 1. 根据 API 文档，获取数据库中所有用户的用户名和头像，存在 users 这个对象中。
router.get('/msglist', function(request, response) {
    // 获取当前登录用户的 userid
    const userid = request.cookies.userid;
    // 将所有用户的用户名和头像存储在一个对象之中
    const users = {};
    UserModel.find(function(error, usersDoc) {
        if(error) { return console.log(error) }
        // userDoc 是一个数组
        usersDoc.map((user) => {
            users[user._id] = {username: user.username, header: user.header}
        })
    })

    /*
    查询 userid 相关的所有聊天信息，也就是当前用户发给被人的消息和别人发给当前用户的消息
    参数 1: 查询条件
    参数 2: 过滤条件
    参数 3: 回调函数
     */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function(error, chatMsgs) {
        console.log("chatMsg", chatMsgs)
        response.send({code: 0, data: {users, chatMsgs}})
    })

})

/***************  修改指定消息为已读 *****************/
router.post('/readmsg', function(request, response) {
    // 获取给当前登录用户发送消息的某个用户的id
    const from = request.body.from;
    // 当前用户的 id
    const to = request.cookies.userid;

    /*
    更新数据库中的 chat 数据
    参数 1: 查询条件： 和当前用户相关的聊天信息，发送和接收的都要查询，read：false
    参数 2: 更新为指定的数据对象： 把 read：false 改成 read：true
    参数 3: 是否 1 次更新多条 , 默认只更新一条：查出来的信息，默认 multi：false，就只更新一条数据。
            设置 multi：true，就可以更新多条数据，也就是把所有查出来的数据都更新。
    参数 4: 更新完成的回调函数
     */

    ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function(error, doc) {
        console.log("修改指定消息为已读， /readmsg,", doc);
        response.send({code: 0, data: doc.nModified})  // {code: 0, data: 更新的数量}
    } )
})




module.exports = router;

