import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { PATHS } from './constants/paths';
import { FavoritesPage } from './pages/favorites-page';
import { HomePage } from './pages/home-page';

function App() {
  return (
      <>
          <Navigation/>
          <Routes>
              <Route path={PATHS.HOME} element={<HomePage/>}/>
              <Route path={PATHS.FAVORITES} element={<FavoritesPage/>}/>
          </Routes>
      </>
  );
}

export default App;
