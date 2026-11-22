import { Baloo_2, Noto_Sans_Khmer } from 'next/font/google';
import './design.css';
import { Providers } from '../components/Providers';
import Header from '../components/Headers';

const baloo = Baloo_2({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-baloo' });
const khmer = Noto_Sans_Khmer({ subsets: ['khmer'], weight: ['500', '700', '800'], variable: '--font-khmer' });

export const metadata = { title: 'Viral Khmer Slang' };

// Runs before paint so dark mode / language don't flash on load
const initScript = `try{var t=localStorage.getItem('theme');if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.dataset.theme=t;var l=localStorage.getItem('lang');if(l)document.documentElement.lang=l}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${baloo.variable} ${khmer.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}