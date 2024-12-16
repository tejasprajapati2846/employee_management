import { createRouter, createWebHistory } from 'vue-router';

import NotFound from './components/UI/pages/NotFound.vue';
import TheDashboard from './components/UI/main/TheDahboard.vue';
import EmployeeList from './components/UI/pages/employees/EmployeeList.vue';
import ProjectList from './components/UI/pages/projects/ProjectList.vue';
import TaskList from './components/UI/pages/tasks/TaskList.vue';
import SkillList from './components/UI/pages/skills/SkillList.vue';
import DepartmentList from './components/UI/pages/departments/DepartmentList.vue';
import RoleList from './components/UI/pages/roles/RoleList.vue';
import TheLogin from './components/UI/pages/auth/TheLogin.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'login', path: '/login', component: TheLogin ,meta: { requiresAuth: false }},
    { path: '/', redirect: '/dashboard' },
    {
      name: 'dashboard',
      path: '/dashboard',
      meta: { needsAuth: true },
      component: TheDashboard,
      children: [
        {
          name: 'team-members',
          path: ':teamId',
          component: NotFound,
          props: true
        }
      ]
    },
    {
      path: '/employees',
      meta: { needsAuth: true },
      component:
        EmployeeList,

    },
    {
      path: '/projects',
      meta: { needsAuth: true },
      component:
        ProjectList
    },
    {
      path: '/tasks',
      meta: { needsAuth: true },
      component:
        TaskList
    },
    {
      path: '/departments',
      meta: { needsAuth: true },
      component: DepartmentList
    },
    {
      path: '/skills',
      meta: { needsAuth: true },
      component: SkillList
    },
    {
      path: '/roles',
      meta: { needsAuth: true },
      component: RoleList
    },
    { path: '/:notFound(.*)', component: NotFound }
  ],
  linkActiveClass: 'active',
  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  const authToken = localStorage.getItem("authToken");
  if (to.matched.some(record => record.meta.needsAuth)) {
    if (to.name === 'login' && authToken) {
      next({ name: 'dashboard' });
    } else if (!authToken) {
      next("/login");
    } else {
      next();
    }
  } else if (to.name === 'login' && authToken) {
    next('/dashboard');
  } else {
    next();
  }
})
export default router;