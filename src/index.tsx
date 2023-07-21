import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { registerLicense } from '@syncfusion/ej2-base';

const syncfusionLicenseKey = 'Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCdkx3TXxbf1xzZFZMZVRbRX5PMyBoS35RdUVkWHZcc3BSRmJfUUZ0';

registerLicense(syncfusionLicenseKey);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
