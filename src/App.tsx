import React from 'react';
import './app.css';
import {RouterProvider, } from "react-router";
import appRouter from "./app.router";
import {AuthenticatedProvider} from "./shared/authenticated";

function App() {
    return (
        <AuthenticatedProvider>
            <RouterProvider router={appRouter} />

        </AuthenticatedProvider>
    )
}

export default App;
