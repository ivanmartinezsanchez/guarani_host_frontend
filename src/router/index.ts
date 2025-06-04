/**
 * Router configuration for GuaraníHost application
 * Handles routing for public, authenticated, admin, and host views
 * with role-based access control and navigation guards
 */
import { createRouter, createWebHistory } from 'vue-router'

/**
 * Public views - accessible without authentication
 */
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ContactView from '@/views/ContactView.vue'
import HelpCenterView from '@/views/HelpCenterView.vue'
import TermsView from '@/views/TermsView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import PropertyDetailView from '@/views/PropertyDetailView.vue'
import TourDetailView from '@/views/TourDetailView.vue'

/**
 * Admin views - require admin role
 */
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import AdminUserManagementView from '@/views/AdminUserManagementView.vue'
import AdminPropertyManagementView from '@/views/AdminPropertyManagementView.vue'
import AdminBookingManagementView from '@/views/AdminBookingManagementView.vue'
import AdminTourManagementView from '@/views/AdminTourManagementView.vue'

/**
 * Host views - require host role
 */
import HostDashboardView from '@/views/HostDashboardView.vue'
import HostPropertyManagementView from '@/views/HostPropertyManagementView.vue'
import HostTourManagementView from '@/views/HostTourManagementView.vue'
import HostBookingView from '@/views/HostBookingView.vue'

/**
 * Lazy-loaded components for better performance
 */
const EditProfileView = () => import('@/views/EditProfileView.vue')
const ChangePasswordView = () => import('@/views/ChangePasswordView.vue')
const SearchView = () => import('@/views/SearchView.vue') // ✅ NEW: Search results page

/**
 * Route definitions with meta properties for access control
 * Meta properties:
 * - public: true = accessible without authentication
 * - requiresAuth: true = requires valid JWT token
 * - role: 'admin'|'host'|'user' = requires specific user role
 * - authRoute: true = login/register routes (redirect if authenticated)
 * - showFooter: true = display footer component
 */
