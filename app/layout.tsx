import type { Metadata } from 'next'
import { Source_Sans_3 } from 'next/font/google'
import './bootstrap.css'
import './globals.css'
const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/leaderboard` : 'http://localhost:3000/leaderboard'

export const metadata: Metadata = {
	metadataBase: new URL(defaultUrl),
	title: 'AIAgribench',
	description: 'Vikram if you see this tell me what it should be'
}

const sourceSans = Source_Sans_3({
	variable: '--font-source-sans',
	display: 'swap',
	subsets: ['latin']
})

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body
				className={`${sourceSans.className} antialiased h-100`}
				style={{ backgroundColor: '#D3CDC6' }}>
				{children}
			</body>
		</html>
	)
}
