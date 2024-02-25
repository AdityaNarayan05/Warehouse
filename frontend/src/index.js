// Importing React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Importing the main App component
import App from './App';

// Importing the global styles
import './index.css';

// Creating a root using ReactDOM.createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the App component within the root
root.render(
    <App />
);