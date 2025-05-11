import { createRouter, createWebHistory } from 'vue-router'

// Públicas
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import PropertyDetailView from '@/views/PropertyDetailView.vue'
import TourDetailView from '@/views/TourDetailView.vue'

// Admin
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import UserManagementView from '@/views/UserManagementView.vue'
import HomeManagementView from '@/views/HomeManagementView.vue'
import BookingManagementView from '@/views/BookingManagementView.vue'
import TourManagementView from '@/views/TourManagementView.vue'

// Host
import HostDashboardView from '@/views/HostDashboardView.vue'
import HostHomeManagementView from '@/views/HostHomeManagementView.vue'
import HostTourManagementView from '@/views/HostTourManagementView.vue'
import HostBookingView from '@/views/HostBookingView.vue'

const routes = [
  // Public routes (footer visible)
  { path: '/', name: 'home', component: HomeView, meta: { showFooter: true } },
  { path: '/about', name: 'about', component: AboutView, meta: { showFooter: true } },
  { path: '/login', name: 'login', component: LoginView, meta: { showFooter: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { showFooter: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { showFooter: true } },
  { path: '/home/:id', name: 'property-detail', component: PropertyDetailView, meta: { showFooter: true } },
  { path: '/tour/:id', name: 'tour-detail', component: TourDetailView, meta: { showFooter: true } },

  // Admin routes (no footer)
  { path: '/admin/dashboard', name: 'admin-dashboard', component: AdminDashboardView, meta: { showFooter: false } },
  { path: '/admin/users', name: 'admin-users', component: UserManagementView, meta: { showFooter: false } },
  { path: '/admin/homes', name: 'admin-homes', component: HomeManagementView, meta: { showFooter: false } },
  { path: '/admin/bookings', name: 'admin-bookings', component: BookingManagementView, meta: { showFooter: false } },
  { path: '/admin/tours', name: 'admin-tours', component: TourManagementView, meta: { showFooter: false } },

  // Host routes (no footer)
  { path: '/host/dashboard', name: 'host-dashboard', component: HostDashboardView, meta: { showFooter: false } },
  { path: '/host/homes', name: 'host-homes', component: HostHomeManagementView, meta: { showFooter: false } },
  { path: '/host/tours', name: 'host-tours', component: HostTourManagementView, meta: { showFooter: false } },
  { path: '/host/bookings', name: 'host-bookings', component: HostBookingView, meta: { showFooter: false } },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
