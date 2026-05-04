# Roadmap de evolución — AI-AgriBench interno

## 1. Visión general

El proyecto actual funciona como un MVP visual para mostrar resultados de evaluación de modelos de IA en un leaderboard agrícola.

La visión de evolución es convertirlo en una plataforma interna para evaluar, comparar y documentar respuestas generadas por modelos o agentes de IA en contextos agronómicos, fisiológicos y técnicos.

## 2. Arquitectura objetivo

```text
Frontend Next.js/Vercel
        ↓
Supabase Database
        ↑
Backend evaluador n8n/Python
        ↑
Preguntas agrícolas + respuestas de modelos + rúbrica técnica
```

Componentes principales:

1. Frontend: interfaz visual para revisar resultados, filtros, detalles y reportes.
2. Supabase: base de datos central para almacenar evaluaciones, preguntas, respuestas, scores y metadatos.
3. Backend evaluador: flujo que genera o recibe respuestas de modelos y las evalúa con una rúbrica técnica.
4. Dataset agrícola: banco curado de preguntas, casos técnicos y respuestas de referencia.

## 3. Evolución del frontend

### Fase 1 — Limpieza del MVP

Objetivo: mejorar la presentación actual sin modificar la lógica de fondo.

Mejoras sugeridas:

- Sustituir datos dummy por datos reales o claramente marcados como demo.
- Agregar tarjetas resumen:
  - número de modelos evaluados.
  - número de preguntas/casos.
  - promedio global por métrica.
  - mejor modelo por categoría.
- Mejorar filtros por:
  - categoría agronómica.
  - modelo evaluado.
  - modelo juez.
  - fecha de evaluación.
- Agregar estado vacío cuando no haya datos disponibles.
- Agregar leyenda de métricas.

### Fase 2 — Vista de detalle por modelo

Objetivo: que el usuario pueda entender por qué un modelo tiene cierta calificación.

Mejoras sugeridas:

- Crear página `/model/[id]`.
- Mostrar:
  - promedio por métrica.
  - distribución de scores.
  - preguntas con mejor y peor desempeño.
  - categorías fuertes y débiles.
  - observaciones del modelo juez.

### Fase 3 — Vista de casos/preguntas

Objetivo: revisar cada caso agrícola individual.

Mejoras sugeridas:

- Crear página `/cases`.
- Mostrar:
  - pregunta o caso agrícola.
  - categoría.
  - respuesta del modelo.
  - respuesta de referencia.
  - evaluación del juez.
  - score por criterio.

### Fase 4 — Panel administrativo

Objetivo: permitir carga y curación de datos desde la interfaz.

Mejoras sugeridas:

- Login con Supabase Auth.
- Cargar nuevas preguntas.
- Cargar respuestas de referencia.
- Crear nuevas corridas de evaluación.
- Validar o corregir scores.
- Exportar resultados.

## 4. Evolución del backend

### Fase 1 — Backend simple de carga

Objetivo: insertar resultados en Supabase sin hacerlo manualmente.

Opciones:

- n8n webhook.
- Script Python.
- API route en Next.js.

Flujo inicial:

```text
JSON con resultados → backend → validación → Supabase
```

### Fase 2 — Backend evaluador

Objetivo: evaluar automáticamente respuestas agrícolas.

Flujo sugerido:

```text
Pregunta agrícola
  ↓
Modelo sujeto responde
  ↓
Modelo juez evalúa con rúbrica
  ↓
Se guardan scores y explicación
  ↓
Frontend actualiza leaderboard
```

### Fase 3 — Multi-model evaluation

Objetivo: comparar varios modelos en el mismo set de preguntas.

Flujo sugerido:

```text
Dataset de preguntas
  ↓
Modelo A / Modelo B / Modelo C
  ↓
Evaluación por juez
  ↓
Comparación por categoría y métrica
```

### Fase 4 — Reportes automáticos

Objetivo: generar reportes técnicos a partir de las evaluaciones.

Posibles salidas:

- PDF técnico.
- Excel comparativo.
- Resumen ejecutivo.
- Ranking por categoría.
- Matriz de riesgos técnicos.

## 5. Uso propuesto de Supabase

Supabase debe funcionar como la base de datos central del sistema.

### Tablas actuales

- `evaluations`
- `scores`

### Tablas recomendadas para evolución

#### `questions`

Banco de preguntas o casos agrícolas.

Campos sugeridos:

- `id`
- `question_text`
- `crop`
- `category`
- `subcategory`
- `difficulty_level`
- `source_type`
- `source_reference`
- `created_at`

#### `reference_answers`

Respuestas de referencia o criterios técnicos esperados.

Campos sugeridos:

- `id`
- `question_id`
- `reference_answer`
- `key_points`
- `risk_notes`
- `evidence_notes`
- `created_at`

#### `model_responses`

Respuestas generadas por los modelos evaluados.

Campos sugeridos:

- `id`
- `question_id`
- `evaluation_id`
- `subject_model`
- `response_text`
- `response_metadata`
- `created_at`

#### `judge_reviews`

Evaluación detallada realizada por el modelo juez.

Campos sugeridos:

- `id`
- `model_response_id`
- `judge_model`
- `accuracy`
- `completeness`
- `conciseness`
- `relevance`
- `agronomic_actionability`
- `technical_risk`
- `evidence_grounding`
- `review_summary`
- `created_at`

#### `evaluation_runs`

Agrupa corridas de evaluación.

Campos sugeridos:

- `id`
- `name`
- `description`
- `dataset_version`
- `status`
- `created_by`
- `created_at`

## 6. Métricas recomendadas

Métricas actuales:

- Accuracy
- Completeness
- Conciseness
- Relevance

Métricas agrícolas recomendadas:

- Agronomic actionability: si la respuesta puede convertirse en una acción técnica útil.
- Technical risk: si la respuesta puede inducir una mala decisión agronómica.
- Evidence grounding: si la respuesta está alineada con evidencia, referencias o protocolos.
- Crop specificity: si la respuesta considera el cultivo y etapa fenológica.
- Diagnostic clarity: si identifica claramente el problema o condición fisiológica.

## 7. Casos de uso internos

La herramienta puede aplicarse para evaluar agentes o modelos en temas como:

- Energy-Check.
- AFC.
- PhotosynQ.
- Termografía agrícola.
- Microbioma.
- Bioestimulantes.
- Nutrición vegetal.
- Estrés abiótico.
- Diagnóstico fisiológico.
- Recomendaciones técnicas para cultivos estratégicos.

## 8. Roadmap operativo sugerido

### Corto plazo

- Documentar el MVP.
- Mejorar diseño visual del leaderboard.
- Mantener datos demo controlados.
- Definir la rúbrica interna de evaluación agrícola.

### Mediano plazo

- Crear tabla de preguntas agrícolas.
- Crear carga manual desde Supabase o formulario.
- Crear backend simple para insertar evaluaciones.
- Agregar vista de detalle por modelo.

### Largo plazo

- Automatizar evaluación multi-modelo.
- Integrar n8n como orquestador.
- Generar reportes PDF/Excel.
- Construir un benchmark agrícola interno por dominios técnicos.

## 9. Principio de diseño técnico

La plataforma debe separar tres capas:

1. Datos: Supabase.
2. Evaluación: backend o n8n.
3. Visualización: frontend Next.js.

Esto permite evolucionar cada capa sin romper las demás.
