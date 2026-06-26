import { Outlet } from "react-router";
import Navbar from "../shared/components/Navbar";

const AppLayout = (): React.ReactNode => {

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )

}

export default AppLayout;