import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { Chatbot } from '../components/Chatbot'
import { useLanguageSync } from '../hooks/useLanguageSync'

export function MainLayout() {
  useLanguageSync()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  )
}
