import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './css/style.css'
import './vendor/bootstrap/css/bootstrap-grid.css'
import './vendor/boxicons/css/transformations.css'
import './vendor/glightbox/css/glightbox.css'
import './vendor/glightbox/css/plyr.css'
import './vendor/boxicons/css/animations.css'
import './vendor/boxicons/css/boxicons.css'
import 'bootstrap/dist/css/bootstrap.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
