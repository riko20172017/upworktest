import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { makeServer } from "./server";
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/index';

if (process.env.NODE_ENV === "development") {
    makeServer();
}

createApp(App).use(store).use(router).mount('#app')
