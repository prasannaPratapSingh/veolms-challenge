import { createBrowserRouter } from "react-router";
import AppLayout from "./AppLayout";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import LandingPage from "../components/LandingPage";


export const routes = createBrowserRouter([

    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <SignUp />
    },
    {
        element: <AppLayout />,
        children: [
            {
                path: "/dashboard",
                element: <>Welcome to see your courses!</>
            },
            {
                path: "/my-courses",
                element: <>My Courses</>
            }
        ]
    }

])