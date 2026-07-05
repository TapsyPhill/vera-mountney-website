import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { VeraAssistant } from '../components/VeraAssistant'
import { useLanguageSync } from '../hooks/useLanguageSync'

export function MainLayout() {
  useLanguageSync()

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <VeraAssistant />
    </div>
  )
}
