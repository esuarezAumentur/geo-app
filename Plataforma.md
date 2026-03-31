# Plataforma de Mapas Interactivos 3D - Proyecto SaaS (Ayuntamiento de Lugo)

Este documento detalla los requerimientos y la arquitectura para el desarrollo e implantación de una **Plataforma de mapas interactivos 3D**.

## 1. Características Principales

- **Arquitectura SaaS y/o Cloud**: La solución estará alojada en la nube, con posibilidad de migración a una infraestructura cloud del Ayuntamiento de Lugo y contemplando esta posibilidad entre las capacidades de la plataforma.
- **Arquitectura Modular**.
- **Integración con terceros**: Capacidad de integrarse y ser accesible desde el actual portal web del Ayuntamiento de Lugo.

### 1.1 Sistema y Rendimiento
- Sistemas escalables y gestión centralizada.
- **Soporte multidispositivo**: Compatible con equipos de escritorio, dispositivos móviles y navegadores modernos.
- **Carga mínima en Plataforma**: El cliente web debe asumir la mayor parte de la carga de procesamiento en el navegador del usuario.
- **Carga en streaming del terreno 3D fotorrealista**: Uso de niveles de detalle (LOD) adaptativos según la posición y distancia de la cámara, para garantizar una experiencia de navegación fluida y sin interrupciones.
- **Cumplimiento de términos de servicio**: Estricto cumplimiento de los términos de servicio utilizados para obtener los 3D Tiles del terreno, incluyendo prohibición de almacenamiento local (salvo caché del navegador) y uso de streaming en tiempo real.

### 1.2 Visualización y Experiencia 3D
- **Modelos 3D fotorrealistas del terreno**: Malla y texturas que permitan una representación realista, emulando un vuelo sobre el territorio. Se priorizan soluciones basadas en servicios como Google Maps Platform que actualicen modelos 3D periódicamente.
- **Navegación libre por el terreno realista**: Permitir definir cualquier punto de vista de cámara al crear un visor específico.
- **Puntos de Interés (POI)**: Visualización de información incluyendo al menos título y descripción, y opcionalmente enlaces, imágenes o documentos PDF. Se prioriza la presentación mediante popups dentro del visor.
- **Asociación de URL de Google Maps a un POI**: Lanzará la aplicación nativa de mapas del dispositivo para calcular la ruta desde la posición del usuario hasta el punto indicado.
- **Vuelos parabólicos**: Generación automática de vuelos parabólicos entre puntos de interés, sin necesidad de definir rutas, solo indicando las posiciones de cámara.
- **Altura de vuelo**: Configuración de altura de vuelo entre puntos para permitir vistas más generales del terreno.
- **Modelos 3D propios**: Carga de modelos sobre el terreno compatibles con formatos GLB o GLTF.
- **Importación KML**: Importación de archivos KML generando automáticamente los puntos de vista necesarios para vuelos entre puntos e integrando títulos y descripciones que contenga el archivo.
- **Branding**: Inclusión de logotipo del Ayuntamiento de Lugo y otros logotipos en el visor.

### 1.3 Modos de Navegación del Visor
1. **Navegación basada en Scroll vertical**: Emulando una página web, activando vuelos automáticos y mostrando información asociada en overlays sobre la vista 3D.
2. **Navegación guiada**: Mediante botones de avance/retroceso, mostrando también la información en overlays sobre el modelo 3D.
3. **Navegación libre opcional**: Configurable en cada visor, permitiendo movimiento libre por el terreno (desplazamiento, zoom, rotación, etc.) con ratón o controles táctiles para el usuario final.

---

## 2. Herramientas de Gestión y Configuración

### 2.1 Editor Interno de Visores
Herramienta con al menos las siguientes funcionalidades:
- Definición de puntos de interés y posiciones de cámara, asociando información (enlaces, imágenes o PDFs).
- Posibilidad de colocar iconos (en forma de lágrima o similar) sobre el terreno para marcar puntos de interés.
- Configuración de propiedades del visor (tipo de navegación, título, etc.).

