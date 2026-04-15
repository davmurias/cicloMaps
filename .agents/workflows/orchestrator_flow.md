---
description: Flujo Maestro de Trabajo del Orquestador de Agentes
---

# Workflow: Orquestación Multi-Agente para React+NodeJS

1.  **Auditoría y Planificación Estratégica:**
    - Abre siempre primero `docs/SDD.md` para entender el modelo arquitectónico vigente.
    - Segundo, lee rigurosamente `TODO.md`. **Es imperativo respetar el orden de las fases.** El Orquestador no avanzará jamás a la Fase N+1 si la Fase N no ha sido concluida y formalmente marcada con `[x]`.
    - Sé proactivo manteniendo el `TODO.md`: debes marcar las tareas completadas y documentar nuevas subtareas nacidas del flujo orgánico.
2.  **Preparación de Rama Segura (Github MCP):**
    Usa el terminal local. El Orquestador se cerciora de inicializar Git (`git init`) si no existiera, y arranca con un `git checkout -b refactor/agentic-migration`. Aquí no empujamos a _main_.
3.  **Andamiaje Base:** Recorte de Contexto Extremo en tareas divisibles.
    `mkdir server`
    `npm create vite@latest client -- --template react` (en non-interactive mode).
4.  **Ejecución de Agentes Especialistas y RAG Inyección:** Lanza al especialista requerido. Los roles actuales fijos son:
    - **Frontend Expert / Backend Expert:** Código de la SPA y del servidor Hexagonal.
    - **UI/UX Expert:** Arquitecto de diseño, curador del `DESIGN_SYSTEM.md`.
    - **A11Y Expert:** Garante del estándar WCAG 2.2 y POUR.
    - **Security Expert:** Perfil OWASP (CORS, XSS, Escaneo de tokens).
    - **DevOps Expert:** Operador de `docker-mcp`, GitHub Actions e Infraestructura.
    Antes de programar nada que no conozcan, cualquier agente TIENE ÓRDEN estricta de contactar al servidor MCP **Context7** (`query-docs`) para descargar el estado del arte de las librerías a usar.
5.  **Loop de Reflexión de Oro (The QA Reviewer con Memoria Epistémica):** Antes de dar una tarea como finalizada, el Orquestador _frena_.
    - Inicia su MCP **Memory** para observar si fallos extraídos del worker ya ocurrieron (Memoria Epistémica de la IA).
    - Carga a la Skill `qa_reviewer`.
    - Si el QA Reviewer decide `[STATUS: REJECTED]`, el Orquestador alimenta a MCP Memory el fallo descubierto, extrae la recomendación, y obliga al trabajador a curarse (_Self-Healing Loop_).
6.  **Verificación E2E Vision & Integración Contínua vía PR (GitHub):**
    - Correrá _Playwright_ lanzando ambos servidores, recolectando el Status Final UI/Código.
    - El QA evalúa fotográficamente ese reporte E2E.
    - Si todo es aprobado de forma puritana, el Orquestador comitea su rama en progreso, asume la herramienta _MCP Github_, y eleva un **Pull Request** formal en la plataforma detallando todo lo que los Agentes han reconstruido con enlaces y rastreo SDD completo. Nadie subirá el trabajo a producción directo al dueño.

### 📡 Mecanismo de Sincronización y Handover

Para mantener control sobre el Loop de Reflexión de IA Agéntica, intervienen **Criterios y Handovers** explícitos:

1.  **Protocolo de Fallo Humano (Human-in-the-Loop):** Las directivas del usuario humano son la **Corte Suprema**. Si el usuario reporta un fallo (vía texto, pegando un log, o adjuntando una imagen), el Orquestador congela las tareas actuales, pausa al QA_Reviewer, asume el Rol Especialista necesario para parchearlo en el archivo, avisa al usuario, e inyecta la solución en la BBDD Vectorial de MCP Memory para prevención sistémica.
2.  **Iteraciones de Autorreparación (TDD fixing local):** Si al lanzar los test del codebase fallan en terminal, los "workers" se reparan iterativamente en un bucle local; pero cuando devuelven el control del exit code 0 al Orquestador, entran entonces al anillo de validación mayor.
3.  **Examen de Especialistas Externos:** La tarea completada jamás asume el éxito. Se deposita en manos del rol apropiado (QA Reviewer, Security Expert, A11y Expert) que escanean si los Criterios abstractos de SDD.md y DESIGN_SYSTEM.md coinciden.
4.  **Sello Físico y Polling del Orquestador:** Solo cuando un Hilo alcanza Status final sin bloqueos, emite el fichero de estado `.agent_status.json` final.
5.  **Obligación Documental Continua:** Inmediatamente después de aplicar cualquier macro-feature, resolver un bug con Human-in-the-Loop o transicionar la arquitectura, el Orquestador tiene la orden de abrir `docs/ARCHITECTURE.md` y `docs/SDD.md` y recalibrar su contenido de manera obligatoria para asegurar que el sistema no arrastre obsolescencia.
6.  **Pase a Producción (DevOps Handover):** Una finalizado el andamiaje, el `devops_expert` asume el control del entorno, orquesta los contenedores en localhost usando la CLI o el MCP `@smithery/docker-mcp` contra `docker.sock`, y despacha las actualizaciones CI/CD hacia `.github/workflows/deploy.yml`.
