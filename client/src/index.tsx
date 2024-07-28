import React from 'react';
import ReactDOM from 'react-dom/client';

import '../src/app/layout/style.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.js';
import { StoreProvider } from './app/context/StoreContext.js';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';
 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode> 
 
      <Provider store={store}>
        <RouterProvider router={router} /> 
      </Provider>        
      
  </React.StrictMode>
);

