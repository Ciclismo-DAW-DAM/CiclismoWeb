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
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "race/:id",
        element: (
            <RaceDetail />
        ),
      },
      {
        path: "participation",
        element: (
          <ProtectedRoute>
            <Participation />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);