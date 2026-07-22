import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/authContext';

import PublicLayout from './layouts/PublicLayout';
import OwnerLayout from './layouts/OwnerLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/common/ScrollToTop';

const Home = lazy(() => import('./pages/public/Home'));
const PropertyList = lazy(() => import('./pages/public/PropertyList'));
const PropertyDetails = lazy(() => import('./pages/public/PropertyDetails'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Login = lazy(() => import('./pages/public/Login'));
const Register = lazy(() => import('./pages/public/Register'));

const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'));
const MyListings = lazy(() => import('./pages/owner/MyListings'));
const CreateListing = lazy(() => import('./pages/owner/CreateListing'));
const EditListing = lazy(() => import('./pages/owner/EditListing'));
const OwnerNotifications = lazy(() => import('./pages/owner/OwnerNotifications'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageListings = lazy(() => import('./pages/admin/ManageListings'));
const ReviewListing = lazy(() => import('./pages/admin/ReviewListing'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'));

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const Loading = () => <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;

const CategorySEOPage = lazy(() => import('./pages/public/CategorySEOPage'));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop />
      <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/categories/:slug" element={<CategorySEOPage />} />
        <Route path="/category/:categorySlug" element={<CategorySEOPage />} />

        {/* High Volume SEO Specific Category Routes */}
        <Route path="/apartments-for-rent" element={<CategorySEOPage defaultCategory="house_apartment" />} />
        <Route path="/independent-villas-for-rent" element={<CategorySEOPage defaultCategory="villa" />} />
        <Route path="/farm-land-plots-for-rent" element={<CategorySEOPage defaultCategory="open_plot_land" />} />
        <Route path="/office-spaces-for-rent" element={<CategorySEOPage defaultCategory="office" />} />
        <Route path="/shops-retail-for-rent" element={<CategorySEOPage defaultCategory="shop_retail" />} />
        <Route path="/warehouses-for-rent" element={<CategorySEOPage defaultCategory="warehouse" />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={['owner']}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="listings" element={<MyListings />} />
        <Route path="listings/create" element={<CreateListing />} />
        <Route path="listings/:id/edit" element={<EditListing />} />
        <Route path="notifications" element={<OwnerNotifications />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="listings" element={<ManageListings />} />
        <Route path="listings/:id/review" element={<ReviewListing />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reviews" element={<ManageReviews />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
