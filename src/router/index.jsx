import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import ErrorPage from "../page/ErrorPage";
import Home from "../page/Home";
import Login from "../page/Login";
import Participation from "../page/Participation";
import Profile from "../page/Profile";
import RaceDetail from "../page/RaceDetail";

import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<RootLayout/>,
        errorElement: <ErrorPage />,
        children:[
            {
                index: true,
                element:<Login />
            },
            {
                path: "home",
                element: <ProtectedRoute><Home/></ProtectedRoute>
            },
            {
                path:"profile", 
                element: <ProtectedRoute><Profile /></ProtectedRoute>
            },
            {
                path:"race/:id", 
                element: <ProtectedRoute><RaceDetail /></ProtectedRoute>
            },
            {
                path:"participation",
                element: <ProtectedRoute><Participation /></ProtectedRoute>
            }
        ]
    }
]);