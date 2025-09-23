import type { Handler } from '@netlify/functions'
import { createClient } from '@supabase/supabase-js'

const json = (statusCode: number, data: unknown) => ({
	statusCode,
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(data)
})

const getSupabase = () => {
	const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
	if (!url || !key) return null
	return createClient(url, key)
}

export const handler: Handler = async (event) => {
	if (event.httpMethod !== 'POST') {
		return json(405, { error: 'Method Not Allowed' })
	}

	try {
		const body = event.body ? JSON.parse(event.body) : {}
		const { title, amount, currency = 'USD', description = '', thankYouMessage = 'Thank you!', redirectUrl = '' } = body

		if (!title || !amount) {
			return json(400, { error: 'Missing title or amount' })
		}

		const slug = `pay_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
		const linkPath = `/pay/${slug}`
		const createdAt = new Date().toISOString()

		const record = {
			id: slug,
			productName: title,
			description,
			amount: String(amount),
			currency,
			thankYouMessage,
			redirectUrl,
			link: linkPath,
			status: 'active',
			createdAt,
			payments: 0,
			totalAmount: '0'
		}

		const supabase = getSupabase()
		if (supabase) {
			try {
				await supabase.from('payment_links').insert({
					id: record.id,
					title: record.productName,
					amount: record.amount,
					currency: record.currency,
					description: record.description,
					thank_you_message: record.thankYouMessage,
					redirect_url: record.redirectUrl,
					link: record.link,
					status: record.status,
					created_at: record.createdAt
				})
			} catch (e) {
				// Non-fatal in MVP: continue even if table not present
			}
		}

		return json(200, { link: record })
	} catch (err: any) {
		return json(500, { error: 'Internal error', details: err?.message || String(err) })
	}
}


