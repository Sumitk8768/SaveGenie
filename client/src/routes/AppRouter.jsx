import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

// Layouts can remain statically imported as they serve as core frame wrappers,
// or split dynamically if preferred. We'll keep them static for layout stability.
import AuthLayout from '../layouts/AuthLayout.jsx'
import MainLayout from '../layouts/MainLayout.jsx'

// Dynamic Lazy Loading Definitions
const LandingPage = lazy(() => import('../pages/Landing/LandingPage.jsx'))
const LoginPage = lazy(() => import('../pages/Auth/LoginPage.jsx'))
const SignupPage = lazy(() => import('../pages/Auth/SignupPage.jsx'))
const OtpVerificationPage = lazy(() => import('../pages/Auth/OtpVerificationPage.jsx'))

const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage.jsx'))
const CouponVaultPage = lazy(() => import('../pages/Vault/CouponVaultPage.jsx'))
const UploadScreenshotPage = lazy(() => import('../pages/Vault/UploadScreenshotPage.jsx'))
const AnalyticsPage = lazy(() => import('../pages/Analytics/AnalyticsPage.jsx'))
const RemindersPage = lazy(() => import('../pages/Reminders/RemindersPage.jsx'))
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage.jsx'))

// Simple, high-fidelity brand loading shell matching saveGenie style utilities
function LoadingFallback() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0d] flex flex-col items-center justify-center font-ui text-[#e5e2e1]">
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute w-12 h-12 rounded-full bg-[#8083ff]/20 blur-xl animate-pulse" />
        {/* Spinner */}
        <div className="h-8 w-8 rounded-full border-2 border-zinc-800 border-t-[#8083ff] animate-spin" />
      </div>
    </div>
  )
}

function AppRouter() {
  return (
    <BrowserRouter>
      {/* Wrap everything or specific page layers inside Suspense to capture lazy loading transitions */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Root Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Chunks Frame Layer */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/otp" element={<OtpVerificationPage />} />
          </Route>

          {/* Main Core Application Frame Layer */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/coupons" element={<CouponVaultPage />} />
            <Route path="/upload" element={<UploadScreenshotPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<RemindersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Fallback Redirects and Global Error States */}
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
