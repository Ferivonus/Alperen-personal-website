import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const viewport: Viewport = {
  themeColor: '#080808',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://alperenborklu.com'),
  title: {
    default: 'Alperen Börklü | Visual Artist & Motion Designer',
    template: '%s | Alperen Börklü',
  },
  description: 'Portfolio of Alperen Börklü, a visual artist and motion designer specializing in 3D animation, cinematic storytelling, and art direction based in Ankara.',
  keywords: [
    'Alperen Börklü', 'Visual Artist', 'Motion Designer', '3D Animation', 
    'CG Generalist', 'Art Direction', 'Cinematic Motion', 'Ankara', 'Design', 'Filmmaking'
  ],
  authors: [{ name: 'Alperen Börklü' }],
  creator: 'Alperen Börklü',
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alperenborklu.com',
    siteName: 'Alperen Börklü Portfolio',
    title: 'Alperen Börklü | Visual Artist & Motion Designer',
    description: 'Visual artist and motion designer specializing in animation, visual storytelling, and cinematic motion.',
    images: [
      {
        url: '/assets/mezuniyet.jpg', 
        width: 1200,
        height: 630,
        alt: 'Alperen Börklü - Visual Artist',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Alperen Börklü | Visual Artist & Motion Designer',
    description: 'Visual artist and motion designer specializing in animation, visual storytelling, and cinematic motion.',
    images: ['/assets/mezuniyet.jpg'],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  icons: {
    icon: '/assets/mezuniyet.jpg',
    apple: '/assets/mezuniyet.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#080808] text-white antialiased`}>
        <Header />
        <main className="min-h-screen relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}