import pagesRoutes from "./pages/pages.routes";
import authRoutes from "./pages/auth/auth.routes";
import {createBrowserRouter} from "react-router-dom";
import RedirectRoot from "./pages/redirect-root";

const appRouter = createBrowserRouter([
    {
        path: '',
        element: <RedirectRoot />
    },
    ...authRoutes,
    ...pagesRoutes
])


export default appRouter