import React from 'react';
// 1. Importações do router (o que provavelmente faltava)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'; // O seu CSS

// 2. Importar as suas "Páginas"
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';

// 3. Importar o "Guardião" da rota do jogo
import ProtectedRoute from './components/ProtectedRoute';

// Nota: Não precisamos do AuthProvider aqui,
// pois ele já está no seu main.jsx a "envolver" este <App />, que é o correto.

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal (pública) que mostra o seu menu/login */}
        <Route path="/" element={<HomePage />} />

        {/* Este é um "agrupador" de rotas. 
          Ele usa o ProtectedRoute para verificar se o utilizador está logado.
        */}
        <Route element={<ProtectedRoute />}>
          {/* Se o utilizador estiver logado, ele pode aceder à /game */}
          <Route path="/game" element={<GamePage />} />
        </Route>

        {/* Pode adicionar outras rotas aqui (ex: <Route path="/admin" ... />) */}

      </Routes>
    </BrowserRouter>
  );
}

