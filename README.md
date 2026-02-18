# 💠 Kirijo OS - Persona Database System

<p align="center">
  <img src="assets/logo_kirijo.png" alt="Kirijo Group Logo" width="200"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/System-Kirijo%20OS-blue?style=for-the-badge" alt="System Badge">
  <img src="https://img.shields.io/badge/Status-Operational-success?style=for-the-badge" alt="Status Badge">
  <img src="https://img.shields.io/badge/Access-Confidential-red?style=for-the-badge" alt="Access Badge">
</p>

<p align="center">
  <strong>PROYECTO:</strong> Protocolo de Recopilación de Información de Personas (P.R.I.P.)<br>
  <strong>DIVISIÓN:</strong> Shadow Ops / Departamento de Desarrollo<br>
  <strong>CLASIFICACIÓN:</strong> S.E.E.S. Eyes Only
</p>

---

## 📝 Descripción del Sistema

**Kirijo OS** es una interfaz de base de datos avanzada y una Aplicación Web Progresiva (PWA) diseñada para operar como el centro neurálgico de información para usuarios de *Persona*. 

Este sistema centraliza datos tácticos y sociales de múltiples líneas temporales (**Persona 3 Portable, Reload, Persona 4 Golden y Persona 5 Royal**), permitiendo a los operativos maximizar su eficiencia tanto en la exploración del Metaverso como en la gestión de la vida diaria.

## 💾 Módulos Operativos

El sistema cuenta con módulos dedicados para cada registro del compendio:

| Módulo | Nombre Clave | Estado | Funcionalidades |
| :--- | :--- | :--- | :--- |
| **Persona 3 Portable** | `S.E.E.S. DB` | 🟢 Online | Social Links (M/F), Missing Persons, Vision Quest. |
| **Persona 3 Reload** | `Dark Hour` | 🟡 Parcial | Link Episodes, Dorm Hangouts, Twilight Fragments. |
| **Persona 4 Golden** | `TV World` | 🟢 Online | Exámenes, Social Links, Libros. |
| **Persona 5 Royal** | `Mementos` | 🟡 Parcial | Confidants, Jazz Club, Crucigramas, Will Seeds. |

## 🚀 Funcionalidades Principales

* 📊 **Social Link Master:** Algoritmo de optimización de relaciones. Incluye respuestas para *Reverse/Broken links*.
* 🏫 **Academic Database:** Repositorio completo de respuestas para exámenes, preguntas de clase y licencias.
* 🎭 **Fusion Calculator:** Datos sobre fusiones especiales y recetas de Personas avanzadas.
* 📱 **PWA & Offline Mode:** Sistema instalable en dispositivos móviles con capacidad de funcionamiento sin red (ideal para zonas sin cobertura como Tartarus).
* 🔄 **Cross-Timeline Support:** Interfaz unificada para gestionar datos de P3P, P3R, P4G y P5R.

## 📂 Arquitectura del Sistema

La estructura de archivos sigue los protocolos de organización de *Kirijo Group*:

```text
Kirijo-OS/
├── assets/          # Recursos visuales (Arcana, Personajes, Iconos)
├── css/             # Estilos (Kirijo Corporate UI Theme)
├── data/            # Bases de datos en formato JSON (Lógica del sistema)
│   ├── p3p_*.json   # Archivos de datos P3 Portable
│   ├── p3r_*.json   # Archivos de datos P3 Reload
│   └── ...          # Otros módulos
├── js/              # Núcleo lógico (app.js)
├── index.html       # Punto de entrada del sistema
└── manifest.json    # Configuración PWA

```

## 🛠️ Stack Tecnológico

* **Core:** HTML5 Semántico, CSS3 (Grid/Flexbox).
* **Scripting:** JavaScript (Vanilla ES6+) - Sin dependencias externas pesadas para máxima velocidad.
* **Data:** JSON asíncrono para carga dinámica de módulos.
* **Deployment:** Optimizado para GitHub Pages.

## 🖥️ Inicialización de Protocolo (Instalación)

Para desplegar una instancia local de **Kirijo OS**:

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/tu-usuario/Kirijo-OS.git](https://github.com/tu-usuario/Kirijo-OS.git)

```


2. **Acceder al directorio:**
```bash
cd Kirijo-OS

```


3. **Ejecutar:**
* Abre `index.html` en tu navegador de confianza.
* *Opcional:* Instala la PWA desde la barra de dirección del navegador para una experiencia nativa.



---

<p align="center">
  <em>"The arcana is the means by which all is revealed..."</em>
  <br>
  <em>“Executions are a last resort. Information is our primary weapon.”</em>
  <br>
  <sub>© 2026 Kirijo Group Development Division</sub>
</p>
