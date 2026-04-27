import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Doctors from './pages/Doctors'
import Awards from './pages/Awards'
import FAQ from './pages/FAQ'
import Infrastructure from './pages/hospital/Infrastructure'
import PhotoGalleryHospital from './pages/hospital/PhotoGalleryHospital'
import Facilities from './pages/hospital/Facilities'
import Testimonials from './pages/Testimonials'
import PressRelease from './pages/PressRelease'
import PhotoGallery from './pages/PhotoGallery'
import VideoGallery from './pages/VideoGallery'
import BookAppointment from './pages/BookAppointment'
import Enquiry from './pages/Enquiry'
import Contact from './pages/Contact'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/hospital/infrastructure" element={<Infrastructure />} />
          <Route path="/hospital/gallery" element={<PhotoGalleryHospital />} />
          <Route path="/hospital/facilities" element={<Facilities />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/press" element={<PressRelease />} />
          <Route path="/gallery" element={<PhotoGallery />} />
          <Route path="/videos" element={<VideoGallery />} />
          <Route path="/appointment" element={<BookAppointment />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
