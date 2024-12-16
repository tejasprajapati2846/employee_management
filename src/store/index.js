import { createStore } from 'vuex'
import loginModule from '../store/login';
import DepartmentModule from '../store/department';

export default createStore({
  modules: {
    loginModule,
    DepartmentModule
  },  
mutations: {

},
actions: {

}
})
