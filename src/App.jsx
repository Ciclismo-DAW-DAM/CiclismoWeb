import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { router } from "./router";
import { RaceProvider } from "./context/RaceContext";
import { Toaster } from 'sonner';

function App() {
  return (
    <RaceProvider >
      <AuthProvider>
        <Toaster position="top-right" richColors />
        <RouterProvider router={router} />
      </AuthProvider>
    </RaceProvider>
  )
}

export default App