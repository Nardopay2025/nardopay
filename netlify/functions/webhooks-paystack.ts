import type { Handler } from '@netlify/functions'
import { createHmac } from 'node:crypto'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' })
    const secret = process.env.PAYSTACK_SECRET_KEY || ''
    const signature = event.headers['x-paystack-signature'] || event.headers['X-Paystack-Signature']
    const computed = createHmac('sha512', secret).update(event.body || '').digest('hex')
	if (!secret || !signature || signature !== computed) {
		return json(401, { error: 'Invalid signature' })
	}
	// TODO: normalize event and persist
	return json(200, { received: true })
}


