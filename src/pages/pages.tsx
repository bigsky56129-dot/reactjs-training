import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";
import {Outlet} from "react-router";
import Footer from "../components/footer/footer";
import React, {useContext} from "react";
import {AuthenticatedContext} from "../shared/Authenticated";
import {Navigate} from "react-router";

const Pages = () => {
    const auth = useContext(AuthenticatedContext);
    const isAuthenticated = !!auth?.user;

    return (
        <>
            <Header/>

            { isAuthenticated ? (
                <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
                    <Sidebar/>
                    <div id="main-content"
                         className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
                        <main>
                            <Outlet></Outlet>
                            <Footer/>
                        </main>
                    </div>
                </div>
            ) : <Navigate to="/login" replace />}
        </>
    )
}

export default Pages