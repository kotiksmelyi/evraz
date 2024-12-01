import { Home } from './Home';
import './styles/App.scss';
import { ThemeProvider } from './theme';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path={'/'} element={<Home />} />
		  <Route path={'/:id'} element={<Home />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
