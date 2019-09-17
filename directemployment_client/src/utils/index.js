// 包含 多个 工具函数

/*
用户登录或注册成功后要跳转到的界面有四种情况：

用户主界面
boss: /boss
jobseek: / jobseek
用户个人信息界面
boss: /bossinfo
jobseek: /jobseekinfo

判断是否已经完善信息，看 userState.header;
判断用户类型，看 uesrState.usertype；
 */

/*
返回对应的路由路径
 */

export function getRedirectTo(header, usertype) {
    let path;
    if(usertype === 'boss') {
        path = '/boss';
    } else if(usertype === 'jobseek') {
        path = '/jobseek';
    }

    if(!header) {
        path = path + 'info';
    }

    return path;
}