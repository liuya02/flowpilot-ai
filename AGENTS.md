# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## FlowPilot AI visual direction

- Source of truth: `references/homepage-option-1.png`.
- Use a warm ivory base, ink navy typography, muted pine green accents, generous whitespace, thin dividers, and restrained line icons.
- Keep the product and project management workspace fully separate from the HR and organization management workspace.
- Avoid gradients, glass effects, dense dashboards, decorative illustrations, excessive cards, and heavy shadows.
- The core journey is: choose a workspace, choose a task, provide structured input, generate a result, and complete a human verification checklist.
- The product-management closed loop is requirement analysis → PRD → task breakdown → launch review. The HR closed loop is business understanding → problem diagnosis → solution portfolio, then branches to talent review or organization diagnosis. Every transition requires completed human verification, then prefills the next task without duplicating prior handoff notes.
- Generated results are directly editable. Any edit invalidates verification. Input and result drafts auto-save only to browser localStorage, can be resumed from home, and must remain explicitly clearable for shared-device safety.
- Draft storage supports multiple independent drafts for the same tool. AI generation creates a version checkpoint automatically; users can also save, restore, and delete manual versions from the draft center. Keep at most 12 versions per draft.
- Every newly created task starts a distinct project identity (`projectId` plus an editable `projectName`). Workflow transitions create a new stage draft but preserve that project identity; renaming a project updates every stored stage that shares the same ID.
- The project cockpit groups local drafts by `projectId`, uses the latest stage as the current source, and summarizes objective, progress, actions, risks, assumptions, version count, and stage history. Keep it focused and operational rather than turning it into a dense analytics dashboard.
- Project-level management data lives in `projectMeta` and is copied across every draft sharing the same `projectId`. It includes owner, due date, milestones, blockers, and manually tracked risks; preserve it across workflow transitions, tutorial resume, local migration, and whole-project Markdown export.
- Whole-project Markdown export lives in `src/markdown.js`. It exports generated stages in chronological order, includes each professional deliverable and its evidence sections, excludes input-only stages, and always ends with the human-verification warning. Keep `tests/project-export.test.mjs` covering this contract.
- The header entry is named “教程”. It opens two one-click, hands-on routes (product delivery and HR/organization improvement) that create separate prefilled projects. Keep the language instructional and product-focused; do not describe these cases as recruiter-facing, portfolio, showcase, or interview content.
- Tutorial drafts persist `tutorialId` together with `projectId`. Route IDs define the four tutorial stages; generated stage results drive completion state. Task and result screens show the active route, while the tutorial panel must resume the newest project for each tutorial or explicitly start a separate fresh project.
- Sparse input must produce a clear information-insufficient prompt with an explicit override. DeepSeek failure keeps the deterministic template result and exposes an in-place retry action rather than silently hiding the failure.
- Core workflow results combine a task-specific `deliverable` table with the existing evidence sections. The table is editable, versioned, exported to Markdown, and carried into the next verified stage. Product tools use requirement, PRD, execution, and launch-review schemas; HR tools use business-card, five-dimension diagnosis, solution portfolio, talent, and organization schemas.
- `professionalDeliverableDefinitions` in `src/App.jsx` and `deliverableDefinitions` in `worker/index.js` intentionally mirror the same titles and columns. Keep them aligned whenever a schema changes. Never let DeepSeek invent missing thresholds, dates, people, or current-state data inside a deliverable; unresolved quantities must be marked for confirmation.
- AI generation goes through same-origin `/api/deepseek`: Vite serves a local server-only proxy and the Sites worker handles production requests. Never expose the key through `VITE_*`; keep `.env.local` ignored and retain the deterministic local-template fallback.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
