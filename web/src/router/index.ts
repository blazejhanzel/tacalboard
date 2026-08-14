import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dump',
      component: () => import('@/views/DumpView.vue'),
      meta: {
        sidebar: true // NOTE: Only for testing
      },
    },
    {
      path: '/note/:id/edit',
      name: 'note-edit',
      component: () => import('@/views/NoteEditView.vue'),
      meta: {
        title: 'header.noteEditView',
        back: true
      },
    },
    {
      path: '/notepad',
      name: 'notepad',
      component: () => import('@/views/NotepadView.vue'),
    },
  ],
})

export default router
