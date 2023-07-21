import React from 'react';
import HomePage from './Pages/Home';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider>
      <HomePage />
    </SnackbarProvider>
  );
}

export default App;
