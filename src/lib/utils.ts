import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get the base URL dynamically for different environments
export function getBaseUrl(): string {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8080'
  }
  
  // In production, use the current domain
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback for SSR
  return process.env.NODE_ENV === 'production' 
    ? 'https://nardopay.com' // Replace with your actual domain
    : 'http://localhost:8080'
}
