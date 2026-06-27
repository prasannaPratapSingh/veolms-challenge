import { RouterProvider } from "react-router"
import { routes } from "./app.routes"
import { useAuth } from "../features/auth/hook/auth.hook";
import { useEffect } from "react";


const App = () => {
    const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
  }, [])

  return (
    <RouterProvider router={routes}/>
  )
}

export default App
