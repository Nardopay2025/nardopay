import { env } from '@/config/env'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const DEFAULT_BASE = typeof window !== 'undefined' ? window.location.origin : ''
const BASE_URL = env.API_BASE_URL || DEFAULT_BASE

interface RequestOptions {
	method?: HttpMethod
	body?: unknown
	headers?: Record<string, string>
	signal?: AbortSignal
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const url = `${BASE_URL}${path}`
	const res = await fetch(url, {
		method: options.method ?? 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {})
		},
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
		signal: options.signal
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw new Error(`API ${res.status}: ${text}`)
	}

	const contentType = res.headers.get('content-type') || ''
	if (contentType.includes('application/json')) {
		return (await res.json()) as T
	}
	return (await res.text()) as unknown as T
}

export const apiClient = {
	get: <T>(path: string, headers?: Record<string, string>) =>
		apiRequest<T>(path, { method: 'GET', headers }),
	post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(path, { method: 'POST', body, headers }),
	put: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(path, { method: 'PUT', body, headers }),
	patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
		apiRequest<T>(path, { method: 'PATCH', body, headers }),
	delete: <T>(path: string, headers?: Record<string, string>) =>
		apiRequest<T>(path, { method: 'DELETE', headers })
}


