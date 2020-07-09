// 插件模块
import axios from 'axios'
const MyHttpServer = {}

MyHttpServer.install = function (Vue){

    
    axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // axios.defaults.baseURL = 'http://81.68.112.168:3002/api/private/v1/'
    // 添加实例方法

    //添加请求拦截器
    axios.interceptors.request.use(function(config) {

        if (config.url !== 'login') {
            //需要授权的API, 必须在请求头中使用 Authorization 字段提供 token 令牌
            const token = localStorage.getItem("token");
            config.headers["Authorization"] = token;
        }
        return config
    }, (error)=>{
        return Promise.reject(error)
    })

    Vue.prototype.$http = axios
}

export default MyHttpServer