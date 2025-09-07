import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import AppRouter from './routers/AppRouter';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <Router>
            <AppRouter />
          </Router>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
