import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import Designs from './pages/Designs';
import DesignDetails from './pages/DesignDetails';
import Purchases from './pages/Purchases';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import ArchitectLayout from './layouts/ArchitectLayout';
import ArchitectDashboard from './pages/architect/Dashboard';
import UploadDesign from './pages/architect/UploadDesign';
import ArchitectApply from './pages/architect/Apply';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Applications from './pages/admin/Applications';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/designs" element={<Designs />} />
            <Route path="/designs/:id" element={<DesignDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route path="/purchases" element={<Purchases />} />
            </Route>
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Architect Apply Route - Requires Auth */}
          <Route element={<ProtectedRoute />}>
            <Route path="/architect/apply" element={<ArchitectApply />} />
          </Route>

          {/* Architect Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['architect']} />}>
            <Route path="/architect" element={<ArchitectLayout />}>
              <Route path="dashboard" element={<ArchitectDashboard />} />
              <Route path="upload" element={<UploadDesign />} />
              <Route path="designs" element={<ArchitectDashboard />} /> {/* Reusing dashboard for now */}
            </Route>
          </Route>

          {/* Admin Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="applications" element={<Applications />} />
              <Route path="users" element={<AdminDashboard />} /> {/* Reusing dashboard for now */}
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
