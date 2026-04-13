---
description: Flujo Maestro de Trabajo del Orquestador de Agentes
---

# Workflow: Orquestación Multi-Agente para React+NodeJS

1.  **Auditoría SDD:** Abre el documento `docs/SDD.md` y úsalo como System Prompt contextual base.
2.  **Preparación de Rama Segura (Github MCP):**
    Usa el terminal local. El Orquestador se cerciora de inicializar Git (`git init`) si no existiera, y arranca con un `git checkout -b refactor/agentic-migration`. Aquí no empujamos a *main*.
3.  **Andamiaje Base:** Recorte de Contexto Extremo en tareas divisibles.
    `mkdir server`
    `npm create vite@latest client -- --template react` (en non-interactive mode).
4.  **Ejecución de Agentes Especialistas y RAG Inyección:** Lanza a `backend_expert` o `frontend_expert`. Antes de programar nada que no conozcan, el agente TIENE ÓRDEN estricta de contactar al servidor MCP **Context7** (`query-docs`) para descargar el estado del arte de las librerías a usar (evitando alucinaciones de código erróneo).
5.  **Loop de Reflexión de Oro (The QA Reviewer con Memoria Epistémica):** Antes de dar una tarea como finalizada, el Orquestador *frena*.
    - Inicia su MCP **Memory** para observar si fallos extraídos del worker ya ocurrieron (Memoria Epistémica de la IA).
    - Carga a la Skill `qa_reviewer`.
    - Si el QA Reviewer decide `[STATUS: REJECTED]`, el Orquestador alimenta a MCP Memory el fallo descubierto, extrae la recomendación, y obliga al trabajador a curarse (*Self-Healing Loop*).
6.  **Verificación E2E Vision & Integración Contínua vía PR (GitHub):** 
    - Correrá *Playwright* lanzando ambos servidores, recolectando el Status Final UI/Código.
    - El QA evalúa fotográficamente ese reporte E2E.
    - Si todo es aprobado de forma puritana, el Orquestador comitea su rama en progreso, asume la herramienta *MCP Github*, y eleva un **Pull Request** formal en la plataforma detallando todo lo que los Agentes han reconstruido con enlaces y rastreo SDD completo. Nadie subirá el trabajo a producción directo al dueño.

### 📡 Mecanismo de Sincronización y Handover

Para mantener control sobre el Loop de Reflexión de IA Agéntica, intervienen **Criterios y Handovers** explícitos:

1.  **Iteraciones de Autorreparación (TDD fixing local):** Si al lanzar los test del codebase fallan en terminal, los "workers" se reparan iterativamente en un bucle local; pero cuando devuelven el control del exit code 0 al Orquestador, entran entonces al anillo de validación mayor: The Reflection Loop.
2.  **Examen de QA Externo:** La tarea completada jamás asume el éxito. Se deposita el informe test coverage en las manos de la habilidad `qa_reviewer` que escanea si la cobertura técnica real y la "legal" (LCOV metrics abstractas de calidad vs directivas de SDD.md sobre Arquitectura) coinciden.
3.  **Sello Físico y Polling del Orquestador:** Solo cuando un Hilo alcanza Status final en el Reflection Loop, emiten un el fichero de estado `.agent_status.json` final que desatasca al orquestador hacia su testing global.
