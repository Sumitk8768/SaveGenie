import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

const LandingPage = lazy(() => import('../../pages/landing/LandingPage.jsx'))
const LoginPage = lazy(() => import('../../pages/login/LoginPage.jsx'))
const SignupPage = lazy(() => import('../../pages/signup/SignupPage.jsx'))
const OtpVerificationPage = lazy(() => import('../../pages/otp-verification/OtpVerificationPage.jsx'))
const DashboardPage = lazy(() => import('../../pages/dashboard/DashboardPage.jsx'))
const CouponVaultPage = lazy(() => import('../../pages/coupon-vault/CouponVaultPage.jsx'))
const UploadScreenshotPage = lazy(() => import('../../pages/upload-screenshot/UploadScreenshotPage.jsx'))
const AnalyticsPage = lazy(() => import('../../pages/analytics/AnalyticsPage.jsx'))
const RemindersPage = lazy(() => import('../../pages/reminders/RemindersPage.jsx'))
const ProfilePage = lazy(() => import('../../pages/profile/ProfilePage.jsx'))
const NotFoundPage = lazy(() => import('../../pages/not-found/NotFoundPage.jsx'))

function LoadingFallback() {
  return <div className="min-h-screen w-full bg-[#0a0a0d] flex items-center justify-center text-[#e5e2e1]">Loading…</div>
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/otp" element={<OtpVerificationPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/coupons" element={<CouponVaultPage />} />
              <Route path="/upload" element={<UploadScreenshotPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<RemindersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
