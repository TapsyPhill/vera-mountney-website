import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { BookPage } from './pages/BookPage'
import { ContactPage } from './pages/ContactPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/book" element={<BookPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
