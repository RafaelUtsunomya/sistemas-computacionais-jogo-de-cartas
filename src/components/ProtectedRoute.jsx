import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente protege rotas
export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. Espera o AuthContext verificar o token
  if (loading) {
    return <div>Carregando sua sessão...</div>;
  }

  // 2. Se não houver usuário, redireciona para a HomePage
  if (!user) {
    // Você pode redirecionar para '/' (HomePage) ou '/login'
    return <Navigate to="/" replace />;
  }

  // 3. Se houver usuário, renderiza o componente filho (a GamePage)
  return <Outlet />;
}
