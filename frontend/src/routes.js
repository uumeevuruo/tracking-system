import { createRouter, createWebHistory } from 'vue-router';
import TaskList from './components/TaskList.vue';
import TaskDetail from './components/TaskDetail.vue';

const routes = [
    {
        path: '/',
        name: 'TaskList',
        component: TaskList
    },
    {
        path: '/task/:id',
        name: 'TaskDetail',
        component: TaskDetail
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;