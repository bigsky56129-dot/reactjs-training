import Home from "./home/home";
import UsersList from "./clients/users-list";
import userRoutes from "./user/user.routes";
import Pages from "./pages";
import authRoutes from "./auth/auth.routes";
import Login from "./auth/login/login";
import ReviewPage from "./review/review-page";
import Unauthorized from "./unauthorized";
import { ProtectedRoute } from "../components/protected-route";
import PersonalInformation from "./user/personal-information/personal-information";
import UserKYC from "./user/kyc/kyc";


const pageRoutes = [
    // Aliases for direct access without /pages prefix
    { path: 'user/:id/pi', element: <PersonalInformation /> },
    { path: 'user/:id/kyc', element: <UserKYC /> },
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