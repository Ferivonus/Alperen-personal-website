import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Font ayarları
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
  description: 'Explore the portfolio of Alperen Börklü. A visual artist and motion designer blending cinematic storytelling with structural design in 3D animation and art direction.',
  applicationName: 'Alperen Börklü Portfolio',
  category: 'Design & Art Portfolio',
  
  keywords: [
    'Alperen Börklü', 'Visual Artist', 'Motion Designer', '3D Animation', 
    'CG Generalist', 'Art Direction', 'Cinematic Motion', 'Ankara', 'Design', 'Filmmaking', 'Portfolio'
  ],
  
  authors: [{ name: 'Alperen Börklü', url: 'https://alperenborklu.com' }],
  creator: 'Alperen Börklü',
  publisher: 'Alperen Börklü',
  
  // Mobil cihazların sayıları ve mailleri çirkin mavi linklere çevirmesini engeller
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Arama motorları için kopya içerik karışıklığını önler
  alternates: {
    canonical: '/',
  },

  // 1. EKLENTİ: Google Search Console Doğrulaması (SEO)
  // Siteni Google'a kaydettiğinde sana verecekleri kodu buraya yazacaksın
  verification: {
    google: 'google-site-verification-kodunu-buraya-yaz',
  },
  
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alperenborklu.com',
    siteName: 'Alperen Börklü | Premium Visual Art',
    title: 'Alperen Börklü | Visual Artist & Motion Designer',
    description: 'Explore the portfolio of Alperen Börklü. A visual artist and motion designer blending cinematic storytelling with structural design.',
    images: [
      {
        url: '/assets/mezuniyet.jpg', 
        width: 1200,
        height: 630,
        alt: 'Alperen Börklü - Visual Artist Portfolio',
        type: 'image/jpeg',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'Alperen Börklü | Visual Artist & Motion Designer',
    description: 'Visual artist and motion designer specializing in 3D animation, visual storytelling, and cinematic motion.',
    creator: '@alperenborklu',
    // Önceki hatayı düzelttiğimiz kısım (Array yapısı)
    images: ['/assets/mezuniyet.jpg'], 
  },
  
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
    shortcut: '/assets/mezuniyet.jpg',
    apple: '/assets/mezuniyet.jpg',
  },
};

// 2. EKLENTİ: ChatGPT ve Google için Yapılandırılmış Veri (JSON-LD Schema)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alperen Börklü",
  "url": "https://alperenborklu.com",
  "image": "https://alperenborklu.com/assets/mezuniyet.jpg",
  "jobTitle": "Visual Artist & Motion Designer",
  "description": "Visual artist and motion designer blending cinematic storytelling with structural design in 3D animation and art direction.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Ankara",
    "addressCountry": "TR"
  },
  "sameAs": [
    "https://www.instagram.com/alperenbarkley/",
    "https://www.linkedin.com/in/alperen-b%C3%B6rkl%C3%BC-47198112a/",
    "https://www.youtube.com/@alperenborklu4005"
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Script'ini sayfaya gömüyoruz */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#080808] text-white antialiased`}>
        <Header />
        {/* Ana sayfa içeriği */}
        <main className="min-h-screen relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}