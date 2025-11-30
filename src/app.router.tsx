import pagesRoutes from "./pages/pages.routes";
import {createBrowserRouter} from "react-router-dom";
import RedirectRoot from "./pages/RedirectRoot";

const appRouter = createBrowserRouter([
    {
        path: '',
        element: <RedirectRoot />
    },
    ...pagesRoutes
])


export default appRouter