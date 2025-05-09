import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import './style/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')
