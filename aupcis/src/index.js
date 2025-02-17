import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init('YOUR_POSTHOG_API_KEY', { api_host: 'https://app.posthog.com' });

// Identify the user with a unique ID
posthog.identify('unique_user_id'); // Replace 'unique_user_id' with the actual unique user ID

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
