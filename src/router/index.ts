import { createRouter, createWebHistory } from 'vue-router'

// Public routes - These are accessible to everyone
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PropertyDetailView from '@/views/PropertyDetailView.vue'
import TourDetailView from '@/views/TourDetailView.vue'

// Admin routes - These are only accessible to admins
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import HomeManagementView from '@/views/HomeManagementView.vue'
import BookingManagementView from '@/views/BookingManagementView.vue'
import TourManagementView from '@/views/TourManagementView.vue'

// Host routes - These are only accessible to hosts
import HostDashboardView from '@/views/HostDashboardView.vue'
import HostHomeManagementView from '@/views/HostHomeManagementView.vue'
import HostTourManagementView from '@/views/HostTourManagementView.vue'
import HostBookingView from '@/views/HostBookingView.vue'

// Define routes for the application
const routes = [
  // Public routes (footer visible)
  { path: '/', name: 'home', component: HomeView, meta: { showFooter: true } },  
  { path: '/about', name: 'about', component: AboutView, meta: { showFooter: true } }, 
  { path: '/login', name: 'login', component: LoginView, meta: { showFooter: true } }, 
  { path: '/profile', name: 'profile', component: ProfileView, meta: { showFooter: true } }, 
  { path: '/home/:id', name: 'property-detail', component: PropertyDetailView, meta: { showFooter: true } },   
  { path: '/tour/:id', name: 'tour-detail', component: TourDetailView, meta: { showFooter: true } },

  // Admin routes (accessible only by admins)
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { role: 'admin', showFooter: false } },  
  { path: '/admin/users', name: 'admin-users', component: UserManagementView, meta: { role: 'admin', showFooter: false } },
  { path: '/admin/homes', name: 'admin-homes', component: HomeManagementView, meta: { role: 'admin', showFooter: false } },
  { path: '/admin/bookings', name: 'admin-bookings', component: BookingManagementView, meta: { role: 'admin', showFooter: false } },
  { path: '/admin/tours', name: 'admin-tours', component: TourManagementView, meta: { role: 'admin', showFooter: false } },

  // Host routes (accessible only by hosts)
  { path: '/host/dashboard', name: 'host-dashboard', component: HostDashboardView, meta: { role: 'host', showFooter: false } },  
  { path: '/host/homes', name: 'host-homes', component: HostHomeManagementView, meta: { role: 'host', showFooter: false } }, 
  { path: '/host/tours', name: 'host-tours', component: HostTourManagementView, meta: { role: 'host', showFooter: false } }, 
  { path: '/host/bookings', name: 'host-bookings', component: HostBookingView, meta: { role: 'host', showFooter: false } },
]

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard to handle role-based access
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')  // Retrieve user info from localStorage
  const token = localStorage.getItem('token')  // Retrieve the token from localStorage

  // Check if the route requires a specific role
  if (to.meta.role) {
    if (!token) {
      // If no token, redirect to login page
      return next({ name: 'login' })
    }
    if (user.role !== to.meta.role) {
      // If user role doesn't match the required role, redirect to home page or access denied page
      return next({ name: 'home' })
    }
  }

  // If no authentication required, allow navigation
  next()
})

export default router
