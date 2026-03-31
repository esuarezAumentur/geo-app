<template>
  <div class="viewer-container">
    <div class="overlay">
      <h1>🌍 Plataforma de Mapas 3D</h1>
      <p>Navega fotorrealísticamente por la ciudad de Lugo</p>
      <router-link to="/admin" class="admin-link">Ir al Panel de Administración →</router-link>
    </div>
    
    <!-- Aquí es donde integraremos CesiumJS en los siguientes pasos -->
    <div id="cesiumContainer" class="cesium-mock">
      <span>[Contenedor del Visor 3D]</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Vista del visor montada. Lista para inicializar CesiumJS.')
})

</script>

<style scoped>
.viewer-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: absolute;
  top: 20px;
  left: 30px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  z-index: 10;
  max-width: 400px;
}

.overlay h1 {
  margin-top: 0;
  font-size: 1.5rem;
}

.overlay p {
  color: #ccc;
  line-height: 1.5;
  margin-bottom: 20px;
}

.user-form {
  width: 100%;
  margin: 10px 0 12px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.35);
}

.user-form-title {
  margin: 0 0 10px;
  font-size: 1.05rem;
}

.field {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

.field span {
  font-size: 0.85rem;
  color: #d5d5d5;
}

.field input,
.field select {
  width: 100%;
  padding: 9px 10px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  outline: none;
}

.field input:focus,
.field select:focus {
  border-color: rgba(66, 184, 131, 0.65);
}

.submit-btn {
  display: inline-block;
  width: 100%;
  margin: 6px 0 0;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(66, 184, 131, 0.15);
  color: #eafff4;
  font-weight: 700;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.integration-error {
  margin: 8px 0 0;
  color: #ffb4b4;
  font-size: 0.95rem;
}

.integration-result {
  margin: 10px 0 0;
  padding: 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #d7ffe9;
  max-height: 220px;
  overflow: auto;
  font-size: 0.85rem;
}

.cesium-mock {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #666;
  border: 2px dashed #444;
  background: repeating-linear-gradient(
    45deg,
    #1f1f1f,
    #1f1f1f 10px,
    #222 10px,
    #222 20px
  );
}

.admin-link {
  display: inline-block;
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}

.admin-link:hover {
  text-decoration: underline;
  color: #33a06f;
}
</style>
