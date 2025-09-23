import type { Handler } from '@netlify/functions'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })
	try {
		const body = event.body ? JSON.parse(event.body) : {}
		const { linkId, amount, currency, rail, country } = body
		if (!linkId || !amount || !currency) return json(400, { error: 'Missing fields' })
		// Placeholder initiation response
		return json(200, {
			status: 'initiated',
			rail,
			country,
			nextAction: { type: 'redirect_or_collect', instructions: 'Provider initiation not yet implemented' }
		})
	} catch (err: any) {
		return json(500, { error: 'Internal error', details: err?.message || String(err) })
	}
}


