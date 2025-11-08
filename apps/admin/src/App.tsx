import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppRouter from './routers/AppRouter';
import { HelmetProvider } from 'react-helmet-async';
import { AbilityProvider } from './lib/AbilityContext';
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AbilityProvider>
          <HelmetProvider>
            <Router>
              <AppRouter />
              <Toaster position="top-right" richColors closeButton />
            </Router>
          </HelmetProvider>
        </AbilityProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
