'use client'
import { ChangeEvent, useState } from 'react'
import { Tables } from '@/lib/supabase/database.types'
import { calculateAverage } from '@/lib/utils'
import Form from 'react-bootstrap/Form'
import dynamic from 'next/dynamic'
import 'datatables.net-dt/css/dataTables.dataTables.css'

const categoryOptions = [
	{ value: 'Nutrition', label: 'Nutrition' },
	{ value: 'Weeds', label: 'Weeds' },
	{ value: 'Pests_and_Pest_management', label: 'Pests' },
	{ value: 'Climate_and_Weather_risk', label: 'Weather' },
	{ value: 'Sustainability', label: 'Sustainability' },
	{ value: 'Water', label: 'Water' },
	{ value: 'Crop_management_decisions', label: 'Crop Management' }
]

const DataTable = dynamic(
	async () => {
		const dtReact = import('datatables.net-react')
		const dtNet = import('datatables.net-dt')

		const [reactMod, dtNetMod] = await Promise.all([dtReact, dtNet])

		reactMod.default.use(dtNetMod.default)
		return reactMod.default
	},
	{ ssr: false }
)

interface LeaderboardProps {
	initialScores: Tables<'scores'>[]
	evaluations: Tables<'evaluations'>[]
}

function getDataFromScores(scores: Tables<'scores'>[], evaluations: Tables<'evaluations'>[]) {
	const data: string[][] = []
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

		evaluationScores.forEach((score) => {
			accuracy.push(score.accuracy)
			completeness.push(score.completeness)
			conciseness.push(score.conciseness)
			relevance.push(score.relevance)
		})

		if (accuracy.length > 0) {
			data.push([
				evaluation.subject_model,
				calculateAverage(accuracy).toFixed(2),
				calculateAverage(completeness).toFixed(2),
				calculateAverage(conciseness).toFixed(2),
				calculateAverage(relevance).toFixed(2)
			])
		}
	}

	return data
}

export function Leaderboard({ initialScores, evaluations }: LeaderboardProps) {
	const [data, setData] = useState<string[][]>(getDataFromScores(initialScores, evaluations))
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		categoryOptions.map((option) => option.value)
	)

	async function handleCheckChange(
		e: ChangeEvent<HTMLInputElement>,
		option: { value: string; label?: string }
	) {
		const newSelectedCategories = e.target.checked
			? [...selectedCategories, option.value]
			: selectedCategories.filter((cat) => cat !== option.value)

		setSelectedCategories(newSelectedCategories)

		const newData = getDataFromScores(
			initialScores.filter((score) => {
				return score.categories.some((cat) => newSelectedCategories.includes(cat))
			}),
			evaluations
		)

		setData(newData)
	}

	function isOnlyCheckmark(option: { value: string; label?: string }) {
		return selectedCategories.length === 1 && selectedCategories[0] === option.value
	}

	return (
		<main style={{ minHeight: '100vh', background: '#f6f7f9', color: '#172033', padding: '32px' }}>
			<section style={{ maxWidth: '1180px', margin: '0 auto' }}>
				<div style={{ marginBottom: '24px' }}>
					<p style={{ margin: 0, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#667085', fontWeight: 700 }}>
						AI-AgriBench
					</p>
					<h1 style={{ margin: '6px 0 8px', fontSize: '34px', lineHeight: 1.15, fontWeight: 800 }}>
						Agricultural AI Evaluation Leaderboard
					</h1>
					<p style={{ margin: 0, maxWidth: '760px', color: '#667085', fontSize: '15px' }}>
						Comparative view of model performance across agronomic evaluation criteria and thematic categories.
					</p>
				</div>

				<div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '18px', boxShadow: '0 12px 30px rgba(16, 24, 40, 0.06)', overflow: 'hidden' }}>
					<div style={{ padding: '18px 22px', borderBottom: '1px solid #e5e7eb' }}>
						<div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Filter by agronomic category</div>
						<Form style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 18px', margin: 0 }}>
							{categoryOptions.map((option) => {
								return (
									<Form.Check
										disabled={isOnlyCheckmark(option)}
										onChange={(e) => {
											handleCheckChange(e, option)
										}}
										style={{ color: '#344054', fontSize: '14px' }}
										key={option.value}
										defaultChecked={true}
										label={option.label}
										name={option.label}
										id={`lb-${option.value}`}
									/>
								)
							})}
						</Form>
					</div>

					<div style={{ padding: '18px 22px 24px' }}>
						<style>{`
							.dataTable { width: 100% !important; border-collapse: collapse !important; }
							.dataTable thead th { background: #f9fafb; color: #344054; font-size: 13px; padding: 14px 12px !important; border-bottom: 1px solid #e5e7eb !important; }
							.dataTable tbody td { padding: 14px 12px !important; border-bottom: 1px solid #eef0f3 !important; font-size: 14px; }
							.dataTable tbody tr:hover { background: #f9fafb; }
						`}</style>

						<DataTable
							data={data}
							options={{ searching: false, paging: false, info: false, ordering: true }}>
							<thead>
								<tr>
									<th>Subject Model</th>
									<th>Accuracy</th>
									<th>Completeness</th>
									<th>Conciseness</th>
									<th>Relevance</th>
								</tr>
							</thead>
						</DataTable>
					</div>
				</div>
			</section>
		</main>
	)
}
