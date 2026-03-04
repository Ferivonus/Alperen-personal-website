'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sayfa kaydırma efekti
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Writings', href: '#blog' },
    { name: 'Resume', href: '#resume' },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        scrolled 
          ? 'py-4 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg' 
          : 'py-6 bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        
        {/* Sol Taraf: Logo */}
        <Link 
          href="/" 
          className="text-xl font-bold font-playfair tracking-widest text-white relative z-50 hover:text-zinc-300 transition-colors"
        >
          ALPEREN
        </Link>

        {/* Orta & Sağ Taraf: Masaüstü Menü */}
        <nav className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Menü ile buton arasına dikey zarif bir ayrım çizgisi */}
          <div className="w-[1px] h-4 bg-white/20"></div>

          <Link 
            href="#contact" 
            className="text-[11px] font-bold uppercase tracking-[0.15em] bg-white text-black px-6 py-2.5 rounded-full hover:bg-zinc-200 hover:scale-105 transition-all duration-300"
          >
            Let&apos;s Talk
          </Link>
        </nav>

        {/* Mobil Menü Butonu */}
        <button 
          className="md:hidden text-white z-50 p-2 -mr-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 flex flex-col items-end gap-1.5">
            <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-[8px]' : 'w-6'}`}></span>
            <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`}></span>
            <span className={`h-[2px] bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-[8px]' : 'w-5'}`}></span>
          </div>
        </button>
      </div>

      {/* Mobil Açılır Menü */}
      <div 
        className={`md:hidden absolute top-0 left-0 w-full bg-zinc-950 border-b border-white/10 shadow-2xl transition-all duration-500 ease-out flex flex-col ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="pt-24 pb-8 px-6 flex flex-col space-y-6 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Link 
              href="#contact" 
              onClick={() => setIsOpen(false)}
              className="inline-block text-xs font-bold uppercase tracking-[0.15em] bg-white text-black px-8 py-3 rounded-full mt-2"
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}