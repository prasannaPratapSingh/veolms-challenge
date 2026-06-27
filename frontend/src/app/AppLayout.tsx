import { Outlet } from "react-router";
import Navbar from "../components/landing/Navbar";

const AppLayout = (): React.ReactNode => {

    return (
        <>
            <Navbar minimal />
            <Outlet />
        </>
    )

}

export default AppLayout;
