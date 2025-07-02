import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Portdex Chat - AI-Powered Blockchain Marketplace',
    short_name: 'Portdex Chat',
    description: 'Revolutionary AI-powered platform combining chatbot technology with blockchain marketplace features. Create, tokenize, and trade AI agents.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['productivity', 'business', 'finance', 'education'],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: '/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/hero.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Portdex Chat Interface',
      },
      {
        src: '/hero2.png',
        sizes: '1200x630',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Portdex Marketplace',
      },
    ],
  };
} 