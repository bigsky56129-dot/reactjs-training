import Home from "./home/home";
import UsersList from "./clients/users-list";
import userRoutes from "./user/user.routes";
import Pages from "./pages";
import authRoutes from "./auth/auth.routes";
import Login from "./auth/login/login";
import ReviewPage from "./review/review-page";
import Unauthorized from "./unauthorized";
import { ProtectedRoute } from "../components/protected-route";


const pageRoutes = [
    {
        path: 'pages',
        element: <Pages/>,
        children: [
            {
                path: 'home',
                element: <Home/>
            },
            {
                path: 'clients',
                element: (
                    <ProtectedRoute requiredPermission="view:all-profiles">
                        <UsersList />
                    </ProtectedRoute>
                )
            },
            {
                path: 'review',
                element: (
                    <ProtectedRoute requiredPermission="access:review-page">
                        <ReviewPage />
                    </ProtectedRoute>
                )
            },
            {
                path: 'unauthorized',
                element: <Unauthorized />
            },
            ...authRoutes,
            ...userRoutes
        ]
    },
        {
        path: 'login',
        element: <Login/>,
        children: [
            {
                path: 'login',
                element: <Login/>
            },
            ...authRoutes,
            ...userRoutes
        ]
    },


]

export default pageRoutes;