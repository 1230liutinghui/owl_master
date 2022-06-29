import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/Home'
import PhoneAssist from '../components/PhoneAssist'
import RecordList from '../components/RecordList'
import Login from '../components/Login'
import OA from '../components/OA'
import Main from '../components/Main'
import Error from '../components/Error'
import RecordDetail from '../components/RecordDetail'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login', component: Login
        },
        {
            path: '/OA',
            name: 'OA',
            component: OA
        }, {
            path: '/Main',
            name: 'Main',
            component: Main,
            redirect: {name: 'Home'},
            children: [
                {
                    path: 'Home',
                    name: 'Home',
                    component: Home
                },
                {
                    path: 'recordList',
                    name: 'recordList',
                    component: RecordList
                }, {
                    path: 'phoneAssist',
                    name: 'phoneAssist',
                    component: PhoneAssist
                }, {
                    path: 'recordList/recordDetail',
                    name: 'recordDetail',
                    component: RecordDetail
                }
            ]
        }, {
            path: '/Error',
            name: 'Error',
            component: Error
        }
    ]
})
