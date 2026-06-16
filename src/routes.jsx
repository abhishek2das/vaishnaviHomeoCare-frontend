import { createBrowserRouter, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// User Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// User Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Awards from './pages/Awards';
import FAQ from './pages/FAQ';
import Infrastructure from './pages/hospital/Infrastructure';
import Testimonials from './pages/Testimonials';
import PressRelease from './pages/PressRelease';
import PressReleaseDetail from './pages/PressReleaseDetail';
import PhotoGallery from './pages/PhotoGallery';
import VideoGallery from './pages/VideoGallery';
import BookAppointment from './pages/BookAppointment';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminPatients from './pages/admin/AdminPatients';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminPressReleases from './pages/admin/AdminPressReleases';
import AdminGallery from './pages/admin/AdminGallery';
import AdminPatientFeedback from './pages/admin/AdminPatientFeedback';
import AdminAwards from './pages/admin/AdminAwards';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminSettings from './pages/admin/AdminSettings';
import AdminContacts from './pages/admin/AdminContacts';
import AdminCMS from './pages/admin/AdminCMS';
import AdminLogin from './pages/admin/AdminLogin';
import PatientFeedback from './pages/PatientFeedback';

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

function AdminGuard({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/services', element: <Services /> },
      
      { path: '/awards', element: <Navigate to="/" replace /> },
      { path: '/faq', element: <FAQ /> },
      { path: '/hospital/infrastructure', element: <Infrastructure /> },
      
      { path: '/testimonials', element: <Testimonials /> },
      { path: '/blog', element: <PressRelease /> },
      { path: '/blog/:slug', element: <PressReleaseDetail /> },
      { path: '/gallery', element: <PhotoGallery /> },
      { path: '/videos', element: <VideoGallery /> },
      { path: '/patient-feedback', element: <PatientFeedback /> },
      { path: '/appointment', element: <BookAppointment /> },
      { path: '/contact', element: <Contact /> },
      { path: '/privacy-policy', element: <PrivacyPolicy /> },
      { path: '/terms-of-service', element: <TermsOfService /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: '/admin', element: <AdminDashboard /> },
      { path: '/admin/appointments', element: <AdminAppointments /> },
      { path: '/admin/patients', element: <AdminPatients /> },
      { path: '/admin/testimonials', element: <AdminTestimonials /> },
      { path: '/admin/press', element: <AdminPressReleases /> },
      { path: '/admin/gallery', element: <AdminGallery /> },
      { path: '/admin/patient-feedback', element: <AdminPatientFeedback /> },
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
