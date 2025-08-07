'use client'
import { ChangeEvent, useState } from 'react'
import { Tables } from '@/lib/supabase/database.types'
import { createClient } from '@/lib/supabase/client'
import { calculateAverage } from '@/lib/utils'
import { Grid } from 'gridjs-react'
import Form from 'react-bootstrap/Form'
import './leaderboard.css'

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

interface StateInfo {
	scores: Tables<'scores'>[]
	selectedCategories: string[]
}

export function Leaderboard({ initialScores, evaluations }: LeaderboardProps) {
	const [state, setState] = useState<StateInfo>({
		scores: initialScores,
		selectedCategories: categoryOptions.map((option) => option.value)
	})

	const supabase = createClient()
	const data = []
	if (state.scores.length > 0 && evaluations.length > 0) {
		const groupedScores = Object.groupBy(state.scores, (item) => item.evaluation_id)
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

	async function handleCheckChange(e: ChangeEvent<HTMLInputElement>, option: { value: string; label?: string }) {
		const checked = e.target.checked

		let categories
		if (checked) {
			categories = [...state.selectedCategories, option.value]
		} else {
			categories = state.selectedCategories.filter((cat) => cat !== option.value)
		}

		console.log('Selected categories:', categories)
		const newScores = (await supabase.from('scores').select('*').overlaps('categories', categories)).data ?? []

		setState((prevState) => ({
			...prevState,
			selectedCategories: categories,
			scores: newScores
		}))
	}

	const columns = [
		{ name: 'Judge Model', sort: true },
		{ name: 'Subject Model', sort: true },
		{ name: 'Accuracy', sort: true },
		{ name: 'Completeness', sort: true },
		{ name: 'Conciseness', sort: true },
		{ name: 'Relevance', sort: true }
	]

	return (
		<div
			className='h-full d-flex flex-column'
			style={{
				backgroundColor: '#D3CDC6',
				color: '#171717',
				borderRadius: '8px'
			}}>
			<Form
				style={{ paddingTop: '4px' , paddingBottom: '0' }}
				className='pl-2 d-flex flex-row'>
				{categoryOptions.map((option) => (
					<Form.Check
						className='pr-3'
						onChange={(e) => {
							handleCheckChange(e, option)
						}}
						style={{
							color: '#171717'
						}}
						key={option.value}
						defaultChecked={true}
						label={option.label}
						name={option.label}
						id={`inline-${option.value}-`}
					/>
				))}
			</Form>

			<Grid
				style={{
					td: {
						color: '#171717',
						backgroundColor: '#D3CDC6'
					},
					th: {
						color: '#171717',
						backgroundColor: '#C8C6C7'
					}
				}}
				data={data}
				sort={true}
				columns={columns}
			/>
		</div>
	)
}
