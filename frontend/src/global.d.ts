export {};

declare global {
  interface Window {
    pJSDom: any[];
  }
}

import Stats from 'stats.js';

declare module 'stats.js' {
  interface Stats {
    setMode(mode: number): void;
  }
}