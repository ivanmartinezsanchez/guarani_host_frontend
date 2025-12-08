/**
 * Router configuration for GuaraníHost application
 * ------------------------------------------------
 * - Handles routing for public, authenticated, admin and host views
 * - Implements role-based access control and navigation guards
 */
import { createRouter, createWebHistory } from "vue-router";
/**
 * Public views - accessible without authentication
 */
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ContactView from "@/views/ContactView.vue";
import HelpCenterView from "@/views/HelpCenterView.vue";
import TermsView from "@/views/TermsView.vue";
import PrivacyPolicyView from "@/views/PrivacyPolicyView.vue";
import UserProfileView from "@/views/UserProfileView.vue";
import PropertyDetailView from "@/views/PropertyDetailView.vue";
import TourDetailView from "@/views/TourDetailView.vue";
import ToursView from "@/views/ToursView.vue";
/**
 * Admin views - require admin role
 */
import AdminDashboardView from "@/views/AdminDashboardView.vue";
import AdminUserManagementView from "@/views/AdminUserManagementView.vue";
import AdminPropertyManagementView from "@/views/AdminPropertyManagementView.vue";
import AdminBookingManagementView from "@/views/AdminBookingManagementView.vue";
import AdminTourManagementView from "@/views/AdminTourManagementView.vue";
/**
 * Host views - require host role
 */
import HostDashboardView from "@/views/HostDashboardView.vue";
import HostPropertyManagementView from "@/views/HostPropertyManagementView.vue";
import HostTourManagementView from "@/views/HostTourManagementView.vue";
import HostBookingView from "@/views/HostBookingView.vue";
/**
 * Lazy-loaded components for better performance
 * These views are loaded only when the route is visited
 */
const EditProfileView = () => import("@/views/EditProfileView.vue");
const ChangePasswordView = () => import("@/views/ChangePasswordView.vue");
const SearchView = () => import("@/views/SearchView.vue");
/**
 * Route definitions with meta properties for access control
 *
 * Meta properties:
 * - public: true       → route is accessible without authentication
 * - requiresAuth: true → route requires a valid JWT token
 * - role: 'admin' | 'host' | 'user' → route restricted to a specific role
 * - authRoute: true    → auth-related routes (login / register) that should be
 *                        redirected if the user is already authenticated
 * - showFooter: true   → layout hint to show the footer component
 */
