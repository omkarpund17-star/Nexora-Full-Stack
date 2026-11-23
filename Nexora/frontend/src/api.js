const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export function getToken() { return localStorage.getItem('nexora_token') }
export function setSession(data) {
  localStorage.setItem('nexora_token', data.token)
  localStorage.setItem('nexora_user', JSON.stringify({
    id: data.id, fullName: data.fullName, email: data.email, role: data.role, title: data.title
  }))
}
export function getUser() {
  try { return JSON.parse(localStorage.getItem('nexora_user') || 'null') } catch { return null }
}
export function clearSession() {
  localStorage.removeItem('nexora_token')
  localStorage.removeItem('nexora_user')
}
export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${BASE}${path}`, { ...options, headers })
  const payload = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401) clearSession()
    throw new Error(payload?.message || `Request failed (${response.status})`)
  }
  return payload
}
