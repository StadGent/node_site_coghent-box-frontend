import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TouchTable from '@/views/TouchTable.vue';
import TouchTableEntity from '@/views/TouchTableEntity.vue';
import Entrance from '@/views/Entrance.vue';
import Wall from '@/views/Wall.vue';
import Introscherm1 from '@/components/Introscherm1.vue';

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
    children: [
      {
        path: '/intro-1',
        name: 'introscherm1',
        meta: { title: 'Entrance | intro 1' },
        component: Introscherm1,
      },
      {
        path: '/intro-2',
        name: 'introscherm2',
        meta: { title: 'Entrance | intro 2' },
        component: Introscherm1,
      },
      {
        path: '/intro-3',
        name: 'introscherm3',
        meta: { title: 'Entrance | intro 3' },
        component: Introscherm1,
      },
    ],
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
    redirect: '/touchtable/start',
    component: TouchTable,
  },
  {
    path: '/touchtable/start',
    name: 'Touchtable',
    meta: { title: 'Touchtable' },
    component: TouchTable,
    children: [],
  },
  {
    path: '/touchtable/:entityID',
    name: 'TouchtableEntity',
    meta: { title: 'TouchtableEntity' },
    component: TouchTableEntity,
    children: [],
  },
];

export const router = createRouter({
  routes,
  history: createWebHistory(process.env.BASE_URL),
});