const routes = [
    // ==================== PUBLIC ROUTES ====================
    /**
     * Landing page with hero section and featured properties/tours
     */
    {
        path: "/",
        name: "home",
        component: HomeView,
        meta: { public: true, showFooter: true },
    },
    /**
     * About page with company information
     */
    {
        path: "/about",
        name: "about",
        component: AboutView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Search results page for properties and tours
     * Example: /search?checkIn=2025-06-06&checkOut=2025-06-07&guests=2
     */
    {
        path: "/search",
        name: "search",
        component: SearchView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Public listing of tours / "Experiencias locales"
     * This is what the navbar "Tours" link should point to.
     */
    {
        path: "/tours",
        name: "tours",
        component: ToursView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Property detail page – single property information, photos, amenities, reviews
     */
    {
        path: "/property/:id",
        name: "property-detail",
        component: PropertyDetailView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Tour detail page – single tour information, itinerary, pricing, host details
     */
    {
        path: "/tour/:id",
        name: "tour-detail",
        component: TourDetailView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Contact page with company contact information and contact form
     */
    {
        path: "/contact",
        name: "contact",
        component: ContactView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Help center with FAQs and support information
     */
    {
        path: "/help",
        name: "help-center",
        component: HelpCenterView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Terms of service page
     */
    {
        path: "/terms",
        name: "terms",
        component: TermsView,
        meta: { public: true, showFooter: true },
    },
    /**
     * Privacy policy page
     */
    {
        path: "/privacy",
        name: "privacy-policy",
        component: PrivacyPolicyView,
        meta: { public: true, showFooter: true },
    },
    // ==================== AUTHENTICATION ROUTES ====================
    /**
     * Login page
     * If the user is already authenticated, they will be redirected
     * to their role-based dashboard.
     */
    {
        path: "/login",
        name: "login",
        component: LoginView,
        meta: { public: true, authRoute: true, showFooter: true },
    },
    /**
     * Registration page
     * If the user is already authenticated, they will be redirected
     * to their role-based dashboard.
     */
    {
        path: "/register",
        name: "register",
        component: RegisterView,
        meta: { public: true, authRoute: true, showFooter: true },
    },
    // ==================== AUTHENTICATED USER ROUTES ====================
    /**
     * User profile page – displays basic user information
     * Accessible to any authenticated user (no specific role required)
     */
    {
        path: "/profile",
        name: "profile",
        component: UserProfileView,
        meta: { requiresAuth: true, showFooter: true },
    },
    /**
     * Edit profile page – allows users to update profile information
     */
    {
        path: "/profile/edit",
        name: "edit-profile",
        component: EditProfileView,
        meta: { requiresAuth: true, showFooter: true },
    },
    /**
     * Change password page – allows users to update their password
     */
    {
        path: "/profile/change-password",
        name: "change-password",
        component: ChangePasswordView,
        meta: { requiresAuth: true, showFooter: true },
    },
    // ==================== USER-SPECIFIC ROUTES ====================
    /**
     * User dashboard – overview of user activity, bookings and account status
     */
    {
        path: "/user/dashboard",
        name: "user-dashboard",
        component: () => import("@/views/UserDashboardView.vue"),
        meta: { requiresAuth: true, role: "user" },
    },
    /**
     * User bookings – page to manage property and tour reservations
     */
    {
        path: "/user/bookings",
        name: "user-bookings",
        component: () => import("@/views/UserBookingView.vue"),
        meta: { requiresAuth: true, role: "user" },
    },
    /**
     * Spanish alias for user bookings (SEO / UX)
     */
    {
        path: "/user/reservas",
        name: "user-reservas",
        redirect: { name: "user-bookings" },
    },
    /**
     * Alternative Spanish alias for user bookings
     */
    {
        path: "/mis-reservas",
        name: "mis-reservas",
        redirect: { name: "user-bookings" },
    },
    // ==================== ADMIN ROUTES ====================
    /**
     * Admin dashboard – overview of platform metrics
     */
    {
        path: "/admin/dashboard",
        name: "admin-dashboard",
        component: AdminDashboardView,
        meta: { requiresAuth: true, role: "admin" },
    },
    /**
     * Admin user management – CRUD for all users (hosts and guests)
     */
    {
        path: "/admin/users",
        name: "admin-users",
        component: AdminUserManagementView,
        meta: { requiresAuth: true, role: "admin" },
    },
    /**
     * Admin property management – manage all properties in the system
     */
    {
        path: "/admin/properties",
        name: "admin-properties",
        component: AdminPropertyManagementView,
        meta: { requiresAuth: true, role: "admin" },
    },
    /**
     * Admin booking management – view and manage all bookings
     */
    {
        path: "/admin/bookings",
        name: "admin-bookings",
        component: AdminBookingManagementView,
        meta: { requiresAuth: true, role: "admin" },
    },
    /**
     * Admin tour management – manage all tours / experiences
     */
    {
        path: "/admin/tours",
        name: "admin-tours",
        component: AdminTourManagementView,
        meta: { requiresAuth: true, role: "admin" },
    },
    // ==================== HOST ROUTES ====================
    /**
     * Host dashboard – overview of host's properties, tours and bookings
     */
    {
        path: "/host/dashboard",
        name: "host-dashboard",
        component: HostDashboardView,
        meta: { requiresAuth: true, role: "host" },
    },
    /**
     * Host property management – CRUD for host's own properties
     */
    {
        path: "/host/properties",
        name: "host-properties",
        component: HostPropertyManagementView,
        meta: { requiresAuth: true, role: "host" },
    },
    /**
     * Host tour management – CRUD for host's own tours / experiences
     */
    {
        path: "/host/tours",
        name: "host-tours",
        component: HostTourManagementView,
        meta: { requiresAuth: true, role: "host" },
    },
    /**
     * Host booking management – view and manage bookings for host resources
     */
    {
        path: "/host/bookings",
        name: "host-bookings",
        component: HostBookingView,
        meta: { requiresAuth: true, role: "host" },
    },
    // ==================== ERROR HANDLING ====================
    /**
     * Catch-all route for 404 pages – MUST be last in the routes array
     */
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: () => import("@/views/NotFoundView.vue"),
        meta: { public: true, showFooter: true },
    },
];
/**
 * Create router instance with HTML5 history mode
 * Uses createWebHistory for clean URLs without hash (#)
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
});
/**
 * Global navigation guard for authentication and authorization
 * ------------------------------------------------------------
 * Runs before every navigation and enforces:
 * - Public route access (no authentication required)
 * - Authentication requirements (valid JWT token)
 * - Role-based access control (admin / host / user)
 * - Redirects authenticated users away from auth routes (login/register)
 */
router.beforeEach((to, from, next) => {
    // Retrieve authentication data from sessionStorage
    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    const token = storedToken || null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    // Extract meta flags from route
    const isPublic = to.meta.public === true;
    const requiresAuth = to.meta.requiresAuth === true;
    const isAuthRoute = to.meta.authRoute === true;
    console.log(`🧭 Navigating to: ${String(to.name)}`, {
        isPublic,
        requiresAuth,
        isAuthRoute,
        hasToken: !!token,
        userRole: user?.role,
        routePath: to.path,
    });
    // 1. Public route that does not require authentication
    if (isPublic && !requiresAuth && !isAuthRoute) {
        console.log("✅ Public route - access granted");
        return next();
    }
    // 2. Protected route with no token → redirect to login
    if (requiresAuth && (!token || !user)) {
        console.warn("🔒 Authentication required. Redirecting to login.");
        return next({ name: "login" });
    }
    // 3. Role-based access control
    if (to.meta.role && user?.role !== to.meta.role) {
        console.warn(`🚫 Access denied: required role "${to.meta.role}", current role "${user?.role}"`);
        // Redirect to the appropriate dashboard based on the actual role
        if (user?.role === "admin") {
            return next({ name: "admin-dashboard" });
        }
        else if (user?.role === "host") {
            return next({ name: "host-dashboard" });
        }
        else if (user?.role === "user") {
            return next({ name: "user-dashboard" });
        }
        else {
            return next({ name: "home" });
        }
    }
    // 4. Auth routes (login/register) with already authenticated user → redirect
    if (isAuthRoute && token && user) {
        console.info("🔁 User already authenticated. Redirecting to dashboard.");
        if (user.role === "admin") {
            return next({ name: "admin-dashboard" });
        }
        else if (user.role === "host") {
            return next({ name: "host-dashboard" });
        }
        else if (user.role === "user") {
            return next({ name: "user-dashboard" });
        }
        else {
            return next({ name: "profile" });
        }
    }
    // 5. Authenticated user accessing a protected route they are allowed to see
    if (requiresAuth && token && user) {
        console.log("✅ Authenticated route - access granted");
        return next();
    }
    // 6. Non-authenticated user accessing auth routes (login/register)
    if (isAuthRoute && !token) {
        console.log("✅ Auth route for non-authenticated user - access granted");
        return next();
    }
    // 7. Default fallback – allow navigation
    console.log("✅ Default route access - granted");
    next();
});
export default router;
//# sourceMappingURL=index.js.map