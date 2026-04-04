import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminAuthProvider } from './context/admin-auth-provider.jsx'
import { VenueStoreProvider } from './context/venue-store-provider.jsx'
import { BookingProvider } from './context/booking-provider.jsx'
import { AppLayout } from './components/app-layout.jsx'
import { LandingPage } from './pages/landing-page.jsx'
import { RestaurantListingPage } from './pages/restaurant-listing-page.jsx'
import { RestaurantDetailPage } from './pages/restaurant-detail-page.jsx'
import { BookingFlowPage } from './pages/booking-flow-page.jsx'
import { ConfirmationPage } from './pages/confirmation-page.jsx'
import { PaymentPage } from './pages/payment-page.jsx'
import { PlaceholderPage } from './pages/placeholder-page.jsx'
import { AdminLoginPage } from './pages/admin-login-page.jsx'
import { AdminRegisterPage } from './pages/admin-register-page.jsx'
import { AdminDashboardPage } from './pages/admin-dashboard-page.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <VenueStoreProvider>
          <BookingProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/restaurants" element={<RestaurantListingPage />} />
                <Route path="/restaurants/:restaurantId" element={<RestaurantDetailPage />} />
                <Route path="/book/:restaurantId" element={<BookingFlowPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route
                  path="/my-reservations"
                  element={
                    <PlaceholderPage
                      title="My reservations"
                      description="Signed-in guests would see upcoming and past reservations here. This demo does not persist bookings."
                    />
                  }
                />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/register" element={<AdminRegisterPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BookingProvider>
        </VenueStoreProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  )
}
