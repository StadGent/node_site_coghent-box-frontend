import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TouchTable from '@/views/TouchTable.vue';
import Entrance from '@/views/Entrance.vue';
import Wall from '@/views/Wall.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/entrance',
    component: Entrance,
  },
  {
    path: '/entrance',
    name: 'Entrance',
    meta: { title: 'Entrance' },
    component: Entrance,
    children: [],
  },
  {
    path: '/wall',
    name: 'Wall',
    meta: { title: 'Wall' },
    component: Wall,
    children: [],
  },
  {
    path: '/touchtable',
    name: 'Touchtable',
    meta: { title: 'Touchtable' },
    component: TouchTable,
    children: [],
  },
];

export const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
});
