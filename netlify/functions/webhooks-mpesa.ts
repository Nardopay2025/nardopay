import type { Handler } from '@netlify/functions'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

// Safaricom Daraja STK callback stub
export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })
	try {
		// Parse callback body
		const payload = event.body ? JSON.parse(event.body) : {}
		// TODO: validate origin (IP allowlist) and process ResultCode/ResultDesc
		return json(200, { received: true })
	} catch (err: any) {
		return json(400, { error: 'Bad Request', details: err?.message || String(err) })
	}
}


