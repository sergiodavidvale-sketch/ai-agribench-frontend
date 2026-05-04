# Manual de uso — AI-AgriBench Frontend

## 1. Propósito del proyecto

Este proyecto es un frontend tipo leaderboard para visualizar resultados de evaluación de modelos de inteligencia artificial aplicados a preguntas o casos agrícolas.

La aplicación no evalúa los modelos por sí sola. Su función principal es leer resultados previamente almacenados en Supabase y presentarlos en una tabla comparativa.

## 2. ¿Qué muestra el frontend?

El dashboard muestra una tabla con modelos evaluados y sus calificaciones promedio en cuatro criterios principales:

- Accuracy: precisión técnica de la respuesta.
- Completeness: nivel de cobertura o completitud de la respuesta.
- Conciseness: claridad y síntesis de la respuesta.
- Relevance: pertinencia respecto a la pregunta o caso agrícola.

También permite filtrar los resultados por categoría agronómica:

- Nutrition
- Weeds
- Pests
- Weather
- Sustainability
- Water
- Crop Management

## 3. Flujo general de funcionamiento

El flujo actual es:

1. Supabase almacena los datos de evaluación.
2. La aplicación Next.js consulta las tablas `evaluations` y `scores`.
3. El frontend agrupa los resultados por modelo evaluado.
4. Calcula promedios por métrica.
5. Presenta los resultados en una tabla ordenable y filtrable.

Esquema conceptual:

```text
Evaluaciones agrícolas -> Supabase -> Next.js frontend -> Leaderboard visual
```

## 4. Estructura de datos en Supabase

### Tabla `evaluations`

Contiene información general de cada corrida de evaluación.

Campos principales:

- `id`: identificador de la evaluación.
- `created_at`: fecha de creación.
- `subject_model`: modelo evaluado.
- `judge_model`: modelo usado como juez.
- `judge_temperature`: temperatura del modelo juez.
- `num_processes`: número de procesos usados en la evaluación.

Ejemplo:

```text
subject_model: Demo Model A
judge_model: gpt-4o-mini
judge_temperature: 0
num_processes: 1
```

### Tabla `scores`

Contiene las calificaciones por pregunta o caso evaluado.

Campos principales:

- `id`: identificador del registro.
- `evaluation_id`: relación con la tabla `evaluations`.
- `question_id`: identificador de la pregunta evaluada.
- `accuracy`: calificación de precisión.
- `completeness`: calificación de completitud.
- `conciseness`: calificación de síntesis.
- `relevance`: calificación de relevancia.
- `categories`: categorías agronómicas asociadas.

Ejemplo:

```text
question_id: demo-q-001
accuracy: 4.2
completeness: 4.0
conciseness: 3.8
relevance: 4.4
categories: Nutrition, Crop_management_decisions
```

## 5. Cómo interpretar la tabla

Cada fila representa un modelo evaluado.

Cada columna muestra el promedio de las calificaciones registradas para ese modelo.

Por ejemplo:

```text
Demo Model A | Accuracy 4.20 | Completeness 4.00 | Conciseness 3.80 | Relevance 4.40
```

Esto significa que el modelo llamado `Demo Model A` obtuvo un promedio de 4.20 en precisión, 4.00 en completitud, 3.80 en concisión y 4.40 en relevancia, considerando las preguntas disponibles para ese modelo.

## 6. Cómo usar los filtros

En la parte superior del leaderboard se muestran categorías agronómicas.

Cuando se desactiva una categoría, el frontend recalcula la tabla usando solamente los scores que pertenecen a las categorías seleccionadas.

El sistema siempre mantiene al menos una categoría seleccionada para evitar una tabla vacía por error.

## 7. Cómo agregar datos nuevos manualmente

Los datos nuevos se pueden agregar directamente en Supabase.

### Paso 1: crear una evaluación

Insertar un registro en `evaluations`:

```sql
insert into public.evaluations (judge_model, judge_temperature, num_processes, subject_model)
values ('gpt-4o-mini', 0, 1, 'Nombre del modelo evaluado');
```

### Paso 2: agregar scores asociados

Después agregar registros en `scores`, usando el `id` de la evaluación creada:

```sql
insert into public.scores (
  evaluation_id,
  question_id,
  accuracy,
  completeness,
  conciseness,
  relevance,
  categories
)
values (
  1,
  'case-001',
  4.5,
  4.2,
  3.9,
  4.6,
  array['Nutrition', 'Crop_management_decisions']
);
```

Después de insertar los datos, recargar la página de Vercel para ver los cambios.

## 8. Variables de entorno requeridas

La aplicación necesita dos variables:

```env
NEXT_PUBLIC_SUPABASE_URL=URL_DEL_PROYECTO_SUPABASE
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=ANON_OR_PUBLISHABLE_KEY
```

Estas variables se configuran en:

- `.env.local` para uso local.
- Vercel > Project Settings > Environment Variables para producción.

## 9. Despliegue actual

La app está publicada en Vercel.

URL de producción:

```text
https://ai-agribench-frontend-teal.vercel.app/
```

Cada cambio enviado a la rama `main` del repositorio dispara un redeploy automático en Vercel.

## 10. Limitaciones actuales

La versión actual todavía es un MVP visual.

Limitaciones principales:

- No tiene un formulario interno para cargar nuevas evaluaciones.
- No ejecuta automáticamente modelos de IA.
- No genera preguntas ni respuestas.
- No realiza evaluación automática con un modelo juez.
- No tiene panel administrativo.
- Los datos se cargan actualmente desde Supabase.

## 11. Siguiente evolución recomendada

Para convertir este frontend en una herramienta interna de evaluación agrícola, se recomienda construir un backend adicional que:

1. Reciba preguntas o casos agrícolas.
2. Ejecute respuestas de diferentes modelos.
3. Evalúe cada respuesta con una rúbrica técnica.
4. Guarde los resultados en Supabase.
5. Actualice automáticamente el leaderboard.

Métricas sugeridas para una versión agrícola interna:

- Accuracy
- Completeness
- Conciseness
- Relevance
- Agronomic actionability
- Technical risk
- Evidence grounding

## 12. Uso potencial para COSMOCEL/Rovensa

Este frontend puede servir como base para comparar modelos o agentes de IA en temas como:

- Nutrición vegetal.
- Bioestimulantes.
- Fisiología vegetal.
- Microbioma agrícola.
- Estrés abiótico.
- Diagnóstico Energy-Check.
- Interpretación PhotosynQ.
- Termografía agrícola.
- Recomendaciones agronómicas basadas en evidencia.

La utilidad principal es contar con una vista comparativa clara para identificar qué modelos responden mejor en dominios agrícolas específicos.