### 2.2 Sistema de Roles de Usuario
- **Administrador**: Acceso completo (crear, borrar y configurar visores).
- **Editor**: Puede modificar únicamente la información de los puntos de interés.
- **Visualizador**: Acceso limitado a mapas privados disponibles solo para usuarios registrados.

### 2.3 Gestión de Visibilidad de los Mapas
Posibilidad de marcar cada mapa como **público** (accesible por URL) o **privado** (solo para usuarios registrados), permitiendo una fase de revisión previa a la publicación.

---

## 3. Arquitectura del Sistema

La solución se divide en tres capas principales: **Cliente** (Vue 3 + Cesium/Three.js), **API Gateway/Servicios** (Express + Docker) y **Persistencia** (MongoDB).

### 3.1 Frontend: El Núcleo de Procesamiento
Utilizaremos una arquitectura de Single Page Application (SPA), preparada para evolucionar hacia una PWA.
- **Motor 3D**: `CesiumJS` es la opción recomendada para trabajar con Google Photorealistic 3D Tiles. Permite el manejo nativo de LOD y streaming de datos geoespaciales sin almacenamiento local, cumpliendo los TOS de Google.
- **Gestión de Estado**: `Pinia` para manejar la sesión del usuario, el estado del visor (posiciones de cámara) y la configuración del editor.
- **Módulos del Frontend**:
  - *Viewer Engine*: Renderizado 3D, control de cámaras (vuelos parabólicos) y carga de modelos GLB/GLTF.
  - *Editor Module*: Herramientas de "drag & drop" para POIs y configuración de vistas.
  - *Navigation Overlays*: Capas Vue para navegación por scroll y botones de avance.

### 3.2 Backend: Orquestación y Seguridad
El backend (Express.js) actuará principalmente como un gestor de configuración y autenticación, manteniendo el "footprint" bajo.
- **Auth Service**: Implementación de JWT para los roles (Admin, Editor, Visualizador).
- **Map Config API**: CRUD de visores (JSON con coordenadas, IDs de modelos 3D y metadatos de POIs).
- **Storage Proxy**: Servicio para gestionar la subida de archivos KML, imágenes y PDFs a un volumen de Docker o S3 compatible, devolviendo las URLs al frontend.

### 3.3 Base de Datos
Elegimos **MongoDB** por su flexibilidad para almacenar objetos GeoJSON y estructuras de configuración de mapas que pueden variar entre visores.
- **Colección Maps**: Almacena la configuración del visor, el estilo del mapa y los límites de navegación.
- **Colección POIs**: Documentos con coordenadas, referencias a archivos (PDF/IMG) y vínculos a Google Maps.
- **Colección Users**: Usuarios y roles (RBAC).

---

## 4. Detalles de Implementación

### 4.1 Integración con Google Maps Platform
Para cumplir con la necesidad de vuelo fotorrealista y streaming en tiempo real:
- **Map Tiles API**: Se consumen los 3D Tiles mediante un token de API que el frontend utiliza para inicializar el Tileset en CesiumJS.
- **LOD Adaptativo**: El motor 3D calcula automáticamente qué teselas descargar según el frustum de la cámara, optimizando el ancho de banda.
- **App Nativa**: Los POIs contendrán un intent (Android/iOS) o una URL de `google.com/maps/dir/` para activar la navegación GPS externa.

### 4.2 Estrategia de Despliegue (Docker)
Para garantizar la portabilidad solicitada por el Ayuntamiento:
- **Contenedor Web**: Nginx sirviendo los archivos estáticos de Vue 3.
- **Contenedor API**: Node.js (Express) con las variables de entorno para las keys de Google.
- **Contenedor DB**: Instancia de MongoDB con volúmenes persistentes.
- **Docker Compose**: Facilitará la migración a la infraestructura local del Ayuntamiento con un solo comando.

### 4.3 Lógica de Vuelos y Navegación
- **Vuelos Parabólicos**: Utilización la función `camera.flyTo` de Cesium, calculando la altura (altitude) dinámicamente según la distancia entre puntos para crear el efecto de arco.
- **Modo Scroll**: Implementación de un "Scroll Spy" en Vue. Al detectar que el usuario llega a una sección de la página, se dispara el evento de la cámara hacia la posición definida en el JSON del visor.
