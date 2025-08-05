import { redirect } from 'next/navigation'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { createClient } from '@/lib/supabase/server'
import axios from 'axios'

export default async function ProtectedPage() {
	const supabase = await createClient()

	const { data, error } = await supabase.auth.getClaims()
	if (error || !data?.claims) {
		redirect('/auth/login')
	}

	async function submitForm(formData: FormData) {
		'use server'
		const url = 'http://127.0.0.1:5000/evaluate'
		const numProcesses = formData.get('numProcesses')
		console.log(numProcesses)
		await axios.post(url, {
			withCredentials: true,
			judge_model: formData.get('judgeModel'),
			subject_model: formData.get('subjectModel'),
			num_processes: parseInt(numProcesses as string),
			input: JSON.parse(formData.get('input') as string)
		})
	}

	return (
		<Form action={submitForm}>
			<Form.Control
				name='judgeModel'
				type='text'
				placeholder='Judge Model'
			/>
			<Form.Control
				name='subjectModel'
				type='text'
				placeholder='Subject Model'
			/>
			<Form.Control
				name='numProcesses'
				type='number'
				placeholder='Number of Processes'
				defaultValue={100}
			/>
			<Form.Control
				name='input'
				as='textarea'
				placeholder='input'
			/>
			<Button
				variant='primary'
				type='submit'>
				Submit
			</Button>
		</Form>
	)
}
