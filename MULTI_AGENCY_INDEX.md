# Masterclass: Arquitectura IA Agéntica en Mi Red Ciclista

Este documento no es solo un índice de archivos, sino un **manual didáctico** para entender paso a paso cómo se ha estructurado una de las arquitecturas más avanzadas de Inteligencia Artificial: La **Orquestación Multi-Agente**. 

Si quieres comprender por qué este proyecto es infinitamente superior a un simple "chatbot que genera código", sigue leyendo.

---

## 1. El Concepto Base: De Chatbot a Ecosistema Autónomo

Normalmente, el usuario humano interactúa con una IA dándole una petición enorme ("Crea un backend y un frontend de mapas en React"). Esto provoca que la IA sature su "Ventana de Contexto" (la cantidad de palabras a la que puede prestar atención a la vez), provocando alucinaciones, código mal mezclado y olvidos.

**La solución de IA Agéntica:** Transformamos el proceso en una fábrica. El humano delega la visión a un "Orquestador". Este Orquestador fragmenta el problema y contrata a "Especialistas" (Agentes), dándoles **micro-tareas**. Además, introduce sistemas de **memoria**, **investigación previa** y **bucles de reflexión**.

---

## 2. Los Archivos Clave y los Roles de los Agentes

Para que esto funcione en tu disco duro, hemos creado "Reglas Mentales" (Skills) embebidas en la carpeta oculta `.agents`. Cada skill limita lo que un agente cree que es y lo especializa.

### 🧠 El Orquestador y las Reglas del Juego
*   **[`docs/SDD.md`](file:///f:/Cursos/IA/capaMapsRutaCiclista/docs/SDD.md)**
    *   **¿Qué es?** El Documento Base (Software Design Document).
    *   **¿Para qué sirve?** El Orquestador no programa, lee este contrato maestro. Describe que el proyecto usa "Arquitectura Hexagonal", "TDD >80%" y "Validaciones Zod".
*   **[`Orchestrator Workflow`](file:///f:/Cursos/IA/capaMapsRutaCiclista/.agents/workflows/orchestrator_flow.md)**
    *   **El Concepto:** Es el "Pipeline" o bucle asíncrono. Enseña a la IA cómo crear ramas en Github, cómo llamar a sus "obreros" (Front y Back) enviándoles *micro-prompts* para cuidar sus tokens, y cómo gestionar cuándo se termina un ciclo.

### 👷‍♂️ Los "Workers" (Agentes Creadores)
Cada uno opera en espacios de memoria aislados (sin cruzarse entre ellos).
*   **[`Backend Expert`](file:///f:/Cursos/IA/capaMapsRutaCiclista/.agents/skills/backend_expert/SKILL.md) y [`Frontend Expert`](file:///f:/Cursos/IA/capaMapsRutaCiclista/.agents/skills/frontend_expert/SKILL.md)**
    *   **El Concepto:** Toman micro-tareas del Orquestador (Ej: "Programa *solo* este Endpoint en NodeJS").
    *   **RAG (Retrieval-Augmented Generation):** Antes de programar librerías de interfaz de mapas que cambian mucho, el Frontend Expert usa una herramienta llamada **Context7 MCP**. Esto le permite buscar en la nube la documentación exacta de 2026, evitando escribir código inventado (alucinaciones).

### 🧐 El "Reflection Loop"
*   **[`QA Reviewer & Reflection Specialist`](file:///f:/Cursos/IA/capaMapsRutaCiclista/.agents/skills/qa_reviewer/SKILL.md)**
    *   **El Concepto:** (La "Joya de la Corona" Agéntica). Tras programar, la tarea no se acepta automáticamente. Se pasa al **QA Reviewer**. Este adopta una postura antagónica y estricta. Repasa las líneas de código del Worker contra el `SDD.md`. Si falla, emite una Crítica estructurada (`[STATUS: REJECTED]`) obligando al Worker a refactorizar sus errores. Este ciclo iterativo "Autosanador" genera código perfecto sin que el humano mueva un dedo.

---

## 3. Capacidades de Vanguardia en este Ecosistema

Para desafiar aún más la autonomía de la máquina, hemos inyectado los siguientes superpoderes a través del marco de trabajo asíncrono (MCP):

1. **Memoria Epistémica (Graph Database):** Los Agentes no empiezan desde cero cada día. Tienen su propio servidor de MCP Memory. Cuando el QA Reviewer castiga a un Worker por un error lógico o de asincronía en React, ese error y su lección se almacenan. En el futuro, los agentes peinarán esa "memoria histórica artificial" antes de cometer dos veces el mismo error.
2. **Evaluación Visual con Computer Vision:** Los tests End-To-End (con navegadores Headless como *Playwright*) no solo analizan que no explote el programa; toman capturas de pantalla de la app. El QA Reviewer emplea modelos visuales (MLLM) avanzados para chequear la fidelidad del CSS Glassmorphism y la UI que no pueden probarse mediante Unit Tests normales.
3. **Gobierno Corporativo Auténtico (Pull Requests):** Nada se sube a la rama principal (main). El Orquestador comanda un sistema de creación de ramas y comiteo a `Github`. El QA Reviewer de IA publica los fallos u observaciones mediante herramientas de **Revisión de Pull Requests** de manera asíncrona usando MCP Github, igual que un Tech Lead humano dejaría notas en tu repositorio.

## 🚀 Cómo activar estee Ecosistema

Tu entorno local ya está 100% cableado. Cuando inicies tu asistencia agéntica, simplemente dale esta instrucción:

> *"Asume tu rol de Orquestador usando `orchestrator_flow.md` y da comienzo a la Fase de Preparación con Github y Andamiaje."*

A partir de ahí, solo tendrás que observar cómo los Agentes virtuales clonan las normas, descargan contextos en el RAG, se pasan códigos y debaten en el **Bucle de Reflexión** hasta ofrecerte una Pull Request asombromasamente impecable y aprobada visualmente.
