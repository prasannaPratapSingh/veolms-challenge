import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";

/* ── pages ── */
import LandingPage from "../components/LandingPage";
import Login from "../features/auth/pages/Login";
import SignUp from "../features/auth/pages/SignUp";
import AdminLogin from "../features/auth/pages/AdminLogin";
import VeoDashboard from "../features/auth/pages/VeoDashboard";
import UserDashboard from "../features/auth/pages/UserDashboard";
import UserProfile from "../features/auth/pages/UserProfile";
import CourseEditor from "../features/course/pages/CourseEditor";
import CourseDetail from "../features/course/pages/CourseDetail";
import CoursePlayer from "../features/course/pages/CoursePlayer";
import CoursesPage from "../features/course/pages/CoursesPage";
import Checkout from "../features/course/pages/Checkout";

/* ── guards ── */
import Protected from "../features/auth/components/Protected";
import GuestOnly from "../features/auth/components/GuestOnly";
import AdminOnly from "../features/auth/components/AdminOnly";
import AdminGuestOnly from "../features/auth/components/AdminGuestOnly";


export const routes = createBrowserRouter([

    /* ── public ── */
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/course/:courseId",
        element: <CourseDetail />,
    },
    {
        path: "/courses",
        element: <CoursesPage />,
    },

    /* ── learner auth ── */
    {
        path: "/login",
        element: <GuestOnly><Login /></GuestOnly>,
    },
    {
        path: "/signup",
        element: <GuestOnly><SignUp /></GuestOnly>,
    },

    /* ── admin auth ── */
    {
        path: "/admin",
        element: <AdminGuestOnly><AdminLogin /></AdminGuestOnly>,
    },

    /* ── admin protected area ── */
    {
        path: "/admin/veodashboard",
        element: <AdminOnly><VeoDashboard /></AdminOnly>,
    },
    {
        path: "/admin/course/:courseId",
        element: <AdminOnly><CourseEditor /></AdminOnly>,
    },

    /* ── learner protected area ── */
    {
        element: <AppLayout />,
        children: [
            {
                path: "/dashboard",
                element: <Protected><UserDashboard /></Protected>,
            },
            {
                path: "/profile",
                element: <Protected><UserProfile /></Protected>,
            },
            {
                path: "/my-courses",
                element: <>My Courses</>,
            },
            {
                path: "/course/:courseId/learn",
                element: <Protected><CoursePlayer /></Protected>,
            },
            {
                path: "/course/:courseId/checkout",
                element: <Protected><Checkout /></Protected>,
            },
        ],
    },

]);