const routes = [
  // ==================== PUBLIC ROUTES ====================
  // Main landing page with hero section and featured properties/tours
  { 
    path: '/', 
    name: 'home', 
    component: HomeView, 
    meta: { public: true, showFooter: true } 
  },
  
  // About page with company information
  { 
    path: '/about', 
    name: 'about', 
    component: AboutView, 
    meta: { public: true, showFooter: true } 
  },

  // ✅ NEW: Search results page for property/tour searches
  // Accessible to all users (public), displays filtered results based on query parameters
  // Example: /search?checkIn=2025-06-06&checkOut=2025-06-07&guests=2
  { 
    path: '/search', 
    name: 'search', 
    component: SearchView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Property detail page - shows single property information, photos, amenities, reviews
  { 
    path: '/property/:id', 
    name: 'property-detail', 
    component: PropertyDetailView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Tour detail page - shows single tour information, itinerary, pricing, host details
  { 
    path: '/tour/:id', 
    name: 'tour-detail', 
    component: TourDetailView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Contact page with company contact information and contact form
  { 
    path: '/contact', 
    name: 'contact', 
    component: ContactView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Help center with FAQs and support information
  { 
    path: '/help', 
    name: 'help-center', 
    component: HelpCenterView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Terms of service page
  { 
    path: '/terms', 
    name: 'terms', 
    component: TermsView, 
    meta: { public: true, showFooter: true } 
  },
  
  // Privacy policy page
  { 
    path: '/privacy', 
    name: 'privacy-policy', 
    component: PrivacyPolicyView, 
    meta: { public: true, showFooter: true } 
  },

  // ==================== AUTHENTICATION ROUTES ====================
  // Login page - redirect to dashboard if already authenticated
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView, 
    meta: { public: true, authRoute: true, showFooter: true } 
  },
  
  // Registration page - redirect to dashboard if already authenticated
  { 
    path: '/register', 
    name: 'register', 
    component: RegisterView, 
    meta: { public: true, authRoute: true, showFooter: true } 
  },

  // ==================== AUTHENTICATED USER ROUTES ====================
  // User profile page - displays user information (any authenticated user)
  { 
    path: '/profile', 
    name: 'profile', 
    component: UserProfileView, 
    meta: { requiresAuth: true, showFooter: true } 
  },
  
  // Edit profile page - allows users to update their profile information
  { 
    path: '/profile/edit', 
    name: 'edit-profile', 
    component: EditProfileView, 
    meta: { requiresAuth: true, showFooter: true } 
  },
  
  // Change password page - allows users to update their password
  { 
    path: '/profile/change-password', 
    name: 'change-password', 
    component: ChangePasswordView, 
    meta: { requiresAuth: true, showFooter: true } 
  },
  
  // ==================== USER-SPECIFIC ROUTES ====================
  // User dashboard - overview of user's activity, bookings, and account status
  { 
    path: '/user/dashboard', 
    name: 'user-dashboard', 
    component: () => import('@/views/UserDashboardView.vue'), 
    meta: { requiresAuth: true, role: 'user' } 
  },
  
  // User bookings page - manages user's property and tour reservations
  { 
    path: '/user/bookings', 
    name: 'user-bookings', 
    component: () => import('@/views/UserBookingView.vue'), 
    meta: { requiresAuth: true, role: 'user' } 
  },
  
  // Spanish language alias for user bookings (SEO and user convenience)
  { 
    path: '/user/reservas', 
    name: 'user-reservas', 
    redirect: { name: 'user-bookings' }
  },
  
  // Alternative Spanish alias for user bookings
  { 
    path: '/mis-reservas', 
    name: 'mis-reservas', 
    redirect: { name: 'user-bookings' }
  },

  // ==================== ADMIN ROUTES ====================
  // Admin dashboard - overview of system metrics, users, properties, bookings
  { 
    path: '/admin/dashboard', 
    name: 'admin-dashboard', 
    component: AdminDashboardView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  
  // Admin user management - CRUD operations for all users (hosts and regular users)
  { 
    path: '/admin/users', 
    name: 'admin-users', 
    component: AdminUserManagementView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  
  // Admin property management - oversee all properties in the system
  { 
    path: '/admin/properties', 
    name: 'admin-properties', 
    component: AdminPropertyManagementView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  
  // Admin booking management - view and manage all bookings across the platform
  { 
    path: '/admin/bookings', 
    name: 'admin-bookings', 
    component: AdminBookingManagementView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },
  
  // Admin tour management - oversee all tours and experiences
  { 
    path: '/admin/tours', 
    name: 'admin-tours', 
    component: AdminTourManagementView, 
    meta: { requiresAuth: true, role: 'admin' } 
  },

  // ==================== HOST ROUTES ====================
  // Host dashboard - overview of host's properties, tours, bookings, and earnings
  { 
    path: '/host/dashboard', 
    name: 'host-dashboard', 
    component: HostDashboardView, 
    meta: { requiresAuth: true, role: 'host' } 
  },
  
  // Host property management - CRUD operations for host's own properties
  { 
    path: '/host/properties', 
    name: 'host-properties', 
    component: HostPropertyManagementView, 
    meta: { requiresAuth: true, role: 'host' } 
  },
  
  // Host tour management - CRUD operations for host's own tours and experiences
  { 
    path: '/host/tours', 
    name: 'host-tours', 
    component: HostTourManagementView, 
    meta: { requiresAuth: true, role: 'host' } 
  },
  
  // Host booking management - view and manage bookings for host's properties/tours
  { 
    path: '/host/bookings', 
    name: 'host-bookings', 
    component: HostBookingView, 
    meta: { requiresAuth: true, role: 'host' } 
  },

  // ==================== ERROR HANDLING ====================
  // Catch-all route for 404 pages - must be last in the routes array
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, showFooter: true }
  }
]

/**
 * Create router instance with HTML5 history mode
 * Uses createWebHistory for clean URLs without hash (#)
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Global navigation guard for authentication and authorization
 * Executes before every route navigation to enforce security rules
 * 
 * Handles:
 * - Public route access (no authentication required)
 * - Authentication requirements (valid JWT token needed)
 * - Role-based access control (admin/host/user permissions)
 * - Redirect logic for authenticated users accessing auth pages
 * - Authorization failures and appropriate redirects
 */
router.beforeEach((to, from, next) => {
  // Get authentication data from localStorage
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  // Extract route meta properties for access control decisions
  const isPublic = to.meta.public === true
  const requiresAuth = to.meta.requiresAuth === true
  const isAuthRoute = to.meta.authRoute === true

  console.log(`🧭 Navigating to: ${String(to.name)}`, {
    isPublic,
    requiresAuth,
    isAuthRoute,
    hasToken: !!token,
    userRole: user?.role,
    routePath: to.path
  })

  // Allow access to public routes that don't require authentication
  // Examples: home page, search results, property details, about page
  if (isPublic && !requiresAuth && !isAuthRoute) {
    console.log('✅ Public route - access granted')
    return next()
  }

  // Redirect unauthenticated users from protected routes to login
  // Applies to dashboard pages, profile pages, and role-specific areas
  if (requiresAuth && (!token || !user)) {
    console.warn('🔒 Authentication required. Redirecting to login.')
    return next({ name: 'login' })
  }

  // Check role-based access control
  // Ensures users can only access areas appropriate to their role
  if (to.meta.role && user?.role !== to.meta.role) {
    console.warn(`🚫 Access denied: required role "${to.meta.role}", current role "${user?.role}"`)
    
    // Redirect to appropriate dashboard based on user's actual role
    if (user?.role === 'admin') {
      return next({ name: 'admin-dashboard' })
    } else if (user?.role === 'host') {
      return next({ name: 'host-dashboard' })
    } else if (user?.role === 'user') {
      return next({ name: 'user-dashboard' })
    } else {
      return next({ name: 'home' })
    }
  }

  // Prevent authenticated users from accessing login/register pages
  // Redirects them to their appropriate dashboard instead
  if (isAuthRoute && token && user) {
    console.info('🔁 User already authenticated. Redirecting to dashboard.')
    
    // Redirect to role-specific dashboard
    if (user.role === 'admin') {
      return next({ name: 'admin-dashboard' })
    } else if (user.role === 'host') {
      return next({ name: 'host-dashboard' })
    } else if (user.role === 'user') {
      return next({ name: 'user-dashboard' })
    } else {
      return next({ name: 'profile' })
    }
  }

  // Allow authenticated users to access protected routes they have permission for
  if (requiresAuth && token && user) {
    console.log('✅ Authenticated route - access granted')
    return next()
  }

  // Allow non-authenticated users to access auth routes (login/register)
  if (isAuthRoute && !token) {
    console.log('✅ Auth route for non-authenticated user - access granted')
    return next()
  }

  // Default fallback: allow navigation
  // This should rarely be reached due to the comprehensive checks above
  console.log('✅ Default route access - granted')
  next()
})

export default router