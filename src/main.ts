import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import './style/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import clickOutside from '@/utils/Directives/clickoutside'
const app = createApp(App)
app.directive('click-outside', clickOutside)
app.use(router)

app.mount('#app')
