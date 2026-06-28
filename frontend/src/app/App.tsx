import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/auth.hook";
import { useEffect } from "react";


const App = () => {
    const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();

    // pageshow fires on both normal load AND when the browser restores
    // the page from the back-forward cache (bfcache). The persisted flag
    // is true only for bfcache restores — re-validate the session then
    // so stale Redux state never survives back/forward navigation.
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
