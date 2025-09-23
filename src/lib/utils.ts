import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from '@/config/env'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL dynamically for different environments
export function getBaseUrl(): string {
  // Prefer explicit API base URL
  if (env.API_BASE_URL) return env.API_BASE_URL

  // In browser, default to origin
  if (typeof window !== 'undefined') return window.location.origin

  // Fallbacks
  if (import.meta.env.DEV) return 'http://localhost:8080'
  return process.env.NODE_ENV === 'production' ? 'https://nardopay.com' : 'http://localhost:8080'
}
