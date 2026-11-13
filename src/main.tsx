import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './router';

import './styles/tokens.css';
import './styles/fonts.css';
import './styles/base.css';
import './components/ds/ds.css';
import './components/components.css';
import './components/layout.css';
import './sections/sections.css';
import './styles/motion.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
