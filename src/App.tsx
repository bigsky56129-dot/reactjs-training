import React from 'react';
import './App.css';
import {RouterProvider, } from "react-router";
import appRouter from "./App.router";
import {AuthenticatedProvider} from "./shared/authenticated";

function App() {
    return (
        <AuthenticatedProvider>
            <RouterProvider router={appRouter} />

        </AuthenticatedProvider>
    )
}

export default App;
