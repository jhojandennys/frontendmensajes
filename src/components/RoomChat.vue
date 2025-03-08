<template>
  <div>
    <h2>Crear Sala</h2>
    <form @submit.prevent="crearSala">
      <label for="roomName">Nombre de la Sala:</label>
      <input type="text" id="roomName" v-model="roomName" required />
      <button type="submit">Crear Sala</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      roomName: '',
    };
  },
  methods: {
    async crearSala() {
      try {
        const response = await axios.post('http://localhost:8030/salas/crear', null, {
          params: { nombreSala: this.roomName }
        });

        const roomId = response.data.roomId;

        // 📌 Abrir en una nueva pestaña con la URL de la sala
        const nuevaVentana = window.open(`/chat/${roomId}`, '_blank');
        
        if (!nuevaVentana) {
          alert('Permite las ventanas emergentes en tu navegador.');
        }

      } catch (error) {
        console.error('Error al crear la sala:', error);
      }
    }
  }
};
</script>
