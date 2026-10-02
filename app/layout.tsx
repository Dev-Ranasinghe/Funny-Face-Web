import type { Metadata, Viewport } from 'next';
import { Anton, DM_Mono, Newsreader } from 'next/font/google';
import 'lenis/dist/lenis.css';
import './fonts.css';
import './globals.css';

// Free stand-ins: Anton ≈ condensed display, Newsreader ≈ light editorial serif, DM Mono ≈ utility mono.
const display = Anton({ weight: '400', subsets: ['latin'], variable: '--font-display', display: 'swap' });
const serif = Newsreader({ weight: ['200', '300', '400'], subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const mono = DM_Mono({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Funny Face — Creative Developer',
  description: 'Websites with a pulse, a sense of humour and motion that earns its place.',
};

export const viewport: Viewport = {
  themeColor: '#160000',
  width: 'device-width',
  initialScale: 1,
};

const themeScript = `try{var t=localStorage.getItem('ff-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <noscript>
          <style>{`.loader{display:none}.frame{box-shadow:inset 0 0 0 var(--frame) var(--ink)}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
