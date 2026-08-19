import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import AppTopBar from '../components/layouts/AppTopBar.jsx'
import MobileBottomNav from '../components/layouts/MobileBottomNav.jsx'

function MainLayout() {
  const location = useLocation()
  
  // Identify special route view handling
  const isUpload = location.pathname === '/upload'
  
  // Automatically expand the layout constraint if viewing the full dashboard or coupon vault
const isLargeDashboard = location.pathname === '/dashboard' || location.pathname === '/coupons' || location.pathname === '/analytics' || location.pathname === '/notifications';

  return (
    <div className="starfield page-shell relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0d] font-ui text-[#e5e2e1] antialiased">
      
      {/* Background Ambient AI Orb Glow - Present across the main app shell */}
      <div className="ai-orb top-[10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#8083ff]/10 to-[#4edea3]/5 pointer-events-none" />

      {/* Global Navigation Top-Bar */}
      {!isUpload && <AppTopBar />}

      {/* Main Layout Container Routing Frame */}
      <div 
        className={
          isUpload 
            ? 'relative w-full min-h-screen' 
            : isLargeDashboard
              ? 'relative mx-auto w-full max-w-[1280px] px-4 md:px-8 pb-28 pt-20' // Expands fluidly for desktop dashboards
              : 'relative mx-auto w-full max-w-[540px] px-5 pb-28 pt-20 sm:px-6'   // Preserves elegant constraints for utility views
        }
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Tab Bar Navigation Component */}
      {!isUpload && <MobileBottomNav />}

    </div>
  )
}

export default MainLayout
