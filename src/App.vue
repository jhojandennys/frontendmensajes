<template>
  <div id="app">
    <ChatRoom />
    <ListasChat />
  </div>
</template>

<script>
//import ChatRoom from './components/ChatRoom.vue';
import ListasChat from './components/ListasChat.vue';

export default {
  name: 'App',
  components: {
    ListasChat

}
};
</script>
