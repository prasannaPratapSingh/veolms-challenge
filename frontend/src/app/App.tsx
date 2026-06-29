import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/auth.hook";
import { useEffect } from "react";
import { useVideoPolling } from "../features/lesson/hook/useVideoPolling";


const App = () => {
    const { handleGetMe } = useAuth();
    useVideoPolling(); // global poller — survives navigation, handles concurrent uploads

  useEffect(() => {
    handleGetMe();

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        handleGetMe();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [])

  return (
    <RouterProvider router={routes}/>
  )
}

export default App
