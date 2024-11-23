import { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoutes } from './routes';
import Home from '@pages/Home/Home';

export const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={AppRoutes.Home} element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
};
