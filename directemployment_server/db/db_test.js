/*
测试 使用 mongoose 使用 mongodb
 */

/**************************
 1. 连接数据库
 1.1. 引入 mongoose
 1.2. 连接指定数据库 (URL 只有数据库是变化的 )
 1.3. 获取连接对象
 1.4. 绑定连接完成的监听 ( 用来提示连接成功
 *************************/

const md5 = require('blueimp-md5');// 返回的就是一个加密函数

const mongoose = require('mongoose');

// 连接指定数据库
mongoose.connect('mongodb://localhost:27017/zhipin_test', { useNewUrlParser: true } );

// 获取连接对象
const connection = mongoose.connection;

// 绑定连接完成的监听
connection.on('connected', function() {
    console.log('连接成功')
})


/**************************
 2. 得到对应特定集合的 Model
 2.1. 字义 Schema( 描述文档结构 )
 2.2. 定义 Model( 与集合对应 , 可以操作集合)
 *************************/
const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    usertype: {type: String, required: true},
    email: {type: String}
})

const UserModel = mongoose.model('user', userSchema);


/******************************
 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
 3.1. 通过 Model 实例的 save() 添加数据
 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
 3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
 3.4. 通过 Model 的 remove() 删除匹配的数据
 ******************************/

function testSave() {
    const userModel = new UserModel({
        username: 'dahu123456789',
        password: md5('123'),
        usertype: 'jobSeek'
    })

    userModel.save(function(error, userDoc) {
        if(error) {
            console.log('save failed!!!!!!!')
        } else {
            console.log('save successfully');
            console.log(userDoc);
        }
    })
}

testSave()

// 3.2. 通过 Model 的 find()/findOne() 查询多个或一个数据
function find() {
    // 查询多个就是一个数组
    UserModel.find(function(error, users) {
        console.log('find()', error, users)
    })
    UserModel.findOne({username: 'dahu'},function(error, user) {
        console.log('findOne()', error, user)
    })
}

// find()


// 3.3. 通过 Model 的 findByIdAndUpdate() 更新某个数据
function update() {
    UserModel.findByIdAndUpdate({_id : '5d4cf52d0a969053a0cba236'}, {username: 'lalalal'},
        function(error, doc) {
        console.log('update', error, doc)
        })
}
// update()

//  3.4. 通过 Model 的 remove() 删除匹配的数据
function remove() {
    UserModel.remove({_id : '5d4cf52d0a969053a0cba236'}, function(err, doc) {
        console.log('delete', err, doc)
    })
}
// remove()
