'use client'
import { useState } from 'react'
import Select from 'react-select'
import { Database, Tables, Enums } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/client'
import { calculateAverage } from '@/lib/utils'
import { Grid } from 'gridjs-react';


// import { categoryOptions } from './categoryOptions'

const categoryOptions = [
	{ value: 'Nutrition', label: 'Nutrition' },
	{ value: 'Pests_and_Pest_management', label: 'Pests' },
	{ value: 'Climate_and_Weather_risk', label: 'Climate' },
	{ value: 'Sustainability', label: 'Sustainability' },
	{ value: 'Water', label: 'Water' },
	{ value: 'Crop_management_decisions', label: 'Crop Management' }
]

interface LeaderboardProps {
	initialScores: Tables<'scores'>[] // Replace 'any[]' with the actual type if known
	evaluations: Tables<'evaluations'>[] // Replace 'any[]' with the actual type if known
}

export function Leaderboard({ initialScores, evaluations }: LeaderboardProps) {
	const [scores, setScores] = useState(initialScores)
	const supabase = createClient()
	const data = []
	if (scores.length > 0 && evaluations.length > 0) {
		const groupedScores = Object.groupBy(scores, (item) => item.evaluation_id)
		const groupedEvaluations = Object.groupBy(evaluations, (item) => item.id)
		for (const evaluationId in groupedScores) {
			const evaluationGroup = groupedEvaluations[evaluationId]
			const evaluationScores = groupedScores[evaluationId]
			if (!evaluationGroup || !evaluationScores || evaluationGroup.length === 0) continue
			const evaluation = evaluationGroup[0]
			const accuracy: number[] = []
			const completeness: number[] = []
			const conciseness: number[] = []
			const relevance: number[] = []

			if (evaluationScores) {
				evaluationScores.forEach((score) => {
					accuracy.push(score.accuracy)
					completeness.push(score.completeness)
					conciseness.push(score.conciseness)
					relevance.push(score.relevance)
				})
			}

			if (accuracy.length > 0) {
				data.push([
					evaluation.judge_model,
					evaluation.subject_model,
					calculateAverage(accuracy).toFixed(2),
					calculateAverage(completeness).toFixed(2),
					calculateAverage(conciseness).toFixed(2),
					calculateAverage(relevance).toFixed(2)
				])
			}
		}
	}

	const columns = [
		{ name: 'Judge Model', sort: true },
		{ name: 'Subject Model', sort: true },
		{ name: 'Accuracy', sort: true },
		{ name: 'Completeness', sort: true },
		{ name: 'Conciseness', sort: true },
		{ name: 'Relevance', sort: true }
	]

	async function getScores(categories: string[]) {
		const newScores = (await supabase.from('scores').select('*').overlaps('categories', categories)).data ?? []
		setScores(newScores)
	}

	return (
		<div className='h-full w-full'>
			<Select
				onChange={(options) => {
					getScores(options.map((option) => option.value))
				}}
				instanceId='category-select'
				defaultValue={categoryOptions}
				isMulti
				options={categoryOptions}
				className='basic-multi-select'
				classNamePrefix='select'
			/>
			<Grid
				data={data}
				sort={true}
				columns={columns}
			/>
		</div>
	)
}
 