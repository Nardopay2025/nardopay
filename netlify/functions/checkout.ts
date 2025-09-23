import type { Handler } from '@netlify/functions'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

async function initiatePaystack(body: any) {
	const secret = process.env.PAYSTACK_SECRET_KEY
	if (!secret) return json(500, { error: 'Missing PAYSTACK_SECRET_KEY' })

	const { amount, currency, email, linkId, metadata } = body
	if (currency !== 'NGN') return json(400, { error: 'Paystack requires NGN currency for card init' })

	const naira = Number(amount)
	if (!Number.isFinite(naira) || naira <= 0) return json(400, { error: 'Invalid amount' })
	const kobo = Math.round(naira * 100)

	const res = await fetch('https://api.paystack.co/transaction/initialize', {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${secret}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email || 'customer@example.com',
			amount: kobo,
			currency: 'NGN',
			metadata: { linkId, ...(metadata || {}) }
		})
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		return json(res.status, { error: 'Paystack init failed', details: text })
	}
	const data = await res.json()
	return json(200, { provider: 'paystack', data })
}

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })
	try {
		const body = event.body ? JSON.parse(event.body) : {}
		const { linkId, amount, currency, rail } = body
		if (!linkId || amount === undefined || !currency || !rail) return json(400, { error: 'Missing fields' })

		if (rail === 'paystack') {
			return await initiatePaystack({ ...body })
		}

		// TODO: implement mpesa, paynow, mtnmomo
		return json(501, { error: 'Selected rail not implemented yet', rail })
	} catch (err: any) {
		return json(500, { error: 'Internal error', details: err?.message || String(err) })
	}
}


