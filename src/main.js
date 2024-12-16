import { createApp } from 'vue';
import App from './App.vue';
import TheHeader from './components/UI/header/TheHeader.vue';
import SideNavbar from './components/SideNavbar.vue';
import TheDashboard from './components/UI/main/TheDahboard.vue';
import TheFooter from './components/UI/footer/TheFooter.vue';
import NavItem from './components/UI/NavItem.vue';
import NavLink from './components/UI/NavLink.vue';
import DropdownNav from './components/UI/DropdownNav.vue';
import '../src/css/styles.css';
import '../src/js/scripts';
import '../src/js/datatables-simple-demo.js';
import router from './router.js';
import store from './store/index'
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App)

app.component('the-header', TheHeader);
app.component('main-content', TheDashboard);
app.component('side-navbar', SideNavbar);
app.component('the-footer', TheFooter);
app.component('nav-item', NavItem);
app.component('nav-link', NavLink);
app.component('dropdown-nav', DropdownNav);
app.use(router);
app.use(store);
app.use(VueSweetalert2);
app.use(VueGoodTablePlugin);
app.mount('#app')
