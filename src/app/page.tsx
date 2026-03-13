'use client';

import React from 'react';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
