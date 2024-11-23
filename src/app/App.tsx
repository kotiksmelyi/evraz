import { queryClient } from '@shared/server/queryCLient';
import { QueryClientProvider } from '@tanstack/react-query';
import './locale';
import { AppRouter } from './router';
import './styles/App.scss';
import { ThemeProvider } from './theme';
function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
