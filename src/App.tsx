import React from 'react';
import './App.css';
import {RouterProvider, } from "react-router";
import AppRouter from './App.router';
import {AuthenticatedProvider} from "./shared/authenticated";

function App() {
    return (
        <AuthenticatedProvider>
            <RouterProvider router={AppRouter} />

        </AuthenticatedProvider>
    )
}

export default App;
