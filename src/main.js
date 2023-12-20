import {createApp} from 'vue';
import App from './App.vue';
import {router} from './router';
import axios from 'axios'//引入axios


import {Overlay} from 'vant'; //遮罩组件

import 'vant/es/toast/style';
import 'vant/es/dialog/style';

const app = createApp(App);
app.use(router);

app.provide('$axios',axios)

app.use(Overlay)

app.mount('#app');