

import axios from 'axios';
import { Loading } from 'element-ui';
import { Notification } from 'element-ui';

axios.defaults.timeout =  5000

const ajax=function(obj){
    

    let loadingInstance = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    });

    
    // obj.data=JSON.stringify(obj.data)
    axios({
        method: obj.mode,
        url: URLMY+obj.url,
        headers: {'Content-Type':'application/json'},
        data:obj.data,
    })
    .then(response => {
        loadingInstance.close();
        obj.success(response)
    })
    .catch(error => {
       loadingInstance.close();
       console.log(typeof error)
       console.dir(error)
       // error=JSON.parse(error) || error
        if (error.response) {
            Notification({
              title: '警告',
              message: error.response.data.message,
              type: 'warning'
            })
            console.log(error.response.data.message)
        } else if (error.request) {
            console.log(error.request);
        }else if(error.config){
            Notification({
              title: '警告',
              message: error.config.data.message,
              type: 'warning'
            })
            console.log(error.config.data.message)
        } else {
            Notification({
              title: '警告',
              message: error.message,
              type: 'warning'
            })
            console.log(error.message)
        }
        
    });
}

export default ajax;

