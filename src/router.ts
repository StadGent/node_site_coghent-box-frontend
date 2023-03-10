import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TouchTable from '@/views/TouchTable.vue';
import TouchTableEntity from '@/views/TouchTableEntity.vue';
import TouchTableStories from '@/views/TouchTableStories.vue';
import Entrance from '@/views/Entrance.vue';
import Wall from '@/views/Wall.vue';
import Introscherm1 from '@/components/Introscherm1.vue';
import Introscherm2 from '@/components/Introscherm2.vue';
import Introscherm3 from '@/components/Introscherm3.vue';
import StartCode from '@/views/StartCode.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/entrance',
    component: Entrance,
    children: [],
  },
  {
    path: '/entrance',
    name: 'Entrance',
    meta: { title: 'Entrance' },
    component: Entrance,
    children: [
      {
        path: '/entrance/step-1',
        name: 'entrance.step1',
        meta: { title: 'Entrance | Step 1' },
        component: Introscherm1,
      },
      {
        path: '/entrance/step-2',
        name: 'entrance.step2',
        meta: { title: 'Entrance | Step 2' },
        component: Introscherm2,
      },
      {
        path: '/entrance/step-3',
        name: 'entrance.step3',
        meta: { title: 'Entrance | Step 3' },
        component: Introscherm3,
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
    component: StartCode,
    children: [],
  },
  {
    path: '/touchtable/start',
    name: 'TouchtableStartCode',
    meta: { title: 'TouchtableStartCode' },
    component: StartCode,
    children: [],
  },
  {
    path: '/touchtable/stories',
    name: 'TouchtableStories',
    meta: { title: 'TouchtableStories' },
    component: TouchTableStories,
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
