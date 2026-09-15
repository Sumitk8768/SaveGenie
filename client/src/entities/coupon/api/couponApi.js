import { apiRequest } from '../../../shared/api/client.js'

export const getCoupons = () => apiRequest('/api/coupons')
export const createCoupon = (coupon) => apiRequest('/api/coupons', { method: 'POST', body: JSON.stringify(coupon) })
export const updateCoupon = (id, coupon) => apiRequest(`/api/coupons/${id}`, { method: 'PUT', body: JSON.stringify(coupon) })
export const deleteCoupon = (id) => apiRequest(`/api/coupons/${id}`, { method: 'DELETE' })
