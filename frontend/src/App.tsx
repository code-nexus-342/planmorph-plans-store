import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfessionalRoleProvider, useProfessionalRoles } from './context/ProfessionalRoleContext';
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
import ProfessionalLayout from './layouts/ProfessionalLayout';
import ProfessionalDashboard from './pages/professional/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
  const { roles, loading } = useProfessionalRoles();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/designs" element={<Designs />} />
        <Route path="/designs/:id" element={<DesignDetails />} />
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/custom-design" element={<CustomDesign />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>

      {/* Dynamic Professional Routes */}
      {Object.values(roles).map((role) => (
        <Route 
          key={role.roleType} 
          element={<ProtectedRoute allowedRoles={[role.roleType, 'admin']} />}
        >
          <Route path={role.basePath} element={<ProfessionalLayout />}>
            <Route path="dashboard" element={<ProfessionalDashboard />} />
            {/* Add more dynamic sub-routes here if needed based on role.navItems */}
          </Route>
        </Route>
      ))}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProfessionalRoleProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ProfessionalRoleProvider>
    </AuthProvider>
  );
}

export default App;

