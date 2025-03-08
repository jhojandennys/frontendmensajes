import { createRouter, createWebHistory } from 'vue-router';
import CrearSala from '@/components/RoomChat.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import ListasChat from '@/components/ListasChat.vue';


const routes = [
  { path: '/', name: 'Home', component: ListasChat },
  { path: '/crear-sala', name: 'CrearSala', component: CrearSala },
  { path: '/chat/:roomId', name: 'ChatRoom', component: ChatRoom, props: true }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
