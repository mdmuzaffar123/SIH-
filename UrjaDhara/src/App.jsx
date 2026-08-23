import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import GEEInsights from './pages/GEEInsights';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import './App.css';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gee-insights" element={<GEEInsights />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <ChatBot />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminProvider>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </AdminProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
