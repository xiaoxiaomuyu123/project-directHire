/*
能发送 ajax 请求的函数模块
函数的返回值是 promise 对象
 */
import axios from 'axios'

export default function ajax (url, data = {}, method = 'GET') {
    if(method === 'GET') {
        // 如果 data = {username : Tom, password : 123}
        // 我们要把 data 转成 paramStr = ’username=Tom&password=123‘，
        // 最终要将把 url 拼出来：http://localhost:3000?username=Tom&password=123
        let paramStr = '';
        // object.keys() 返回的是一个数组，里面是包含对象的所有 key
        Object.keys(data).forEach(key => {
            paramStr = paramStr + key + '=' + data[key] + '&';
            console.log("Object.keys(data) 中的 paramStr", paramStr)
        });
        // 把最后的 “&” 去掉
        if(paramStr) {
            paramStr = paramStr.slice(0, paramStr.length-1);
            url = url + '?' + paramStr;
        }
        console.log("get 方法的 url", url)
        // 发送 get 请求 axios 返回的是 promise 对象
        return axios.get(url);
    } else {
        // axios 返回的是 promise 对象
        console.log('axios.post')
        return axios.post(url, data);
    }
}

