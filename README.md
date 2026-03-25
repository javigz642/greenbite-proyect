<h1 align="center">🌱 Greenbite Order Management 🚀</h1>

<p align="center">
  <b>Sistema de gestión de pedidos para Greenbite</b>
</p>

---

## 📝 Documentos base del proyecto

- 📋 <b><a href="docs/AnalisisFuncional_Y_Requisitos.pdf">Análisis funcional y requisitos</a></b>
- 👤 <b><a href="docs/Historias_Usuario.pdf">Historias de usuario</a></b>
- 🛠️ <b><a href="docs/DiseñoTecnico_Y_PropuestaTecnologica.pdf">Diseño técnico y propuesta tecnológica</a></b>
- 🧠 <b><a href="memory-bank/projectbrief.md">Project Brief</a></b>
- 📚 <b><a href="memory-bank/systemPatterns.md">Arquitectura y patrones</a></b>

---

## 🖼️ Capturas de Pantalla Principales

<p align="center">
  <b>Listado de Pedidos</b><br>
  <img src="docs/Imagenes/ListarPedidoyDetalleVista.png" alt="Listado de pedidos" width="600" /><br>
</p>

<p align="center">
  <b>Crear Pedido</b><br>
  <img src="docs/Imagenes/CrearPedidoVista.png" alt="Formulario crear pedido" width="600" /><br>
</p>


<p align="center">
  <b>Tests / Validaciones</b><br>
  <img src="docs/Imagenes/TestBackend.png" alt="Ejecución de tests backend" width="600" /><br>
  <img src="docs/Imagenes/TestFrontEnd.png" alt="Ejecución de tests frontend" width="600" /><br>
</p>

---

## 🌍 Estructura del Proyecto

```
.
├── backend/
├── docs/
│   ├── AnalisisFuncional_Y_Requisitos.pdf
│   ├── DiseñoTecnico_Y_PropuestaTecnologica.pdf
│   └── Historias_Usuario.pdf
├── frontend/
├── memory-bank/
│   ├── activeContext.md
│   ├── productContext.md
│   ├── progress.md
│   ├── projectbrief.md
│   ├── systemPatterns.md
│   └── techContext.md
├── package-lock.json
└── README.md  (este archivo)
```





---

## 🚦 Quickstart

|                         | 🔙 Backend                                | 🔜 Frontend                          |
|-------------------------|--------------------------------------------|---------------------------------------|
| **Instalación**         | `cd backend`<br>`npm install`             | `cd frontend`<br>`npm install`        |
| **Ejecutar (dev)**      | `npm run dev`                              | `npm run dev`                        |
| **Build producción**    | `npm run build`                            | `npm run build`                      |
| **Tests**               | `npm test`                                 | `npm test`                           |

---

## ✨ Tecnologías Principales

- <b>Frontend:</b> React + TypeScript, Vite, React Testing Library.
- <b>Backend:</b> Node.js, Express, TypeScript, arquitectura por capas (domain / application / infrastructure).
- <b>Persistencia:</b> Repositorio en memoria (`InMemoryOrderRepository`).
- <b>Testing:</b> Jest, ts-jest, Supertest.
- 🏗️ <b>Arquitectura limpia:</b> separación clara entre dominio, casos de uso e infraestructura.
- 🔄 <b>Extensible:</b> preparado para sustituir repositorio en memoria por base de datos real.

---

## 👩‍💻 ¿Quieres contribuir o entender más?

- Revisa primero los documentos en <b>/docs</b> y <b>/memory-bank</b>.
- Cada nueva funcionalidad debe incluir su test correspondiente.
- Mantén la separación entre dominio, aplicación e infraestructura.
- Actualiza la documentación si cambias arquitectura o reglas de negocio.

<hr />

