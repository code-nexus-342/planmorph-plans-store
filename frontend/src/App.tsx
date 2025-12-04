import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Designs from './pages/Designs';
import DesignDetails from './pages/DesignDetails';
import CustomDesign from './pages/CustomDesign';
import Purchases from './pages/Purchases';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Careers from './pages/Careers';
import VerifyEmail from './pages/VerifyEmail';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
import ProfessionalLayout from './layouts/ProfessionalLayout';
import ProfessionalLogin from './pages/professional/Login';
import ProfessionalLanding from './pages/professional/Landing';
import ProfessionalDashboard from './pages/professional/Dashboard';
import ProfessionalUpload from './pages/professional/UploadDesign';
import ProfessionalResources from './pages/professional/Resources';
import ProfessionalCommunity from './pages/professional/Community';
import Apply from './pages/professional/Apply';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProfessionalForgotPassword from './pages/professional/ForgotPassword';
import ProfessionalResetPassword from './pages/professional/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApplications from './pages/admin/Applications';
import AdminProfessionals from './pages/admin/Professionals';
import AdminDesigns from './pages/admin/Designs';
import ProfessionalTermsOfService from './pages/professional/TermsOfService';
import ProfessionalPrivacyPolicy from './pages/professional/PrivacyPolicy';

function AppRoutes() {
  return (
    <Routes>
      {/* Client Routes (Main Layout) */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="designs" element={<Designs />} />
        <Route path="designs/:id" element={<DesignDetails />} />
        <Route path="custom-design" element={<CustomDesign />} />
        <Route path="contact" element={<Contact />} />
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="careers" element={<Careers />} />
        <Route path="*" element={<NotFound />} />
        
        {/* Protected Client Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="purchases" element={<Purchases />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="terms" element={<TermsOfService />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      {/* Professional Routes (Professional Layout) */}
      <Route path="/professional" element={<ProfessionalLayout />}>
        <Route index element={<ProfessionalLanding />} />
        <Route path="apply" element={<Apply />} />
        <Route path="login" element={<ProfessionalLogin />} />
        <Route path="forgot-password" element={<ProfessionalForgotPassword />} />
        <Route path="reset-password" element={<ProfessionalResetPassword />} />
        <Route path="resources" element={<ProfessionalResources />} />
        <Route path="community" element={<ProfessionalCommunity />} />
        <Route path="terms" element={<ProfessionalTermsOfService />} />
        <Route path="privacy" element={<ProfessionalPrivacyPolicy />} />
        {/* Protected Professional Routes */}
        <Route element={<ProtectedRoute redirectPath="/professional/login" />}>
          <Route path="dashboard" element={<ProfessionalDashboard />} />
          <Route path="upload" element={<ProfessionalUpload />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminLayout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="professionals" element={<AdminProfessionals />} />
              <Route path="designs" element={<AdminDesigns />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </AdminLayout>
        </ProtectedRoute>
      } />

      {/* Auth Routes (Shared/Client Login) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

