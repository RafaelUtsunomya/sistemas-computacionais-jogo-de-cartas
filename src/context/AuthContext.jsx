import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

// Nomes dos "claims" (informações) que esperamos do backend C#
const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const emailClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Roda UMA VEZ quando o app carrega
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        // CORREÇÃO 1: Priorizar 'name' (Username), se não, 'email'
        setUser({
          // O 'email' no estado user agora guarda o Username (name) ou o Email
          email: decodedToken.name || decodedToken[emailClaim], 
          role: decodedToken[roleClaim] || decodedToken.role
        });

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      } catch (error) {
        console.error("Token salvo é inválido ou expirou.", error);
        authService.logout();
      }
    }
    setLoading(false);
  }, []);

  // Roda quando o Login.jsx chama
  const login = async (email, password) => {
    try {
      await authService.login(email, password); 
      
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token);
        
        // CORREÇÃO 1: Priorizar 'name' (Username), se não, 'email'
        setUser({
          // O 'email' no estado user agora guarda o Username (name) ou o Email
          email: decodedToken.name || decodedToken[emailClaim],
          role: decodedToken[roleClaim] || decodedToken.role
        });
      }
    } catch (error) {
      throw error; 
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

