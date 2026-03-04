'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { works, brands, testimonials, blogPosts } from '@/lib/data';

type BlogType = { title: string, content: string, category: string };

// --- GÜVENLİ HTML PARSER ---
const renderSafeHTML = (htmlString: string) => {
  const blockRegex = /<(h3|p|ul)>([\s\S]*?)<\/\1>/g;
  const elements = [];
  let match;
  let i = 0;

  const parseStrong = (text: string) => {
    return text.split(/(<strong>[\s\S]*?<\/strong>)/).map((part, idx) => {
      if (part.startsWith('<strong>')) {
        return <strong key={idx} className="text-zinc-200 font-medium">{part.replace(/<\/?strong>/g, '')}</strong>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  while ((match = blockRegex.exec(htmlString)) !== null) {
    const tag = match[1];
    const innerContent = match[2];

    if (tag === 'h3') {
      elements.push(<h3 key={i++} className="text-2xl font-medium text-white mt-12 mb-4 font-playfair">{innerContent}</h3>);
    } else if (tag === 'p') {
      elements.push(<p key={i++} className="mb-6 leading-relaxed font-light text-zinc-400">{parseStrong(innerContent)}</p>);
    } else if (tag === 'ul') {
      const liRegex = /<li>([\s\S]*?)<\/li>/g;
      const listItems = [];
      let liMatch;
      let j = 0;
      while ((liMatch = liRegex.exec(innerContent)) !== null) {
        listItems.push(<li key={j++} className="mb-3">{parseStrong(liMatch[1])}</li>);
      }
      elements.push(<ul key={i++} className="list-disc pl-6 mb-6 space-y-3 font-light text-zinc-400">{listItems}</ul>);
    }
  }
  return elements;
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxData, setLightboxData] = useState<{src: string, title: string} | null>(null);
  const [activeBlog, setActiveBlog] = useState<BlogType | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  
  const INITIAL_BLOGS = 3;
  const [visibleBlogCount, setVisibleBlogCount] = useState(INITIAL_BLOGS);


  // Pürüzsüz Preloader
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Modal Scroll Kilidi ve ESC ile Kapatma (UX Geliştirmesi)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxData(null);
        setIsQuoteModalOpen(false);
        setActiveBlog(null);
      }
    };

    if (lightboxData || isQuoteModalOpen || activeBlog) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxData, isQuoteModalOpen, activeBlog]);

  // Scroll Reveal Animasyonu (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
            observer.unobserve(entry.target); // Bir kere çalışsın
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isLoading, visibleBlogCount]);

  const handleOpenQuoteModal = (packageName: string) => {
    setSelectedPackage(packageName);
    setIsQuoteModalOpen(true);
  };

  const handleShowMoreBlogs = () => {
    setVisibleBlogCount((prev) => Math.min(prev + 3, blogPosts.length));
  };

  const isAllBlogsVisible = visibleBlogCount >= blogPosts.length;

  return (
    <div className="relative flex flex-col pb-24 text-foreground bg-background font-sans selection:bg-primary selection:text-black overflow-x-hidden">

      {/* SİNEMATİK GRAIN (NOISE) */}
      <div className="pointer-events-none fixed inset-0 z-[40] opacity-[0.03] mix-blend-screen bg-noise"></div>

      {/* --- PRELOADER --- */}
      <div className={`fixed inset-0 z-[1000] bg-background flex items-center justify-center transition-all duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isLoading ? 'opacity-100 visible scale-105' : 'opacity-0 invisible pointer-events-none scale-100'}`}>
        <div className="text-primary text-sm md:text-base font-bold tracking-[0.5em] uppercase overflow-hidden">
          <span className="inline-block animate-pulse">Alperen Börklü</span>
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      <div className={`fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl transition-all duration-700 ease-out cursor-zoom-out ${lightboxData ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setLightboxData(null)}>
        <button className="absolute top-8 right-10 text-white/30 hover:text-primary text-4xl transition-colors duration-300 font-light">&times;</button>
        {lightboxData && (
          <>
            <div className="relative w-full max-w-6xl h-[80vh] transform transition-transform duration-700 ease-out scale-100">
              <Image src={lightboxData.src} alt={lightboxData.title} fill sizes="(max-width: 1200px) 100vw, 1200px" className="object-contain drop-shadow-[0_0_60px_rgba(192,160,98,0.15)]" />
            </div>
            <div className="mt-8 text-primary text-sm font-bold tracking-[0.3em] uppercase opacity-90">
              {lightboxData.title}
            </div>
          </>
        )}
      </div>

      {/* --- QUOTE (TEKLİF İSTE) MODAL --- */}
      <div className={`fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-md transition-all duration-500 overflow-y-auto ${isQuoteModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setIsQuoteModalOpen(false)}>
        <div 
          className={`bg-[#0a0a0a] border border-primary/20 p-10 md:p-16 rounded-sm max-w-2xl w-full relative shadow-[0_0_100px_rgba(192,160,98,0.05)] cursor-auto transition-all duration-700 my-auto ${isQuoteModalOpen ? 'translate-y-0 scale-100' : 'translate-y-12 scale-95'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="absolute top-8 right-10 text-zinc-600 hover:text-primary text-4xl font-light transition-colors" onClick={() => setIsQuoteModalOpen(false)}>&times;</button>
          
          <h2 className="text-4xl font-medium mb-3 text-white font-playfair tracking-wide">Request Quote</h2>
          <p className="text-primary mb-12 font-light text-xs tracking-[0.3em] uppercase">Let&apos;s build something real.</p>
          
          <form action="https://formsubmit.co/hello@alperenborklu.com" method="POST" className="space-y-10">
            <input type="hidden" name="_subject" value={`New Quote Request: ${selectedPackage} Package`} />
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative group">
                <input type="text" id="quote-name" name="name" placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-3 text-white focus:outline-none focus:border-primary transition-colors peer rounded-none text-sm" />
                <label htmlFor="quote-name" className="absolute left-0 top-3 text-zinc-600 text-sm transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Your Name</label>
              </div>
              <div className="relative group">
                <input type="email" id="quote-email" name="email" placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-3 text-white focus:outline-none focus:border-primary transition-colors peer rounded-none text-sm" />
                <label htmlFor="quote-email" className="absolute left-0 top-3 text-zinc-600 text-sm transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Email Address</label>
              </div>
            </div>

            <div className="relative group">
              <input type="text" id="quote-package" name="package" value={selectedPackage} readOnly className="block w-full bg-transparent border-b border-zinc-800 py-3 text-primary font-medium focus:outline-none rounded-none text-sm" />
              <label htmlFor="quote-package" className="absolute left-0 -top-5 text-[10px] tracking-[0.2em] uppercase text-primary pointer-events-none">Selected Service</label>
            </div>

            <div className="relative group">
              <textarea id="quote-message" name="message" rows={4} placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-3 text-white focus:outline-none focus:border-primary transition-colors peer resize-none rounded-none text-sm"></textarea>
              <label htmlFor="quote-message" className="absolute left-0 top-3 text-zinc-600 text-sm transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.2em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Project Details</label>
            </div>

            <button type="submit" className="w-full relative group overflow-hidden border border-primary bg-transparent text-primary font-bold py-5 text-xs tracking-[0.3em] uppercase transition-colors duration-300 rounded-sm mt-4">
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Send Request</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"></div>
            </button>
          </form>
        </div>
      </div>

      {/* --- BLOG MODAL --- */}
      <div className={`fixed inset-0 z-[100] bg-background/95 flex items-center justify-center p-4 md:p-8 backdrop-blur-md overflow-y-auto transition-all duration-500 ${activeBlog ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setActiveBlog(null)}>
        {activeBlog && (
          <div 
            className={`bg-[#0a0a0a] border border-primary/20 p-10 md:p-20 rounded-sm max-w-4xl w-full relative my-auto shadow-2xl cursor-auto transition-all duration-700 ${activeBlog ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-8 right-10 text-zinc-600 hover:text-primary text-4xl font-light transition-colors" onClick={() => setActiveBlog(null)}>&times;</button>
            <p className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-8">{activeBlog.category}</p>
            <h2 className="text-4xl md:text-6xl font-medium mb-16 text-white font-playfair tracking-tight leading-[1.1]">{activeBlog.title}</h2>
            
            <div className="text-zinc-400">
              {renderSafeHTML(activeBlog.content)}
            </div>
          </div>
        )}
      </div>

      {/* --- YENİ HERO SECTION (Asimetrik & Editoryal) --- */}
      <section id="hero" className="max-w-7xl mx-auto px-6 w-full min-h-[90vh] md:min-h-screen flex flex-col lg:flex-row items-center justify-between relative pt-32 pb-20 overflow-hidden">
        
        {/* Ortam Işığı (Sağ tarafa doğru kaydırıldı) */}
        <div className="absolute top-1/2 left-1/2 lg:left-3/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.04] blur-[150px] rounded-full pointer-events-none"></div>

        {/* Sol Kısım: Dev Tipografi ve CTA */}
        <div className="z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 delay-200 ease-out">
          <p className="text-primary font-bold tracking-[0.5em] uppercase text-[10px] mb-6 md:mb-8">Visual Artist</p>
          <h1 className="text-6xl md:text-[6rem] lg:text-[7.5rem] font-playfair font-normal tracking-tight text-white leading-[1.05] mb-8 drop-shadow-2xl">
            Hello, <br className="hidden lg:block" />
            <span className="italic text-primary pr-2">I&apos;m Alperen.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 font-light tracking-wide max-w-md">
            I turn pixels into stories.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center lg:justify-start">
            <Link href="https://www.youtube.com/watch?v=v-fPkuxrqN4" target="_blank" className="relative group overflow-hidden border border-primary px-12 py-5 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] text-primary transition-colors duration-500 w-full sm:w-auto text-center">
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Watch Showreel</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"></div>
            </Link>
            <Link href="#work" className="border border-white/20 text-white px-12 py-5 rounded-sm text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors duration-500 w-full sm:w-auto text-center">
              View Works
            </Link>
          </div>
        </div>

        {/* Sağ Kısım: Editoryal Afiş (Görsel) */}
        <div className="z-10 w-full lg:w-1/2 flex justify-center lg:justify-end mt-20 lg:mt-0 reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="relative w-[85%] sm:w-[65%] lg:w-[80%] xl:w-[75%] aspect-[3/4] rounded-sm overflow-hidden border border-primary/20 shadow-[0_0_80px_rgba(192,160,98,0.1)] group">
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply group-hover:bg-transparent transition-colors duration-1000 z-10"></div>
            <Image src="/assets/mezuniyet.jpg" alt="Alperen Börklü" fill sizes="(max-width: 1024px) 80vw, 40vw" className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-105" priority />
          </div>
        </div>

        {/* Lüks Scroll Indicator (Masaüstünde sol altta, Mobilde gizli/akışta) */}
        <div className="absolute bottom-10 left-6 hidden lg:flex flex-col items-center gap-4 opacity-50 z-10 reveal-on-scroll opacity-0 transition-all duration-1000 delay-500 ease-out">
          <span className="text-[8px] tracking-[0.4em] uppercase text-primary font-bold writing-vertical-rl">Scroll</span>
          <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
            <div className="w-full h-full bg-primary absolute top-0 left-0 animate-scroll-line"></div>
          </div>
        </div>
      </section>

      {/* --- WORK SECTION --- */}
      <section id="work" className="py-32 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center justify-center mb-24 text-center reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Portfolio</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">Selected Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work, index) => (
            <div 
              key={index} 
              className="group relative aspect-[4/5] bg-[#0a0a0a] overflow-hidden cursor-zoom-in rounded-sm reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
              onClick={() => setLightboxData({ src: work.src, title: work.title })}
            >
              <Image src={work.src} alt={work.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-60 group-hover:opacity-100 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-10">
                <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-out">
                  <h3 className="text-2xl font-medium text-white font-playfair mb-3">{work.title}</h3>
                  <p className="text-[9px] text-primary font-bold uppercase tracking-[0.3em]">{work.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <section id="about" className="py-32 max-w-7xl mx-auto px-6 w-full border-t border-white/5 reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Philosophy</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">The Artist</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <span className="absolute -top-10 -left-6 text-[8rem] font-playfair text-primary opacity-20 leading-none">&ldquo;</span>
            <h3 className="text-3xl md:text-5xl font-playfair text-white leading-tight font-medium relative z-10">
              Rather than following trends, I focus on building distinctive visual identities that feel <span className="text-primary italic">intentional and lasting.</span>
            </h3>
          </div>
          
          <div className="space-y-8 text-zinc-400 leading-relaxed text-lg font-light">
            <p>I&apos;m a visual storyteller working at the intersection of film, design, and strategy. My background spans 2D–3D animation, directing, and post-production, with a strong focus on atmosphere, rhythm, and meaning. I approach every project as both a creative and a system — balancing emotion with structure.</p>
            <p>I&apos;ve worked across short films, documentaries, commercials, and personal projects, taking on roles from concept development to final delivery. Storyboarding, visual language, and narrative clarity are at the core of how I work.</p>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-32 max-w-7xl mx-auto px-6 w-full border-t border-white/5 bg-[#0a0a0a] reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Referrals</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">Client Reviews</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {testimonials.map((review, index) => (
            <div key={index} className="break-inside-avoid bg-[#0f0f0f] p-10 rounded-sm border border-white/5 hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 group shadow-lg">
              <div className="text-primary text-xs mb-6 tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-opacity">★★★★★</div>
              <p className="text-zinc-400 text-sm font-light leading-loose mb-8 italic">&quot;{review.text}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-8 h-[1px] bg-primary/40 group-hover:w-12 transition-all duration-500"></div>
                <p className="text-white font-bold text-[9px] uppercase tracking-[0.3em]">{review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BRANDS SECTION --- */}
      <section id="brands" className="py-32 w-full relative border-y border-white/5 bg-[#080808] reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-96 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-96 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 w-full mb-20 text-center z-20 relative">
          <h2 className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary">Collaborations & Trust</h2>
        </div>
        <div className="w-full overflow-hidden flex">
          <div className="animate-marquee gap-32 items-center px-8 opacity-30 hover:opacity-100 transition-opacity duration-700">
            {[...brands, ...brands, ...brands, ...brands, ...brands].map((brand, index) => (
              <div key={index} className="relative w-40 h-16 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-700">
                <Image src={brand.src} alt={brand.name} fill sizes="160px" className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-32 max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col items-center justify-center mb-24 text-center reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Investment</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">Services</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic */}
          <div className="bg-[#0a0a0a] rounded-sm p-14 border border-white/5 flex flex-col hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 reveal-on-scroll opacity-0 translate-y-12 ease-out" style={{ transitionDelay: '0ms' }}>
            <h3 className="text-2xl font-medium text-white mb-3 font-playfair">Basic</h3>
            <div className="text-5xl font-light text-zinc-300 mb-6">$500</div>
            <p className="text-zinc-500 mb-12 text-sm font-light leading-relaxed">Perfect for social media content and simple loops.</p>
            <ul className="space-y-6 mb-16 flex-1 text-sm text-zinc-400 font-light">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> 1x 3D Loop or Still Render</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Up to 10 Seconds</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> 1080p Resolution</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> 1 Revision Round</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Standard Delivery (5 Days)</li>
            </ul>
            <button onClick={() => handleOpenQuoteModal('Basic')} className="w-full py-5 border border-white/10 text-white text-[10px] tracking-[0.3em] font-bold uppercase hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm">Request Quote</button>
          </div>

          {/* Standard */}
          <div className="bg-[#0f0f0f] rounded-sm p-14 border border-primary/50 flex flex-col relative shadow-[0_0_60px_rgba(192,160,98,0.08)] transform lg:-translate-y-6 z-10 reveal-on-scroll opacity-0 translate-y-12 ease-out" style={{ transitionDelay: '150ms' }}>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-black px-8 py-2.5 text-[9px] font-bold uppercase tracking-[0.3em] rounded-sm">Most Popular</div>
            <h3 className="text-2xl font-medium text-white mb-3 mt-4 font-playfair">Standard</h3>
            <div className="text-6xl font-light text-primary mb-6">$1,000</div>
            <p className="text-zinc-400 mb-12 text-sm font-light leading-relaxed">Ideal for product reveals and brand intros.</p>
            <ul className="space-y-6 mb-16 flex-1 text-sm text-zinc-300 font-light">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 15-30 Second Animation</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 3D Modeling & Texturing</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 4K Resolution</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Sound Design Included</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> 2 Revision Rounds</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full"></span> Commercial Rights</li>
            </ul>
            <button onClick={() => handleOpenQuoteModal('Standard')} className="w-full py-5 bg-primary text-black text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-white transition-colors duration-300 rounded-sm">Request Quote</button>
          </div>

          {/* Gold */}
          <div className="bg-[#0a0a0a] rounded-sm p-14 border border-white/5 flex flex-col hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 reveal-on-scroll opacity-0 translate-y-12 ease-out" style={{ transitionDelay: '300ms' }}>
            <h3 className="text-2xl font-medium text-white mb-3 font-playfair">Gold</h3>
            <div className="text-5xl font-light text-zinc-300 mb-6">$2,000</div>
            <p className="text-zinc-500 mb-12 text-sm font-light leading-relaxed">Cinematic quality for diverse campaigns.</p>
            <ul className="space-y-6 mb-16 flex-1 text-sm text-zinc-400 font-light">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Up to 60 Sec Premium Animation</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Complex Simulations</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Full Campaign Assets</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Source Files Included</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Priority Support</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-primary rounded-full opacity-70"></span> Unlimited Revisions</li>
            </ul>
            <button onClick={() => handleOpenQuoteModal('Gold')} className="w-full py-5 border border-white/10 text-white text-[10px] tracking-[0.3em] font-bold uppercase hover:border-primary hover:text-primary transition-colors duration-300 rounded-sm">Request Quote</button>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="py-32 max-w-7xl mx-auto px-6 w-full bg-[#0a0a0a] rounded-3xl reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Insights</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">Writings</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blogPosts.slice(0, visibleBlogCount).map((blog, index) => (
            <div 
              key={index} 
              className="group bg-[#080808] p-12 rounded-sm border border-white/5 hover:border-primary/40 cursor-pointer transition-all duration-500 flex flex-col hover:-translate-y-2 shadow-lg"
              onClick={() => setActiveBlog(blog)}
            >
              <span className="text-[9px] text-zinc-500 font-bold tracking-[0.3em] uppercase mb-8 block group-hover:text-primary transition-colors">{blog.category}</span>
              <h3 className="text-3xl font-medium text-white mb-6 line-clamp-2 font-playfair leading-tight">{blog.title}</h3>
              
              <div className="text-zinc-500 text-sm mb-10 line-clamp-3 flex-1 font-light leading-loose pointer-events-none">
                {renderSafeHTML(blog.content)}
              </div>
              
              <div className="flex items-center gap-5 mt-auto opacity-50 group-hover:opacity-100 transition-opacity">
                <span className="w-8 h-[1px] bg-primary"></span>
                <span className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase">Read Article</span>
              </div>
            </div>
          ))}
        </div>

        {!isAllBlogsVisible && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <button 
              onClick={handleShowMoreBlogs}
              className="group flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white hover:text-primary transition-colors duration-300"
            >
              Load More Articles
              <span className="w-10 h-[1px] bg-white group-hover:bg-primary transition-colors"></span>
            </button>
          </div>
        )}
      </section>

      {/* --- RESUME SECTION --- */}
      <section id="resume" className="py-32 max-w-7xl mx-auto px-6 w-full border-t border-white/5 mt-16 reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="flex flex-col items-center justify-center mb-24 text-center">
          <div className="w-[1px] h-16 bg-primary/50 mb-8"></div>
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-6">Background</span>
          <h2 className="text-4xl md:text-6xl font-medium font-playfair text-white tracking-tight">Resume</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-24">
          <div className="flex flex-col space-y-16">
            <div className="w-full aspect-[3/4] relative grayscale hover:grayscale-0 transition-all duration-[1.5s] rounded-sm overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(192,160,98,0.05)]">
              <Image src="/assets/mezuniyet.jpg" alt="Alperen" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
            </div>
            <div>
              <h3 className="text-3xl font-medium text-white mb-3 font-playfair">ALPEREN BÖRKLÜ</h3>
              <p className="text-[10px] text-primary tracking-[0.4em] uppercase font-bold">Visual Artist</p>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-zinc-600 mb-6 tracking-[0.4em] uppercase">Contact</h4>
              <div className="space-y-4 text-sm text-zinc-300 font-light tracking-wide">
                <p>HELLO@ALPERENBORKLU.COM</p>
                <p>+90 544 285 99 15</p>
                <p>ALPERENBORKLU.COM</p>
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-zinc-600 mb-6 tracking-[0.4em] uppercase">Education</h4>
              <div className="space-y-2 text-sm text-zinc-300 font-light tracking-wide">
                <p className="text-white font-medium">METU</p>
                <p>Industrial Design</p>
                <p className="text-primary pt-2 text-xs font-medium tracking-widest">Class of &apos;21</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-24 pt-10 lg:pt-0">
            <div>
              <h4 className="text-[9px] font-bold text-zinc-600 mb-8 tracking-[0.4em] uppercase border-b border-white/5 pb-4">Profile</h4>
              <p className="text-zinc-300 leading-relaxed text-2xl font-light font-playfair italic">
                Motion designer and CG generalist specializing in animation, visual storytelling, and cinematic motion. Bringing a structural design thinking approach to emotional visual narratives.
              </p>
            </div>

            <div>
              <h4 className="text-[9px] font-bold text-zinc-600 mb-10 tracking-[0.4em] uppercase border-b border-white/5 pb-4">Experience</h4>
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:gap-12 group">
                  <h5 className="text-xl font-medium text-white min-w-[220px] font-playfair mb-3 md:mb-0 group-hover:text-primary transition-colors">AUTODESK</h5>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">Integrated Fusion 360 software into the curricula of METU and multiple other universities, bridging the gap between academic theory and practical 3D application.</p>
                </div>
                <div className="flex flex-col md:flex-row md:gap-12 group">
                  <h5 className="text-xl font-medium text-white min-w-[220px] font-playfair mb-3 md:mb-0 group-hover:text-primary transition-colors">KREATIN STUDIO</h5>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">Character Design & Animation focused on breathing life and personality into digital models.</p>
                </div>
                <div className="flex flex-col md:flex-row md:gap-12 group">
                  <h5 className="text-xl font-medium text-white min-w-[220px] font-playfair mb-3 md:mb-0 group-hover:text-primary transition-colors">ADVER AJANS</h5>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">Full-spectrum creative experience within a 360-degree agency environment, understanding client needs from conception to execution.</p>
                </div>
                <div className="flex flex-col md:flex-row md:gap-12 group">
                  <h5 className="text-xl font-medium text-white min-w-[220px] font-playfair mb-3 md:mb-0 group-hover:text-primary transition-colors">FREELANCE</h5>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">Delivered wide-ranging projects from TRT documentaries to Ministry of Trade campaigns, focusing heavily on CG and lighting art direction.</p>
                </div>
                <div className="flex flex-col md:flex-row md:gap-12 group">
                  <h5 className="text-xl font-medium text-white min-w-[220px] font-playfair mb-3 md:mb-0 group-hover:text-primary transition-colors">DIRECTOR</h5>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">Directed 8 short films, earning official selections in over 20 international film festivals.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[9px] font-bold text-zinc-600 mb-8 tracking-[0.4em] uppercase border-b border-white/5 pb-4">Key Skills</h4>
              <ul className="space-y-6 text-zinc-300 text-base font-light">
                <li className="flex items-start gap-6">
                  <span className="text-primary mt-1.5 text-xs">◆</span>
                  <span>Exceptional attention to detail (never misses subtitles).</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="text-primary mt-1.5 text-xs">◆</span>
                  <span>Strong understanding of narrative boundaries and cinematic language.</span>
                </li>
                <li className="flex items-start gap-6">
                  <span className="text-primary mt-1.5 text-xs">◆</span>
                  <span>I prioritize meaningful work over short-term gains.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-40 max-w-7xl mx-auto px-6 w-full border-t border-white/5 mt-20 reveal-on-scroll opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary mb-8">Inquiries</span>
          <h2 className="text-6xl md:text-8xl font-medium mb-16 text-white font-playfair tracking-tight text-center leading-none">
            Let&apos;s build <br/>
            <span className="italic text-zinc-600 font-light">something real.</span>
          </h2>
          
          <form action="https://formsubmit.co/hello@alperenborklu.com" method="POST" className="w-full space-y-12 mt-10">
            <input type="hidden" name="_subject" value="New Portfolio Contact" />
            <input type="hidden" name="_captcha" value="false" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="relative group">
                <input type="text" id="name" name="name" placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-4 text-white focus:outline-none focus:border-primary transition-colors peer rounded-none text-base" />
                <label htmlFor="name" className="absolute left-0 top-4 text-zinc-600 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.3em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Your Name</label>
              </div>
              <div className="relative group">
                <input type="email" id="email" name="email" placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-4 text-white focus:outline-none focus:border-primary transition-colors peer rounded-none text-base" />
                <label htmlFor="email" className="absolute left-0 top-4 text-zinc-600 text-sm transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.3em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Email Address</label>
              </div>
            </div>

            <div className="relative group pt-4">
              <textarea id="message" name="message" rows={5} placeholder=" " required className="block w-full bg-transparent border-b border-zinc-800 py-4 text-white focus:outline-none focus:border-primary transition-colors peer resize-none rounded-none text-base"></textarea>
              <label htmlFor="message" className="absolute left-0 top-8 text-zinc-600 text-sm transition-all peer-focus:-top-2 peer-focus:text-[10px] peer-focus:tracking-[0.3em] peer-focus:uppercase peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:tracking-[0.3em] peer-[:not(:placeholder-shown)]:uppercase pointer-events-none">Project Details</label>
            </div>

            <div className="pt-16 flex justify-center">
              <button type="submit" className="relative group overflow-hidden border border-primary px-16 py-6 rounded-sm text-[11px] font-bold uppercase tracking-[0.3em] text-primary transition-colors duration-500">
                <span className="relative z-10 group-hover:text-black transition-colors duration-500">Send Message</span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"></div>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}