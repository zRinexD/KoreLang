import { PhonemeDataService } from './services/PhonemeDataService';
// Vérification de la couverture des métadonnées phonémiques (dev only)
if (process.env.NODE_ENV !== 'production') {
  PhonemeDataService.checkMetaCoverage();
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);