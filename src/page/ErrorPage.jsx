import React from 'react'
import { useNavigate, useRouteError } from 'react-router-dom'

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4 p-8 bg-white rounded-xl shadow-2xl text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            ¡Ups! Algo salió mal
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.message || "La página que buscas no existe"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            Volver atrás
          </button>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage