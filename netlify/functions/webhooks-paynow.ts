import type { Handler } from '@netlify/functions'
import { createHash } from 'node:crypto'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

// Paynow IPN stub (EcoCash via Paynow)
export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })
	try {
		const body = event.body || ''
		// TODO: verify hash using integration key
		// const hash = createHash('sha512').update(body + INTEGRATION_KEY).digest('hex')
		return json(200, { received: true })
	} catch (err: any) {
		return json(400, { error: 'Bad Request', details: err?.message || String(err) })
	}
}


