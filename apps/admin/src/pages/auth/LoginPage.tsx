import React from 'react';
import { Helmet } from 'react-helmet-async';
import LoginView from '@/views/auth/LoginView';

const LoginPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Login - AdminPanel</title>
        <meta
          name="description"
          content="Sign in to your admin dashboard to manage your e-commerce business"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <LoginView />
    </>
  );
};

export default LoginPage;
