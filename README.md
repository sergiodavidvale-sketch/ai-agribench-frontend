# AI-AgriBench Frontend

Frontend tipo leaderboard para visualizar resultados de evaluación de modelos de IA en dominios agrícolas, basado en Next.js y Supabase.

Este repositorio es una instalación propia del frontend público de AI-AgriBench. El motor completo de generación/evaluación del benchmark no está incluido aquí; este proyecto funciona como interfaz para mostrar resultados almacenados en Supabase.

## Stack técnico

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- React Bootstrap
- DataTables

## Instalación local

```bash
git clone https://github.com/sergiodavidvale-sketch/ai-agribench-frontend.git
cd ai-agribench-frontend
npm install
```

Copia el archivo de variables de entorno:

```bash
copy .env.example .env.local
```

En macOS/Linux sería:

```bash
cp .env.example .env.local
```

Edita `.env.local` con los datos de tu proyecto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=tu_anon_key
```

Después corre el servidor local:

```bash
npm run dev
```

Abre:

```text
http://localhost:3000
```

## Configuración de Supabase

Este frontend espera dos tablas principales:

- `evaluations`
- `scores`

Se agregó un script mínimo en:

```text
supabase/schema.sql
```

Para usarlo:

1. Entra a tu proyecto de Supabase.
2. Ve a **SQL Editor**.
3. Copia y ejecuta el contenido de `supabase/schema.sql`.
4. Verifica que se hayan creado las tablas `evaluations` y `scores`.
5. Copia tu Project URL y anon/publishable key en `.env.local` o en las variables de entorno de Vercel.

El script incluye datos dummy para validar que el leaderboard renderice correctamente.

## Variables requeridas en Vercel

Si despliegas en Vercel, agrega estas variables en **Project Settings > Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=tu_anon_key
```

## Despliegue en Vercel

1. Importa este repositorio en Vercel.
2. Selecciona framework **Next.js**.
3. Agrega las variables de entorno de Supabase.
4. Ejecuta deploy.

Build command:

```bash
npm run build
```

Output: Next.js default.

## Notas de implementación

La página principal consulta Supabase y pasa los datos al componente `Leaderboard`:

- `evaluations`: información del modelo evaluado y modelo juez.
- `scores`: calificaciones por pregunta y categoría.

Las métricas visibles son:

- Accuracy
- Completeness
- Conciseness
- Relevance

Categorías actualmente incluidas en el frontend:

- Nutrition
- Weeds
- Pests and Pest Management
- Climate and Weather Risk
- Sustainability
- Water
- Crop Management Decisions

## Siguiente etapa sugerida

Para convertir esto en un benchmark interno agrícola, se puede construir un backend propio que:

1. Reciba preguntas agronómicas curadas.
2. Ejecute respuestas de modelos sujetos.
3. Evalúe respuestas con un modelo juez.
4. Guarde resultados en Supabase.
5. Actualice automáticamente el leaderboard.

Métricas internas sugeridas para una versión COSMOCEL/Rovensa:

- Accuracy
- Completeness
- Relevance
- Conciseness
- Agronomic actionability
- Technical risk
- Evidence grounding
