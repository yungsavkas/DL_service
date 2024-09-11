import React from 'react';
import ReactDOM from 'react-dom/client';
import '../shared/styles/global.css';
import { NextUIProvider } from '@nextui-org/react';
import { RecoilRoot } from 'recoil';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <RecoilRoot>
        <NextUIProvider>
            <main className="text-foreground">
                <App />
            </main>
        </NextUIProvider>
    </RecoilRoot>
);
