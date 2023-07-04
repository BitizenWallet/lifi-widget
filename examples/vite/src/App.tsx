import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';

export const widgetConfig: Partial<WidgetConfig> = {
  chains: {
    allow: [
      1, 56, 137, 43114, 250, 10, 42161, 100, 66, 128, 321, 10001, 32520, 88, 24, 5, 97
    ],
  },
  // insurance: true,
  bridges: {
    // deny: ['multichain'],
  },
  exchanges: {
    // deny: ['soulswap'],
  },
  variant: 'expandable',
  // subvariant: 'split',
  appearance: 'dark',
  hiddenUI: ['poweredBy', 'language', 'appearance', 'drawerButton'],
  containerStyle: {
    // border: `1px solid rgb(234, 234, 234)`,
    // borderRadius: '16px',
    minHeight: '100vh',
    maxWidth: '600px',
    background: 'white',
    height: '100vh',
    border: 'unset'
  },
  theme: {
    palette: {
      primary: {
        main: 'rgba(5, 161, 125, 1)',
      },
      background: {
        paper: '#2C323A',
        default: '#1E242B',
      },
    },
  },
};

export function App() {
  return <LiFiWidget config={widgetConfig} integrator="vite-example" />;
}
