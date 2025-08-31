import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import AppRouter from './routers/AppRouter';
import { HelmetProvider } from 'react-helmet-async';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <Router>
          <AppRouter />
        </Router>
      </HelmetProvider>
    </Provider>
  );
};

export default App;
