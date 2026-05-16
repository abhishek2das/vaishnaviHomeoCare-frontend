import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// User Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// User Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Awards from './pages/Awards';
import FAQ from './pages/FAQ';
import Infrastructure from './pages/hospital/Infrastructure';
import PhotoGalleryHospital from './pages/hospital/PhotoGalleryHospital';
import Facilities from './pages/hospital/Facilities';
import Testimonials from './pages/Testimonials';
import PressRelease from './pages/PressRelease';
import PhotoGallery from './pages/PhotoGallery';
import VideoGallery from './pages/VideoGallery';
import BookAppointment from './pages/BookAppointment';
import Enquiry from './pages/Enquiry';
import Contact from './pages/Contact';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminPatients from './pages/admin/AdminPatients';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPressReleases from './pages/admin/AdminPressReleases';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAwards from './pages/admin/AdminAwards';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContacts from './pages/admin/AdminContacts';
import AdminCMS from './pages/admin/AdminCMS';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/services', element: <Services /> },
      { path: '/doctors', element: <Doctors /> },
      { path: '/awards', element: <Awards /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/hospital/infrastructure', element: <Infrastructure /> },
      { path: '/hospital/gallery', element: <PhotoGalleryHospital /> },
      { path: '/hospital/facilities', element: <Facilities /> },
      { path: '/testimonials', element: <Testimonials /> },
      { path: '/press', element: <PressRelease /> },
      { path: '/gallery', element: <PhotoGallery /> },
      { path: '/videos', element: <VideoGallery /> },
      { path: '/appointment', element: <BookAppointment /> },
      { path: '/enquiry', element: <Enquiry /> },
      { path: '/contact', element: <Contact /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/appointments', element: <AdminAppointments /> },
      { path: '/admin/patients', element: <AdminPatients /> },
      { path: '/admin/testimonials', element: <AdminTestimonials /> },
      { path: '/admin/press', element: <AdminPressReleases /> },
      { path: '/admin/gallery', element: <AdminGallery /> },
      { path: '/admin/awards', element: <AdminAwards /> },
      { path: '/admin/faq', element: <AdminFAQ /> },
      { path: '/admin/contacts', element: <AdminContacts /> },
      { path: '/admin/cms', element: <Navigate to="/admin/cms/about" replace /> },
      { path: '/admin/cms/about', element: <AdminCMS /> },
      { path: '/admin/cms/services', element: <AdminCMS /> },
      { path: '/admin/settings', element: <AdminSettings /> },
    ],
  },
]);

export default router;
