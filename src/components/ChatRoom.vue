<template>
  <div class="chat-container">
    <!-- Encabezado del chat -->
    <div class="chat-header">
      <h3>Chat de la Sala {{ roomId }}</h3>
    </div>

    <!-- Área de mensajes -->
    <div class="chat-messages">
      <div v-for="msg in messages" :key="msg.id" :class="['message', msg.senderId === 'user123' ? 'sent' : 'received']">
        <div class="message-content">
          <strong>{{ msg.senderId }}:</strong> {{ msg.content }}
        </div>
        <div class="timestamp">{{ msg.timestamp }}</div>
      </div>
    </div>

    <!-- Campo de entrada de mensajes -->
    <div class="chat-input">
      <input v-model="mensaje" placeholder="Escribe un mensaje..." @keyup.enter="enviarMensaje" />
      <button @click="enviarMensaje">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roomId: String, // ID de la sala actual
    messages: Array // Mensajes de la sala actual
  },
  data() {
    return {
      mensaje: '' // Mensaje actual
    };
  },
  methods: {
    enviarMensaje() {
      if (!this.mensaje.trim()) return;

      const newMessage = {
        senderId: 'user123', // Aquí puedes cambiar dinámicamente el ID del usuario
        content: this.mensaje,
        timestamp: new Date().toLocaleTimeString(),
        roomId: this.roomId
      };

      // Emite el mensaje al componente padre
      this.$emit('enviarMensaje', newMessage);
      this.mensaje = ''; // Limpia el campo de entrada
    }
  }
};
</script>

<style scoped>
.chat-container {
  width: 100%; /* Ocupa todo el ancho disponible */
  height: 100vh; /* Ocupa toda la altura de la pantalla */
  display: flex;
  flex-direction: column;
  background: #121212;
  border-radius: 10px;
  overflow: hidden;
}

.chat-header {
  background: #075E54;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  padding: 8px;
  margin: 5px;
  border-radius: 10px;
  position: relative;
}

.sent {
  align-self: flex-end;
  background: #25D366;
  color: white;
}

.received {
  align-self: flex-start;
  background: #202c33;
  color: white;
}

.message-content {
  display: block;
}

.timestamp {
  font-size: 0.8em;
  opacity: 0.7;
  text-align: right;
  margin-top: 2px;
}

.chat-input {
  display: flex;
  padding: 10px;
  background: #202c33;
  border-top: 1px solid #075E54;
}

.chat-input input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 5px;
  background: #2a3942;
  color: white;
}

.chat-input button {
  background: #128C7E;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  margin-left: 5px;
  cursor: pointer;
}

.chat-input button:hover {
  background: #075E54;
}
</style>