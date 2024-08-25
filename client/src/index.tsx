import React from 'react';
import ReactDOM from 'react-dom/client';

import '../src/app/layout/style.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes.js';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';

 
// 让React与DOM创建联系， 使用createRoot创建一个root节点， root在index.html中的div中
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(   // 在root节点中使用render方法渲染，render的内容会穿线在div#root中  
  <React.StrictMode> 
 
      <Provider store={store}>
        <RouterProvider router={router} /> 
      </Provider>        
      
  </React.StrictMode>
);



