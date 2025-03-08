<template>
    <div class="chat-container">
      <!-- Panel izquierdo: Lista de salas -->
      <div class="sidebar">
        <h2>Salas de Chat</h2>
        <form @submit.prevent="crearSala">
          <input type="text" v-model="roomName" placeholder="Nombre de la sala" required />
          <button type="submit">+ Crear Sala</button>
        </form>
        <ul>
          <li v-for="sala in salas" :key="sala.roomId" @click="seleccionarSala(sala.roomId)">
            {{ sala.nombre }}
          </li>
        </ul>
      </div>
  
      <!-- Panel derecho: Chat de la sala seleccionada -->
      <div class="chat-box">
        <ChatRoom
          v-if="salaActual"
          :roomId="salaActual"
          :messages="messagesPorSala[salaActual] || []"
          @enviarMensaje="enviarMensaje"
        />
        <p v-else>Selecciona una sala para empezar a chatear</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import ChatRoom from '@/components/ChatRoom.vue';
  
  export default {
    components: { ChatRoom },
    data() {
      return {
        salas: [], // Lista de salas creadas
        salaActual: null, // ID de la sala seleccionada
        roomName: '', // Nombre de la nueva sala
        messagesPorSala: {}, // Mensajes organizados por sala
      };
    },
    methods: {
      // Crear una nueva sala
      async crearSala() {
        try {
          const response = await axios.post('http://localhost:8030/salas/crear', null, {
            params: { nombreSala: this.roomName },
          });
  
          const nuevaSala = { roomId: response.data.roomId, nombre: this.roomName };
          this.salas.push(nuevaSala);
          this.salaActual = nuevaSala.roomId; // Abre la sala recién creada
          this.roomName = ''; // Limpia el input
  
          // Iniciar el listener de expiración de esta sala
          this.iniciarListenerSalasExpiradas(nuevaSala.roomId);
  
        } catch (error) {
          console.error('Error al crear la sala:', error);
        }
      },
  
      // Seleccionar una sala para entrar al chat
      seleccionarSala(roomId) {
        this.salaActual = roomId;
  
        // Iniciar el listener de expiración para la sala seleccionada
        this.iniciarListenerSalasExpiradas(roomId);
      },
  
      // Enviar un mensaje
      async enviarMensaje(mensaje) {
        if (!this.salaActual) return;
  
        try {
          // Envía el mensaje al servidor
          await axios.post('http://localhost:808/api/messages', mensaje);
  
          // Agrega el mensaje a la sala correspondiente
          if (!this.messagesPorSala[this.salaActual]) {
            this.messagesPorSala[this.salaActual] = [];
          }
          this.messagesPorSala[this.salaActual].push(mensaje);
  
        } catch (error) {
          console.error('Error al enviar el mensaje:', error);
        }
      },
  
      // Iniciar el listener de expiración para la sala específica
      iniciarListenerSalasExpiradas(roomId) {
        const eventSource = new EventSource(`http://localhost:8085/expireNotification/${roomId}`);
  
        eventSource.addEventListener("message", (event) => {
          const message = event.data;
          console.log("Mensaje recibido desde el backend: ", message);
  
          // Si el mensaje es sobre la expiración de la sala, manejar la expiración
          if (message.includes('Esperando notificación de expiración')) {
            console.log("Esperando expiración de la sala:", roomId);
          } else {
            // En este bloque, procesas la notificación cuando la sala realmente haya expirado
            const expiredRoom = roomId;
            console.log("⚠️ Sala expirada recibida:", expiredRoom);
  
            // Eliminar la sala de la lista de salas
            this.salas = this.salas.filter(sala => sala.roomId !== expiredRoom);
  
            // Si la sala expirada es la sala actual, deseleccionarla
            if (this.salaActual === expiredRoom) {
              this.salaActual = null;
            }
          }
        });
  
        eventSource.onerror = () => {
          console.error("Error en SSE, reconectando...");
          setTimeout(() => {
            eventSource.close();
            this.iniciarListenerSalasExpiradas(roomId);
          }, 5000); // Intentar reconectar después de 5 segundos
        };
      },
    },
  
    mounted() {
      // No es necesario iniciar SSE aquí, ya que el listener se activa cuando se selecciona o crea una sala
    },
  };
  </script>

  <style scoped>
  .chat-container {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 30%;
    background: #2b2b2b;
    padding: 10px;
    color: white;
  }
  
  .sidebar form {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  
  .sidebar input {
    flex: 1;
    padding: 5px;
  }
  
  .sidebar button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar li {
    padding: 10px;
    cursor: pointer;
    background: #444;
    margin: 5px 0;
  }
  
  .sidebar li:hover {
    background: #555;
  }
  
  .chat-box {
    width: 70%;
    padding: 10px;
    background: #1e1e1e;
    color: white;
    display: flex;
    flex-direction: column;
    height: 100%; /* Asegura que ocupe el 100% del espacio disponible */
  }
  
  .chat-box p {
    color: #aaa;
    font-size: 18px;
    text-align: center;
  }
  
  .chat-box ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column-reverse; /* Muestra los mensajes desde abajo hacia arriba */
    overflow-y: auto;
    height: 80vh; /* Ajusta la altura según lo que necesites */
  }
  
  .chat-box li {
    padding: 8px;
    background-color: #444;
    margin: 5px 0;
    border-radius: 5px;
  }
  
  .chat-box li:nth-child(even) {
    background-color: #555;
  }
  </style>
  