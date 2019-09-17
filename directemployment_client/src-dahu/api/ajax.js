/**
 * 发送ajax请求的模块
 * 函数的返回值是promise对象
 * 包装的是axios模块中的get()和post()
 *
 */

// var axios = require('axios') ;
// 前端模块导入要是使用import （ES6）
// 不能使用require()
import axios from 'axios'

/**
 * 发送ajax请求的函数
 * @param url 请求的url
 * @param data 向服务器发送的数据
 * @param type 请求类型
 * @returns {Promise<AxiosResponse<T>>} promise对象
 */
function ajax(url, data = {}, type = 'GET') {
    if (type === 'GET') {
        // 判断请求类型
        // GET请求是将参数以key=value的（多个参数使用&连接）形式，通过?同url相连
        // data = {username: 'aaa', password: '1234'}
        // 首先将data中的key和value拼接：username=aaa&password=1234
        // 然后通过?同url连接：http://www.ccc.com/index.html?username=aaa&password=1234

        // 用来存放key=value形式的键值对
        var keyAndValue = [] ;

        // Object.keys()接收一个对象作为参数，遍历这个对象中可枚举的属性（不包括继承的，只有我们自定义的）
        // 返回值是作为参数的对象中的key（属性名）组成的数组
        Object.keys(data).forEach(key => {
            // 将data中的key和value组成key=value形式
            keyAndValue.push(key + '=' + data[key]) ;
        }) ;

        // 查询字符串
        var queryStr = keyAndValue.join('&') ;

        // 同url进行拼接
        var newUrl = url + '?' + queryStr ;

        // 如果是GET，则是调用axios的get()方法
        return axios.get(newUrl) ;

    } else if (type === 'POST') {
        // 判断请求类型
        // 如果是POST，则是调用axios的post()方法
        return axios.post(url, data) ;
    }
}

export default ajax ;