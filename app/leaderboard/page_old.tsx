// 'use client'

// import Select from 'react-select'
// import { Grid } from 'gridjs-react'
// import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
// import 'gridjs/dist/theme/mermaid.css'


// export default function Leaderboard() {
// 	const scoresUrl = 'http://127.0.0.1:5000/scores'
// 	const columns = [
// 		{ name: 'Judge Model', sort: true },
// 		{ name: 'Subject Model', sort: true },
// 		{ name: 'Accuracy', sort: true },
// 		{ name: 'Completeness', sort: true },
// 		{ name: 'Conciseness', sort: true },
// 		{ name: 'Relevance', sort: true }
// 	]

// 	const categoryOptions = [
// 		{ value: 'Nutrition', label: 'Nutrition' },
// 		{ value: 'Pests_and_Pest_management', label: 'Pests' },
// 		{ value: 'Climate_and_Weather_risk', label: 'Climate' },
// 		{ value: 'Sustainability', label: 'Sustainability' },
// 		{ value: 'Water', label: 'Water' },
// 		{ value: 'Crop_management_decisions', label: 'Crop Management' }
// 	]

// 	const [categories, setCategories] = useState(categoryOptions.map((option) => option.value))
// 	type Evaluation = {
// 		id: string
// 		judge_model: string
// 		subject_model: string
// 		// add other fields if needed
// 	}

// 	type Score = {
// 		evaluation_id: string
// 		accuracy: number
// 		completeness: number
// 		conciseness: number
// 		relevance: number
// 		categories: string[]
// 		// add other fields if needed
// 	}

// 	const [scoresResponse, setScoresResponse] = useState<{ evaluations: Evaluation[]; scores: Score[] }>({
// 		evaluations: [],
// 		scores: []
// 	})

// 	async function fetchScores(): Promise<void> {
// 		const response = await fetch(scoresUrl).then((response) => response.json())
// 		setScoresResponse(response)
// 	}

// 	const { evaluations, scores } = scoresResponse

// 	const data = []
// 	if (scores.length > 0 && evaluations.length > 0) {
// 		const groupedScores = Object.groupBy(scores, (item) => item.evaluation_id)
// 		const groupedEvaluations = Object.groupBy(evaluations, (item) => item.id)
// 		for (const evaluationId in groupedScores) {
// 			const evaluationGroup = groupedEvaluations[evaluationId]
// 			const evaluationScores = groupedScores[evaluationId]
// 			if (!evaluationGroup || !evaluationScores || evaluationGroup.length === 0) continue
// 			const evaluation = evaluationGroup[0]
// 			const accuracy: number[] = []
// 			const completeness: number[] = []
// 			const conciseness: number[] = []
// 			const relevance: number[] = []

// 			if (evaluationScores) {
// 				evaluationScores.forEach((score) => {
// 					const intersection = score.categories.filter((category) => categories.includes(category))
// 					if (intersection.length > 0) {
// 						accuracy.push(score.accuracy)
// 						completeness.push(score.completeness)
// 						conciseness.push(score.conciseness)
// 						relevance.push(score.relevance)
// 					}
// 				})
// 			}

// 			if (accuracy.length > 0) {
// 				data.push([
// 					evaluation.judge_model,
// 					evaluation.subject_model,
// 					calculateAverage(accuracy).toFixed(2),
// 					calculateAverage(completeness).toFixed(2),
// 					calculateAverage(conciseness).toFixed(2),
// 					calculateAverage(relevance).toFixed(2)
// 				])
// 			}
// 		}
// 	}

// 	useEffect(() => {
// 		fetchScores()
// 	}, [])

// 	return (
// 		<div>
// 			<Select
// 				onChange={(options) => {
// 					setCategories(options.map((option) => option.value))
// 				}}
// 				instanceId='category-select'
// 				defaultValue={categoryOptions}
// 				isMulti
// 				name='colors'
// 				options={categoryOptions}
// 				className='basic-multi-select'
// 				classNamePrefix='select'
// 			/>
// 			<Grid
// 				data={data}
// 				sort={true}
// 				columns={columns}
// 			/>
// 		</div>
// 	)
// }
