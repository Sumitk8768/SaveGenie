import { apiRequest } from '../../../shared/api/client.js'

export const login = (credentials) => apiRequest('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
})

export const register = (user) => apiRequest('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify(user),
})
