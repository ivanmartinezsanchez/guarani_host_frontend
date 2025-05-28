import { createRouter, createWebHistory } from 'vue-router'

// ========================
// Public views
// ========================
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import PropertyDetailView from '@/views/PropertyDetailView.vue'
import TourDetailView from '@/views/TourDetailView.vue'

// ========================
// Admin views
// ========================
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import AdminUserManagementView from '@/views/AdminUserManagementView.vue'
import PropertyManagementView from '@/views/PropertyManagementView.vue'
import BookingManagementView from '@/views/BookingManagementView.vue'
import TourManagementView from '@/views/TourManagementView.vue'

// ========================
// Host views
// ========================
import HostDashboardView from '@/views/HostDashboardView.vue'
import HostPropertyManagementView from '@/views/HostPropertyManagementView.vue'
import HostTourManagementView from '@/views/HostTourManagementView.vue'
import HostBookingView from '@/views/HostBookingView.vue'

// Lazy-loaded view
const EditProfileView = () => import('@/views/EditProfileView.vue')

// ========================
// Route definitions
// ========================
const routes = [
  // Public access
  { path: '/', name: 'home', component: HomeView, meta: { showFooter: true } },
  { path: '/about', name: 'about', component: AboutView, meta: { showFooter: true } },
  { path: '/login', name: 'login', component: LoginView, meta: { public: true, showFooter: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { public: true, showFooter: true } },
  { path: '/property/:id', name: 'property-detail', component: PropertyDetailView, meta: { showFooter: true } },
  { path: '/tour/:id', name: 'tour-detail', component: TourDetailView, meta: { showFooter: true } },

  // Authenticated user profile and dashboard
  { path: '/profile', name: 'profile', component: UserProfileView, meta: { requiresAuth: true, showFooter: true } },
  { path: '/profile/edit', name: 'edit-profile', component: EditProfileView, meta: { requiresAuth: true, showFooter: true } },
  { path: '/user/dashboard', name: 'user-dashboard', component: () => import('@/views/UserDashboardView.vue'), meta: { requiresAuth: true, role: 'user' } },

  // Admin-only routes
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/users', name: 'admin-users', component: AdminUserManagementView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/properties', name: 'admin-properties', component: PropertyManagementView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/bookings', name: 'admin-bookings', component: BookingManagementView, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/tours', name: 'admin-tours', component: TourManagementView, meta: { requiresAuth: true, role: 'admin' } },

  // Host-only routes
  { path: '/host/dashboard', name: 'host-dashboard', component: HostDashboardView, meta: { requiresAuth: true, role: 'host' } },
  { path: '/host/properties', name: 'host-properties', component: HostPropertyManagementView, meta: { requiresAuth: true, role: 'host' } },
  { path: '/host/tours', name: 'host-tours', component: HostTourManagementView, meta: { requiresAuth: true, role: 'host' } },
  { path: '/host/bookings', name: 'host-bookings', component: HostBookingView, meta: { requiresAuth: true, role: 'host' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ========================
// Global Navigation Guard
// ========================
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const isPublic = to.meta.public === true
  const requiresAuth = to.meta.requiresAuth === true

  // Check authentication
  if (requiresAuth && (!token || !user)) {
    console.warn('🔒 Auth required. Redirecting to login.')
    return next({ name: 'login' })
  }

  // Check role-based access
  if (to.meta.role && user?.role !== to.meta.role) {
    console.warn(`🚫 Access denied: required role "${to.meta.role}", current role "${user?.role}"`)
    return next({ name: 'home' })
  }

  // Redirect logged-in users away from login/register
  if (isPublic && token && user && (to.name === 'login' || to.name === 'register')) {
    console.info('🔁 Already authenticated. Redirecting to dashboard.')
    if (user.role === 'admin') return next({ name: 'admin-dashboard' })
    if (user.role === 'host') return next({ name: 'host-dashboard' })
    return next({ name: 'profile' })
  }

  // Proceed to route
  next()
})

export default router
