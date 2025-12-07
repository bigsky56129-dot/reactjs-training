import pagesRoutes from "./pages/pages.routes";
import {createBrowserRouter} from "react-router-dom";
import RedirectRoot from "./pages/redirect-root";

const appRouter = createBrowserRouter([
    {
        path: '',
        element: <RedirectRoot />
    },
    ...pagesRoutes
])


export default appRouter