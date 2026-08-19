import { motion, AnimatePresence } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

function AuthLayout() {
  const location = useLocation()

  return (
    <div className="page-shell min-h-svh bg-[#0a0a0d]">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default AuthLayout