import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dump',
      component: () => import('@/views/DumpView.vue'),
      meta: {
        sidebar: true, // NOTE: Only for testing
        bottomBar: 'navbar',
      },
    },
    {
      path: '/note/:id/edit',
      name: 'note-edit',
      component: () => import('@/views/NoteEditView.vue'),
      meta: {
        title: 'header.noteEditView',
        navigationBack: true,
        showAppMenu: false,
      },
    },
    {
      path: '/notepad',
      name: 'notepad',
      component: () => import('@/views/NotepadView.vue'),
      meta: {
        bottomBar: 'navbar',
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: {
        title: 'header.settingsView',
        navigationBack: true,
        showAppMenu: false,
      },
    },
  ],
})

export default router
