import Vue from 'vue';
import router from 'vue-router';

Vue.use(router);

export default new router({
    mode:'history',
    routes: [
        {
            path: '',
            redirect: '/sn-manage'
        },
        {
        	path: '/sn-manage',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '设备码管理' },
            children:[
            	{//sn管理
		            path: '/sn-manage',
		            component: resolve => require(['../page/sn-manage/batch.vue'], resolve),
		            meta: { title: 'SN管理-批次' },
		        },
		        {//厂商管理
		            path: '/firm-manage',
		            component: resolve => require(['../page/firm-manage/index.vue'], resolve),
		            meta: { title: '厂商管理' },
		        },
		        {//型号管理
		            path: '/model-manage',
		            component: resolve => require(['../page/model-manage/index.vue'], resolve),
		            meta: { title: '型号管理' },
		        },
		        {//出入库管理
		            path: '/warehousing-manage',
		            component: resolve => require(['../page/warehousing-manage/index.vue'], resolve),
		            meta: { title: 'SN出入库管理' },
		        },
                {//出入库管理=>>扫码
                    path: '/scan',
                    component: resolve => require(['../page/warehousing-manage/scan.vue'], resolve),
                    meta: { title: '扫码' },
                },
                {
                    path: '/found-SN',
                    component: resolve => require(['../page/found-SN.vue'], resolve),
                    meta: { title: '创建SN' },
                },
                {
                    path: '/details',
                    component: resolve => require(['../page/details.vue'], resolve),
                    meta: { title: '设备详情' },
                },
            ]
        },
        
        
        // {
        //     path: '/login',
        //     component: resolve => require(['../components/page/Login.vue'], resolve)
        // },
        // {
        //     path: '/404',
        //     component: resolve => require(['../components/page/404.vue'], resolve)
        // },
        // {
        //     path: '/403',
        //     component: resolve => require(['../components/page/403.vue'], resolve)
        // },
        // {
        //     path: '*',
        //     redirect: '/404'
        // }
    ]
})