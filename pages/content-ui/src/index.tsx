// React와 ReactDOM을 전역 변수로 사용
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
  }
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './tailwind-input.css';

const root = document.createElement('div');
root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

document.body.append(root);

const rootIntoShadow = document.createElement('div');
rootIntoShadow.id = 'shadow-root';

const shadowRoot = root.attachShadow({ mode: 'open' });

// 스타일 요소 생성
const styleElement = document.createElement('style');
styleElement.textContent = `
  :host {
    all: initial;
  }
  #shadow-root {
    font-family: system-ui, -apple-system, sans-serif;
  }
`;
shadowRoot.appendChild(styleElement);

shadowRoot.appendChild(rootIntoShadow);
createRoot(rootIntoShadow).render(React.createElement(App));
