import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight,
  Menu,
  X,
  Play,
  ArrowUpRight,
  Settings,
  Calculator,
  MessageSquare,
  ChevronUp,
  Maximize,
  Wifi,
  Globe
} from 'lucide-react';

/**
 * CUSTOM HOOK: WHISPER SCROLL REVEAL
 */
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

/**
 * ULTRA-MINIMAL THEMEABLE CURSOR
 */
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(!!e.target.closest('#global-map'));
    };
    
    const handleMouseOver = (e) => {
      const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.closest('.interactive') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('select');
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000] hidden md:block transition-opacity duration-300 cursor-dot"
        style={{ 
          transform: `translate(${position.x - 3}px, ${position.y - 3}px)`,
          opacity: isHidden ? 0 : (isHovering ? 0 : 1)
        }}
      />
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-500 ease-out hidden md:block border cursor-ring ${
          isHovering ? 'w-16 h-16' : 'w-8 h-8 opacity-0'
        }`}
        style={{ 
          transform: `translate(${position.x - (isHovering ? 32 : 16)}px, ${position.y - (isHovering ? 32 : 16)}px)`,
          opacity: isHidden ? 0 : undefined
      }}
    />
  </>
);
};

/**
 * PRELOADER COMPONENT
 */
const Preloader = ({ finishLoading }) => {
const [opacity, setOpacity] = useState(1);

useEffect(() => {
  const timer1 = setTimeout(() => setOpacity(0), 1500); // Start fade out
  const timer2 = setTimeout(() => finishLoading(), 2000); // Unmount
  return () => { clearTimeout(timer1); clearTimeout(timer2); };
}, [finishLoading]);

return (
  <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out" style={{ opacity }}>
    <div className="relative flex flex-col items-center">
       <img src="https://static.wixstatic.com/media/745981_5cb5b3705132499081e24b12f5f4b3d4~mv2.png" alt="Events & Pro" className="h-10 md:h-14 invert brightness-0 mb-8 animate-pulse" />
       <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-white/60 animate-marquee w-1/2"></div>
       </div>
       <p className="font-sans text-[8px] tracking-[0.4em] uppercase text-white/40 mt-6">Initializing Ecosystem</p>
    </div>
  </div>
);
};

/**
 * DYNAMIC META COMPONENT (AIO & GEO OPTIMIZATION)
 */
const DynamicMeta = ({ title, description, keywords, schema }) => {
  useEffect(() => {
    if (title) document.title = `${title} | Events & Pro`;
    
    const setMeta = (name, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[name="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta('description', description);
    if (keywords) setMeta('keywords', keywords);

    if (schema) {
      let script = document.querySelector('script[data-dynamic-schema]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-dynamic-schema', 'true');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }

    return () => {
      const script = document.querySelector('script[data-dynamic-schema]');
      if (script) script.remove();
    };
  }, [title, description, keywords, schema]);

  return null;
};

/**
 * GLOBAL FAQ COMPONENT (AIO & GEO OPTIMIZED)
 */
const PageFAQ = ({ pageType }) => {
  const [activeFaq, setActiveFaq] = useState(null);

  const faqsData = {
    home: [
      { q: "What is your minimum engagement scope?", a: "We specialize in grand-scale and corporate events. While we do not have a strict financial minimum, our engagements typically begin with complex spatial or logistical requirements." },
      { q: "Do you execute international MICE commissions?", a: "Yes. With a robust network of global logistics partners and our core nodes across major cities, we have seamlessly executed corporate events worldwide." }
    ],
    about: [
      { q: "When was Events & Pro founded?", a: "We were established in 2017 with a focus on high-end corporate engagements and experiential tech." },
      { q: "Do you operate under strict NDAs?", a: "Absolute discretion is a cornerstone of our philosophy. We routinely operate under strict Non-Disclosure Agreements for our high-profile corporate elite clientele." }
    ],
    solutions: [
      { q: "What experiential tech do you provide?", a: "We offer AR/VR activations, hybrid streaming nodes, kinetic LED architecture, and dynamic stage technology." },
      { q: "Can you handle 5,000+ delegate conferences?", a: "Yes, infinite scale is one of our core pillars. We have architected summits for up to 15,000 attendees." }
    ],
    intelligence: [
      { q: "How accurate is the budget estimator?", a: "It provides a highly accurate baseline based on current Indian corporate market rates, though final proposals require a detailed consultation." },
      { q: "How do you calculate Carbon Footprints?", a: "We utilize advanced Scope 3 emission tracking including delegate travel, venue energy standards, and material lifecycle waste." }
    ]
  };

  const faqs = faqsData[pageType] || faqsData.home;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="py-24 bg-[#0a0a0a] border-t border-white/5 px-[3vw] w-full">
      <DynamicMeta schema={schema} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Frequently Asked Questions</h3>
        </div>
        <div className="flex flex-col border-t border-white/10">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/10 overflow-hidden interactive" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
              <div className="py-6 flex justify-between items-center cursor-none">
                <h4 className={`text-sm md:text-base font-wide font-extralight uppercase tracking-[0.05em] transition-colors duration-300 pr-8 ${activeFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</h4>
                <div className="text-white/40 font-mono text-xl font-light">{activeFaq === i ? '−' : '+'}</div>
              </div>
              <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-64 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * GLOBAL MAP COMPONENT
 */
const GlobalMap = () => {
return (
  <div className="w-full aspect-[16/9] lg:aspect-[21/9] bg-[#0a0a0a] rounded-3xl border border-white/5 relative overflow-hidden group interactive mb-12 shadow-2xl">
    <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-70 transition-opacity duration-1000">
       <svg width="100%" height="100%" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="800" height="400" fill="transparent" />
          
          <circle cx="280" cy="180" r="2.5" fill="#ffffff" />
          <circle cx="280" cy="180" r="10" stroke="#ffffff" strokeWidth="0.5" className="animate-ping" style={{animationDuration: '3s'}} />
          
          <circle cx="580" cy="140" r="2.5" fill="#ffffff" />
          <circle cx="580" cy="140" r="10" stroke="#ffffff" strokeWidth="0.5" className="animate-ping" style={{animationDuration: '3s', animationDelay: '1s'}} />
          
          <circle cx="620" cy="190" r="2.5" fill="#ffffff" />
          <circle cx="620" cy="190" r="10" stroke="#ffffff" strokeWidth="0.5" className="animate-ping" style={{animationDuration: '3s', animationDelay: '0.5s'}} />
          
          <circle cx="450" cy="100" r="2.5" fill="#ffffff" />
          <circle cx="450" cy="100" r="10" stroke="#ffffff" strokeWidth="0.5" className="animate-ping" style={{animationDuration: '3s', animationDelay: '1.5s'}} />
          
          <path d="M280 180 Q 430 80 580 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M580 140 Q 600 165 620 190" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M450 100 Q 515 120 580 140" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M280 180 Q 365 140 450 100" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
       </svg>
    </div>
    <div className="absolute bottom-8 left-8">
       <span className="font-sans text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-white/40 block mb-2">Network Status</span>
       <span className="font-wide text-sm md:text-lg text-white font-light tracking-[0.2em] uppercase">All Nodes Operational</span>
    </div>
  </div>
);
};

/* ==========================================================================
   HOME PAGE COMPONENTS
   ========================================================================== */

const Hero = ({ setCurrentPage }) => {
  const [idx1, setIdx1] = useState(0);
  const [idx2, setIdx2] = useState(0);
  const [idx3, setIdx3] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const base1 = ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600"];
  const base2 = ["https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=1600"];
  const base3 = ["https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1600", "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=1600"];

  const col1Images = [...base1, ...base1, ...base1, ...base1];
  const col2Images = [...base2, ...base2, ...base2, ...base2];
  const col3Images = [...base3, ...base3, ...base3, ...base3];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const i1 = setInterval(() => setIdx1(prev => (prev < col1Images.length - 1 ? prev + 1 : prev)), 5000);
    const i2 = setInterval(() => setIdx2(prev => (prev < col2Images.length - 1 ? prev + 1 : prev)), 7000);
    const i3 = setInterval(() => setIdx3(prev => (prev < col3Images.length - 1 ? prev + 1 : prev)), 9000);

    setTimeout(() => setIdx1(1), 1500);
    setTimeout(() => setIdx2(1), 3500);
    setTimeout(() => setIdx3(1), 5500);

    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); };
  }, [col1Images.length, col2Images.length, col3Images.length]);

  return (
    <section className="relative h-screen w-full bg-[#050505] overflow-hidden">
      <div className={`hidden md:flex absolute inset-0 w-full h-full z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-1/3 h-full overflow-hidden border-r border-white/5">
          <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(-${idx1 * 100}vh)` }}>
            {col1Images.map((img, i) => (
              <div key={`c1-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate Event" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-1/3 h-full overflow-hidden border-r border-white/5">
          <div className="absolute bottom-0 left-0 w-full flex flex-col-reverse transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(${idx2 * 100}vh)` }}>
            {col2Images.map((img, i) => (
              <div key={`c2-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-3s' }} alt="Tech Summit" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-1/3 h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(-${idx3 * 100}vh)` }}>
            {col3Images.map((img, i) => (
              <div key={`c3-${i}`} className="relative w-full h-screen flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-6s' }} alt="Awards Gala" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`flex md:hidden absolute inset-0 w-full h-full flex-col z-0 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="relative w-full h-1/3 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 left-0 h-full flex transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(-${idx1 * 100}vw)` }}>
            {col1Images.map((img, i) => (
              <div key={`m-c1-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate Event" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full h-1/3 overflow-hidden border-b border-white/5">
          <div className="absolute top-0 right-0 h-full flex flex-row-reverse transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(${idx2 * 100}vw)` }}>
            {col2Images.map((img, i) => (
              <div key={`m-c2-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-3s' }} alt="Tech Summit" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative w-full h-1/3 overflow-hidden">
          <div className="absolute top-0 left-0 h-full flex transition-transform duration-[2500ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateX(-${idx3 * 100}vw)` }}>
            {col3Images.map((img, i) => (
              <div key={`m-c3-${i}`} className="relative w-screen h-full flex-shrink-0 overflow-hidden">
                <img src={img} className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" style={{ animationDelay: '-6s' }} alt="Awards Gala" />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[35vh] bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-10"></div>

      <div className="absolute bottom-0 left-0 z-20 px-[3vw] h-auto md:h-[20vh] flex flex-col lg:flex-row lg:items-end justify-between pb-8 md:pb-12 pointer-events-none gap-6 2xl:gap-12 w-full">
        <div className="flex flex-col justify-end lg:w-[70%] shrink-0">
          <p className={`font-sans text-[8px] md:text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/50 mb-3 md:mb-4 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Top Event Management Companies In India
          </p>
          <h1 className={`font-wide text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-extralight tracking-[0.08em] text-white uppercase leading-none drop-shadow-2xl transition-all duration-1000 delay-500 whitespace-normal xl:whitespace-nowrap ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Events & Pro.
          </h1>
        </div>

        <div className={`flex flex-col lg:w-[25%] gap-5 lg:gap-6 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="font-sans text-[9px] md:text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/70 leading-relaxed">
            Crafting experiential events since 2017. Specializing strictly in <span className="text-white font-medium">Corporate Events</span>, <span className="text-white font-medium">Experiential Tech</span>, and <span className="text-white font-medium">Awards Functions</span>.
          </p>
          <button onClick={() => setCurrentPage('contact')} className="pointer-events-auto interactive px-8 py-3.5 2xl:px-12 2xl:py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[11px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
            Start Your Project
          </button>
        </div>
      </div>
    </section>
  );
};

const Showreel = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] px-[3vw] border-t border-white/5 w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-16">
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">The Motion Archive</p>
          <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
            Cinematic <span className="text-transparent custom-stroke-text font-normal">Synthesis.</span>
          </h2>
        </div>
        <div className="w-full aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10 relative group interactive cursor-none shadow-2xl mx-auto max-w-7xl">
           <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105" alt="Showreel" />
           <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700"></div>
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 2xl:w-28 2xl:h-28 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
             <Play className="text-white w-8 h-8 2xl:w-10 2xl:h-10 ml-2 opacity-90" fill="currentColor" />
           </div>
        </div>
      </div>
    </section>
  );
};

const TheProcess = () => {
  const [ref, isVisible] = useScrollReveal();
  
  const steps = [
    { num: "01", title: "Strategic Vision", desc: "Every engagement begins with deep strategy. We align with your brand's core ethos to engineer a compelling corporate narrative." },
    { num: "02", title: "Experiential Design", desc: "Transforming standard venues into immersive environments using cutting-edge experiential technology, light, and acoustic design." },
    { num: "03", title: "Flawless Execution", desc: "Our logistics operate invisibly. From global summits to MICE programs, microscopic attention ensures the entire experience flows seamlessly." }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-white px-[3vw] w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-black/40 mb-12 border-b border-black/10 pb-3 inline-block">Methodology</p>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-10">
           <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-black leading-[1.1]">
             The <br/>Architecture<br/>of a <span className="font-normal italic">Summit.</span>
           </h2>
           <p className="font-sans text-xs 2xl:text-sm tracking-[0.2em] uppercase text-black/60 max-w-sm leading-relaxed lg:text-right">
             A meticulous, three-phased approach to engineering corporate perfection.
           </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col interactive group cursor-none">
              <span className="text-6xl md:text-8xl font-wide font-thin text-transparent mb-8 transition-all duration-500 group-hover:scale-105 origin-left" style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>
                {step.num}
              </span>
              <h3 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.1em] text-black mb-6">{step.title}</h3>
              <p className="font-sans text-[10px] 2xl:text-[11px] tracking-[0.15em] uppercase text-black/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExpertiseSection = ({ setCurrentPage }) => {
  const sectionRef = useRef(null);
  const clipRef = useRef(null);
  const [textRef, isTextVisible] = useScrollReveal(0.2);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!sectionRef.current || !clipRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start the animation slightly earlier, as the dark section enters the bottom of the viewport
      const triggerPoint = windowHeight; 
      
      if (rect.top > triggerPoint) {
        clipRef.current.style.clipPath = `circle(0% at 50% 50%)`;
      } else {
        const distancePassedTrigger = triggerPoint - rect.top;
        
        // Stretch the animation over a much longer scroll distance to make it slower and smoother
        // It will complete (reach 100% progress) after scrolling down 2.5x the window height
        const totalScrollDistanceForExpansion = windowHeight * 2.5; 
        
        let progress = distancePassedTrigger / totalScrollDistanceForExpansion;
        progress = Math.min(Math.max(progress, 0), 1);
        
        // Custom easing function for a cinematic "slow start, fast burst, slow finish" feel
        const easeInOutCubic = (x) => {
          return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
        };
        
        // Max size is 150% to ensure the circle fully consumes the corners of ultra-wide screens
        const currentSize = easeInOutCubic(progress) * 150;
        
        clipRef.current.style.clipPath = `circle(${currentSize}% at 50% 50%)`;
      }
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    handleScroll(); // Initialization call
    return () => window.removeEventListener('scroll', requestTick);
  }, []);

  const services = [
    { id: "mice", num: "01", title: "Corporate Events & MICE", desc: "Orchestrating high-stakes environments, meetings, incentives, conferences, and exhibitions for global giants. Precision and protocol.", img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600" },
    { id: "tech", num: "02", title: "Experiential Technology", desc: "Pushing the boundaries of reality with AR/VR, virtual, and hybrid events. Engaging audiences anywhere in the world.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600" },
    { id: "awards", num: "03", title: "Awards & Entertainment", desc: "From glamorous award ceremonies to custom intellectual properties and entertainment curation. We celebrate excellence.", img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600" }
  ];

  return (
    <section ref={sectionRef} className="bg-white relative">
      <div 
        ref={clipRef}
        className="w-full bg-[#0a0a0a] will-change-[clip-path]"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      >
        <div className="w-full px-[3vw] py-32 lg:py-48 max-w-[2160px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-24 relative">
            <div className="lg:col-span-5 lg:h-screen lg:sticky top-0 py-12 lg:py-0 flex flex-col justify-center z-10">
              <div ref={textRef} className={`transition-all duration-1000 ${isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Capabilities</p>
                <h2 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.08em] text-white leading-[1.1] break-words">
                  Our <br/> Solutions.
                </h2>
                <p className="mt-8 font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/50 max-w-xs leading-relaxed">
                  Expertise across the spectrum of corporate needs.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 flex flex-col pb-32 lg:pb-48 pt-0 lg:pt-48 gap-32 2xl:gap-48">
              {services.map((srv, idx) => (
                <div key={idx} className="flex flex-col relative group interactive" onClick={() => setCurrentPage(srv.id)}>
                  <div className="w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-3xl border border-white/5 bg-[#050505] relative cursor-pointer">
                    <img src={srv.img} alt={srv.title} className="w-full h-full object-cover grayscale-[40%] animate-subtle-zoom transition-transform duration-[3000ms] group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-700"></div>
                  </div>
                  <div className="mt-8 flex flex-col xl:flex-row xl:items-start justify-between gap-6 xl:gap-12 cursor-pointer">
                    <div className="xl:w-1/2">
                      <span className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.3em] uppercase text-white/40 block mb-3">Solution // {srv.num}</span>
                      <h3 className="text-3xl md:text-4xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-wide font-extralight uppercase tracking-[0.1em] text-white leading-tight group-hover:text-white/80 transition-colors">
                        {srv.title}
                      </h3>
                    </div>
                    <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.15em] uppercase text-white/60 max-w-sm xl:w-1/2 pt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const InfiniteRunway = ({ setCurrentPage }) => {
  const row1Data = [
    { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Global Tech Summit", desc: "A futuristic stage setup for over 5,000 attendees." },
    { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", category: "Awards Function", title: "Industry Excellence Awards", desc: "A glamorous gala celebrating top innovators." },
    { img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800", category: "MICE", title: "Leadership Retreat", desc: "Exclusive off-site networking and strategizing." },
    { img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", category: "Experiential Tech", title: "VR Product Launch", desc: "Immersive brand activation with AR technology." },
    { img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&q=80&w=800", category: "Virtual Events", title: "Hybrid Symposium", desc: "Connecting 10,000 global participants in real-time." }
  ];
  
  const row2Data = [
    { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800", category: "Entertainment Curation", title: "Corporate Showbiz", desc: "World-class talent performing at a corporate gala." },
    { img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Innovators Gala", desc: "An awards night celebrating technological breakthroughs." },
    { img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800", category: "MICE", title: "Executive Symposium", desc: "High-level panel discussions in an immersive venue." },
    { img: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Fintech Convention", desc: "Sleek, ultra-modern staging for banking leaders." },
    { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", category: "Experiential Tech", title: "Future of Mobility", desc: "A breathtaking holographic reveal sequence." }
  ];

  const row3Data = [
    { img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800", category: "MICE", title: "Global Team Building", desc: "Interactive workshops driving corporate synergy." },
    { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", category: "Intellectual Properties", title: "Annual IP Expo", desc: "A custom-designed intellectual property exhibition." },
    { img: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80&w=800", category: "Awards Function", title: "Pinnacle Awards", desc: "Red carpet setup and precision show-calling." },
    { img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800", category: "Corporate Events", title: "Urban Networking", desc: "A rooftop corporate mixer overlooking the skyline." },
    { img: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&q=80&w=800", category: "Experiential Tech", title: "Immersive Exhibition", desc: "Interactive displays and digital art spaces." }
  ];

  const RunwayCard = ({ item, sizingClass }) => (
    <div className={`relative group interactive shrink-0 overflow-hidden rounded-2xl border border-white/5 cursor-none ${sizingClass}`}>
      <img src={item.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" alt={item.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8 2xl:p-10 pointer-events-none">
        <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <span className="font-sans text-[8px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/60 block mb-3">{item.category}</span>
          <h4 className="font-wide text-lg md:text-xl 2xl:text-2xl font-extralight uppercase tracking-[0.05em] text-white mb-3">{item.title}</h4>
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.15em] uppercase text-white/50 line-clamp-2 leading-relaxed">{item.desc}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 2xl:py-32 bg-[#050505] overflow-hidden border-b border-white/5">
      <div className="flex flex-col gap-6 2xl:gap-8">
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee w-max" style={{ animationDuration: '90s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row1Data.map((item, i) => <RunwayCard key={`r1a-${i}`} item={item} sizingClass="w-[70vw] md:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] aspect-[16/9]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row1Data.map((item, i) => <RunwayCard key={`r1b-${i}`} item={item} sizingClass="w-[70vw] md:w-[40vw] xl:w-[30vw] 2xl:w-[25vw] aspect-[16/9]" />)}
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee-reverse w-max" style={{ animationDuration: '110s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row2Data.map((item, i) => <RunwayCard key={`r2a-${i}`} item={item} sizingClass="w-[60vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row2Data.map((item, i) => <RunwayCard key={`r2b-${i}`} item={item} sizingClass="w-[60vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
            </div>
          </div>
        </div>
        <div className="flex w-full overflow-hidden select-none hover-pause">
          <div className="flex animate-marquee w-max" style={{ animationDuration: '100s' }}>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row3Data.map((item, i) => <RunwayCard key={`r3a-${i}`} item={item} sizingClass="w-[65vw] md:w-[38vw] xl:w-[28vw] 2xl:w-[22vw] aspect-[16/10]" />)}
            </div>
            <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
              {row3Data.map((item, i) => <RunwayCard key={`r3b-${i}`} item={item} sizingClass="w-[65vw] md:w-[38vw] xl:w-[28vw] 2xl:w-[22vw] aspect-[16/10]" />)}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-20 px-[3vw]">
         <button onClick={() => setCurrentPage('gallery')} className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors">
           Explore The Corporate Archive
         </button>
      </div>
    </section>
  );
};

const Clientele = () => {
  const [ref, isVisible] = useScrollReveal();
  const brands = ["Microsoft", "Mercedes-Benz", "InnovateTech", "Porsche", "Samsung", "Oracle", "IBM", "Rolex"];
  const [activeTestimonial, setActiveTestimonial] = useState(null);

  const testimonials = [
    { main: "Our corporate gala was a masterpiece. Events & Pro delivered beyond expectations, creating an unforgettable experience for our guests.", highlight: "Truly a top-tier event planning team.", author: "Sarah Thompson, CEO of InnovateTech" },
    { main: "Events & Pro didn't just host our global summit; they completely redefined our brand's physical presence.", highlight: "Absolute perfection.", author: "Global Tech CEO" },
    { main: "A masterclass in spatial architecture and experience design. They brought our tech reveal to life with", highlight: "flawless precision.", author: "VP of Marketing, Global Auto Brand" },
    { main: "They don't just plan events; they engineer memories. An absolute powerhouse in the world of", highlight: "corporate experiences.", author: "Head of Operations, Investment Bank" }
  ];

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * testimonials.length);
    setActiveTestimonial(testimonials[randomIdx]);
  }, []);

  const BrandList = () => (
    <div className="flex items-center">
      {brands.map((brand, i) => (
        <React.Fragment key={i}>
          <span className="whitespace-nowrap">{brand}</span>
          <span className="mx-8 md:mx-16 text-white/30">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] border-t border-white/5 overflow-hidden flex flex-col items-center w-full">
      <div className="w-full overflow-hidden flex z-0 opacity-40 pointer-events-none select-none mb-32 2xl:mb-48">
        <div className="flex animate-marquee w-max items-center text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight tracking-[0.2em] uppercase text-white leading-none" style={{ animationDuration: '120s' }}>
          <BrandList /><BrandList />
        </div>
      </div>
      <div ref={ref} className={`w-full px-[3vw] text-center transition-all duration-1000 ease-out ${isVisible && activeTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex justify-center mb-10">
          <svg className="w-8 h-8 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
        </div>
        <div className="max-w-4xl 2xl:max-w-6xl mx-auto">
          {activeTestimonial && (
            <>
              <h3 className="text-2xl md:text-4xl 2xl:text-5xl font-wide font-extralight leading-[1.5] text-white/90 tracking-wide uppercase">
                "{activeTestimonial.main} <span className="italic font-normal">{activeTestimonial.highlight}</span>"
              </h3>
              <p className="mt-12 text-[9px] 2xl:text-[11px] font-sans tracking-[0.4em] uppercase text-white/40">— {activeTestimonial.author}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in w-full">
      <DynamicMeta 
        title="Premium Corporate Event Management Company" 
        description="Events & Pro is India's leading corporate event agency based in Pune. We engineer MICE, Experiential Tech, and Summit Architecture." 
        keywords="Corporate Events Pune, MICE India, Event Management Company, Experiential Tech Events, Awards Organizers" 
      />
      <Hero setCurrentPage={setCurrentPage} />
      <Showreel />
      <TheProcess />
      <ExpertiseSection setCurrentPage={setCurrentPage} />
      <InfiniteRunway setCurrentPage={setCurrentPage} />
      <Clientele />
      <PageFAQ pageType="home" />
    </div>
  );
};

/* ==========================================================================
   ABOUT PAGE SPECIFIC 
   ========================================================================== */

const OurGenesis = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] px-[3vw] border-b border-white/5 w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-5">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8 border-b border-white/10 pb-3 inline-block">The Genesis</p>
            <h2 className="text-7xl md:text-8xl 2xl:text-[10rem] font-wide font-extralight text-white leading-none">
              20<span className="text-transparent custom-stroke-text">17.</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-end space-y-8 text-sm md:text-base 2xl:text-lg font-sans font-light text-white/60 leading-relaxed max-w-3xl">
            <p>
              Events & Pro was born from a singular obsession: to transcend the mundane in the corporate world. What began as an intimate endeavor to redefine corporate gatherings for blue-chip IT giants quickly evolved into a nationwide movement.
            </p>
            <p>
              We stripped away the excess, focusing relentlessly on spatial architecture, experiential technology, and invisible logistics. Years later, that same obsession drives every blueprint we draw and every atmosphere we curate for top-tier brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const CoreEthos = () => {
  const [ref, isVisible] = useScrollReveal();
  const pillars = [
    { title: "Corporate Protocol", desc: "For our elite corporate clientele, protocol and privacy are paramount. We operate under strict NDAs, ensuring your IP and strategy remain entirely yours." },
    { title: "Microscopic Precision", desc: "Scale means nothing without detail. From the acoustic resonance of a keynote hall to the seamless flow of virtual platforms, we engineer perfection." },
    { title: "Infinite Scale", desc: "Whether orchestrating a highly sensitive boardroom retreat for 50 or a global tech summit for 50,000, our logistical framework scales flawlessly." }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-[3vw] w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-16 md:mb-24 text-center">The Framework</p>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-y border-white/10">
          {pillars.map((pillar, i) => (
            <div key={i} className="py-16 md:py-20 md:px-12 2xl:px-16 flex flex-col group interactive cursor-none">
               <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-6 group-hover:pl-4 transition-all duration-500">{pillar.title}</h3>
               <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TheStudio = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="relative h-[70vh] 2xl:h-[80vh] w-full bg-[#0a0a0a] overflow-hidden flex items-center justify-center px-[3vw] border-y border-white/5">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale opacity-30 animate-subtle-zoom" alt="The Studio" />
        <div className="absolute inset-0 bg-[#050505]/80"></div>
      </div>
      <div ref={ref} className={`relative z-10 text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
         <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">People-First Approach</p>
         <h2 className="text-5xl md:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-none mb-6">
            The Innovation <span className="text-transparent custom-stroke-text font-normal">Lab.</span>
         </h2>
         <p className="font-sans text-xs 2xl:text-sm tracking-[0.2em] uppercase text-white/60 max-w-xl mx-auto leading-relaxed">
           A warm, collaborative team that listens, understands, and brings your corporate ideas to life through experiential technology.
         </p>
      </div>
    </section>
  );
};

const DirectorProfileRedesigned = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] px-[3vw] border-b border-white/5 overflow-hidden w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-end">
          
          <div className="lg:col-span-6 flex flex-col">
            <h3 className="text-5xl md:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-16 leading-[1.1] z-10 relative">
              "Experience <br/> <span className="font-medium text-transparent custom-stroke-text italic">elevated.</span>"
            </h3>
            <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl relative shadow-2xl interactive cursor-none group border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" 
                alt="Corporate Leadership"
                className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 animate-subtle-zoom"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 pb-12 lg:pb-24">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-10 border-b border-white/10 pb-3 inline-block">Our Leadership</p>
            <div className="space-y-8 text-sm md:text-base 2xl:text-lg font-sans font-light text-white/60 leading-relaxed max-w-xl">
              <p>Visionaries in the realm of high-stakes corporate event architecture, bridging an innate passion for brand storytelling with meticulous logistical precision.</p>
              <p>Under this direction, Events & Pro has grown into a national powerhouse, engineering environments that challenge the boundaries of reality and corporate engagement.</p>
              <p>We believe that the finest summits are not merely attended—they are profoundly felt. The true signature of this work lies in the invisible orchestration of perfection.</p>
            </div>
            <div className="mt-16 pt-8 border-t border-white/10 inline-block w-fit">
              <p className="text-white font-sans tracking-[0.3em] uppercase text-xs 2xl:text-sm font-semibold">Jayant Mehta</p>
              <p className="text-white/40 font-sans text-[9px] 2xl:text-[10px] tracking-[0.4em] uppercase mt-2">Founder - Events & Pro.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const TeamSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  const team1 = [
    { name: "Arjun Mehta", role: "Managing Director", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" },
    { name: "Sarah Jenkins", role: "Head of Experiential Tech", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" },
    { name: "Vikram Singh", role: "VP of Global MICE", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
    { name: "Elena Rossi", role: "Lead Event Architect", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800" },
    { name: "David Chen", role: "Technical Director", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800" }
  ];

  const team2 = [
    { name: "Priya Sharma", role: "Creative Director", img: "https://images.unsplash.com/photo-1598550874175-4d0ef43ee90d?auto=format&fit=crop&q=80&w=800" },
    { name: "James Wilson", role: "Logistics Head", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800" },
    { name: "Aisha Patel", role: "Client Relations", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800" },
    { name: "Marcus Torres", role: "Audio-Visual Lead", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800" },
    { name: "Nina Ivanova", role: "Design Specialist", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" }
  ];

  const TeamCard = ({ item, sizingClass }) => (
    <div className={`relative group interactive shrink-0 overflow-hidden rounded-[2rem] border border-white/5 cursor-none ${sizingClass}`}>
      <img 
        src={item.img} 
        alt={item.name} 
        className="w-full h-full object-cover grayscale-[60%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-[#050505]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center pointer-events-none p-6 text-center">
        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out">
          <h4 className="text-xl md:text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-2">{item.name}</h4>
          <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.2em] uppercase text-white/60">{item.role}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-32 2xl:py-48 bg-[#0a0a0a] overflow-hidden border-b border-white/5 w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-20 md:mb-32 px-[3vw]">
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">The Collective</p>
          <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
            Architects of <span className="text-transparent custom-stroke-text font-normal">the Magic.</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6 2xl:gap-8 w-full">
          <div className="flex w-full overflow-hidden select-none hover-pause">
            <div className="flex animate-marquee w-max" style={{ animationDuration: '60s' }}>
              <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
                {team1.map((item, i) => <TeamCard key={`t1a-${i}`} item={item} sizingClass="w-[70vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
              </div>
              <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
                {team1.map((item, i) => <TeamCard key={`t1b-${i}`} item={item} sizingClass="w-[70vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
              </div>
            </div>
          </div>
          <div className="flex w-full overflow-hidden select-none hover-pause">
            <div className="flex animate-marquee-reverse w-max" style={{ animationDuration: '70s' }}>
              <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
                {team2.map((item, i) => <TeamCard key={`t2a-${i}`} item={item} sizingClass="w-[70vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
              </div>
              <div className="flex gap-6 2xl:gap-8 pr-6 2xl:pr-8">
                {team2.map((item, i) => <TeamCard key={`t2b-${i}`} item={item} sizingClass="w-[70vw] md:w-[35vw] xl:w-[25vw] 2xl:w-[20vw] aspect-[4/3]" />)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

const GlobalNodes = () => {
  const [ref, isVisible] = useScrollReveal();
  const nodes = [
    { city: "Pune", type: "Headquarters", email: "info@eventsandpro.com" },
    { city: "Mumbai", type: "Corporate Division", email: "info@eventsandpro.com" },
    { city: "Delhi-NCR", type: "MICE Division", email: "info@eventsandpro.com" },
    { city: "London", type: "European Operations", email: "info@eventsandpro.com" }
  ];

  return (
    <section className="py-24 2xl:py-32 px-[3vw] bg-[#0a0a0a] border-b border-white/5">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="text-center mb-20">
          <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Global Portfolio</p>
          <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
            Strategic <span className="text-transparent custom-stroke-text font-normal">Nodes.</span>
          </h2>
        </div>
        <GlobalMap />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12">
          {nodes.map((node, i) => (
            <div key={i} className="p-10 border border-white/10 rounded-2xl hover:border-white/30 transition-colors duration-500 interactive group bg-[#050505]">
              <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-2">{node.city}</h3>
              <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8">{node.type}</p>
              <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.1em] text-white/70 group-hover:text-white transition-colors">{node.email}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CareersSection = () => {
  const [ref, isVisible] = useScrollReveal();
  
  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-[3vw] border-b border-white/5 w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          <div className="lg:col-span-5 flex flex-col">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8 border-b border-white/10 pb-3 inline-block w-fit">Talent Acquisition</p>
            <h2 className="text-5xl md:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-[1.1]">
              Build The <br/> <span className="text-transparent custom-stroke-text font-normal">Future.</span>
            </h2>
            <div className="space-y-6 text-sm md:text-base 2xl:text-lg font-sans font-light text-white/60 leading-relaxed max-w-md">
              <p>We are constantly searching for visionary spatial designers, logistical masterminds, and production specialists.</p>
              <p>Whether you are a seasoned veteran or an ambitious student ready to redefine the corporate events industry, your blueprint starts here.</p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12 lg:p-16">
            <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors w-full placeholder:text-white/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors w-full placeholder:text-white/20" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Area of Expertise</label>
                  <select className="interactive w-full bg-transparent border-b border-white/20 pb-4 pt-4 px-2 text-sm text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer">
                    <option className="bg-[#0a0a0a] text-white">Spatial / 3D Design</option>
                    <option className="bg-[#0a0a0a] text-white">Experiential Technology (AR/VR)</option>
                    <option className="bg-[#0a0a0a] text-white">Logistics & Supply Chain</option>
                    <option className="bg-[#0a0a0a] text-white">Client Relations / Sales</option>
                    <option className="bg-[#0a0a0a] text-white">Internship / Student Program</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Portfolio / LinkedIn URL</label>
                  <input type="url" placeholder="https://..." className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors w-full placeholder:text-white/20" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Why Events & Pro?</label>
                <textarea rows="3" placeholder="Tell us about your vision..." className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors w-full resize-none placeholder:text-white/20"></textarea>
              </div>

              <button type="submit" className="interactive mt-4 px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 w-fit">
                Submit Application
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

const Vision = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-40 md:py-56 2xl:py-72 bg-[#050505] px-[3vw] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
      <div ref={ref} className={`max-w-4xl 2xl:max-w-6xl mx-auto text-center transition-all duration-1000 ease-out relative z-10 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-12">The Philosophy</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.08em] leading-[1.3] text-white/80">
          "Unlocking the future: Celebrating innovation and collaboration to shape a sustainable tomorrow through <span className="text-white font-normal italic">Events & Pro</span>."
        </h2>
      </div>
    </section>
  );
};

const Metrics = () => {
  const [ref, isVisible] = useScrollReveal();
  const stats = [
    { num: "280+", label: "Events Completed" },
    { num: "244+", label: "Satisfied Clients" },
    { num: "97+", label: "Respected Vendors" },
    { num: "100%", label: "Corporate Delivery" }
  ];

  return (
    <section className="bg-[#050505] border-y border-white/5 px-[3vw] py-32 2xl:py-48">
      <div ref={ref} className={`w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0a0a0a] py-16 px-8 flex flex-col items-center justify-center text-center group interactive hover:bg-[#0d0d0d] transition-colors duration-500">
              <span className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight text-white mb-4 tracking-[0.05em] group-hover:scale-110 transition-transform duration-700">{stat.num}</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutPage = () => {
  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] w-full">
      <DynamicMeta 
        title="Our Story & Leadership" 
        description="Discover the genesis of Events & Pro. We are architects of legacy, redefining corporate engagements and MICE operations since 2017." 
        keywords="Events and Pro Founders, Corporate Event Architects, Event Management Leadership India" 
      />
      <section className="px-[3vw] w-full pb-32 border-b border-white/5">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Our Story</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
          Designing <br/> <span className="text-transparent custom-stroke-text font-normal">Legacy.</span>
        </h1>
      </section>
      <OurGenesis />
      <Vision />
      <CoreEthos />
      <DirectorProfileRedesigned />
      <TeamSection />
      <TheStudio />
      <Metrics />
      <GlobalNodes />
      <CareersSection />
      <PageFAQ pageType="about" />
    </div>
  );
};

/* ==========================================================================
   DEDICATED DOMAIN DETAILED PAGES
   ========================================================================== */

const MicePage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      {/* Detail Hero */}
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 01</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Corporate <br/> <span className="text-transparent custom-stroke-text font-normal">& MICE.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Corporate & MICE" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-[3vw] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Architecting <br/>Authority.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              We specialize in crafting hyper-secure, immersive environments for Fortune 500 companies, meetings, incentives, conferences, and exhibitions.
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              Every detail is engineered to command attention and seamlessly translate complex brand narratives into physical, awe-inspiring reality.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">150+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">MICE Executed</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">80K</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Delegates Hosted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-[3vw] w-full">
         <div ref={ref2} className={`w-full transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", title: "Global Conferences" },
               { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", title: "Incentive Retreats" },
               { img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800", title: "Corporate Exhibitions" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Architect Your Next Summit</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Request A Proposal
        </button>
      </section>
      <PageFAQ pageType="solutions" />
    </div>
  );
};

const TechPage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      {/* Detail Hero */}
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 02</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Experiential <br/> <span className="text-transparent custom-stroke-text font-normal">Technology.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Experiential Technology" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-[3vw] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Future <br/>Forward.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              The experiential marketing space is evolving at an unimaginable pace. We integrate AR, VR, and hybrid event streaming to connect global audiences.
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              Industries embrace the 'new' normal, sparking evolving ideas in experiential spaces that we translate into mind-bending physical and digital events.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">50+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Virtual Spaces</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">100%</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Seamless Tech</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-[3vw] w-full">
         <div ref={ref2} className={`w-full transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800", title: "Virtual & Hybrid Events" },
               { img: "https://images.unsplash.com/photo-1610465299993-e6675c9f9fac?auto=format&fit=crop&q=80&w=800", title: "AR / VR Activations" },
               { img: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800", title: "Product Reveals" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Commission Your Tech Launch</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Request A Proposal
        </button>
      </section>
      <PageFAQ pageType="solutions" />
    </div>
  );
};

const AwardsPage = ({ setCurrentPage }) => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      {/* Detail Hero */}
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <button onClick={() => setCurrentPage('expertise')} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Domains
        </button>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Domain // 03</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
          Awards & <br/> <span className="text-transparent custom-stroke-text font-normal">Entertainment.</span>
        </h1>
        <div ref={ref1} className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5 shadow-2xl transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <img src="https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Awards and Entertainment" />
        </div>
      </section>

      {/* Intro & Metrics */}
      <section className="py-24 2xl:py-32 px-[3vw] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-8">Celebrating <br/>Excellence.</h2>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed mb-6">
              Award ceremonies now shine across both entertainment and business industries. We tailor perfect entertainment curation to match your corporate audience.
            </p>
            <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed">
              We thrive on big ideas, delivering any Intellectual Property (IP) you envision. Creating massive audiovisual landscapes for live corporate entertainment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 bg-white/5 p-10 rounded-3xl border border-white/10">
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">100+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Gala Dinners</span>
            </div>
            <div>
              <span className="block text-4xl 2xl:text-5xl font-wide font-extralight text-white mb-3">40+</span>
              <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Custom IPs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Engagements Grid */}
      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-y border-white/5 px-[3vw] w-full">
         <div ref={ref2} className={`w-full transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
           <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16 text-center">Specialized Engagements</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 2xl:gap-12">
             {[
               { img: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800", title: "Award Functions" },
               { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", title: "Entertainment Curation" },
               { img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800", title: "Intellectual Properties" }
             ].map((svc, idx) => (
               <div key={idx} className="group interactive cursor-none relative rounded-2xl overflow-hidden border border-white/5 aspect-[4/5]">
                 <img src={svc.img} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={svc.title} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                 <div className="absolute bottom-8 left-8">
                   <h4 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white">{svc.title}</h4>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center px-6">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Architect Your Stage</h3>
        <button onClick={() => setCurrentPage('contact')} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Request A Proposal
        </button>
      </section>
      <PageFAQ pageType="solutions" />
    </div>
  );
};


/* ==========================================================================
   EXPERTISE OVERVIEW PAGE
   ========================================================================== */

const ExpertiseHero = () => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="px-[3vw] w-full pb-24 md:pb-32 border-b border-white/5">
      <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Our Domains</p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-16">
        Architecting <br/> <span className="text-transparent custom-stroke-text font-normal">Realities.</span>
      </h1>
      <div 
        ref={ref}
        className={`w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      >
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] animate-subtle-zoom" alt="Domain Hero" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      </div>
    </section>
  );
};

const DomainCorporate = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden w-full">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '80s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">CORPORATE EVENTS • MICE • SUMMITS • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">CORPORATE EVENTS • MICE • SUMMITS • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-[3vw] w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <div className="lg:col-span-5 flex flex-col">
            <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">01</span>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-[1.1]">Corporate <br/> & MICE.</h2>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/60 leading-relaxed mb-8">
              We engineer high-stakes environments for the world's most demanding corporate giants. From hyper-secure meetings to massive 5,000-attendee conferences.
            </p>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed mb-16">
              Our methodology merges spatial psychology with cutting-edge audiovisual integration to keep audiences deeply engaged and amplify brand narratives.
            </p>
            
            <button onClick={() => setCurrentPage('mice')} className="interactive mb-16 px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
              Explore MICE Details
            </button>

            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
              <div>
                <span className="block text-3xl 2xl:text-4xl font-wide font-extralight text-white mb-3">150+</span>
                <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Global Events</span>
              </div>
              <div>
                <span className="block text-3xl 2xl:text-4xl font-wide font-extralight text-white mb-3">120+</span>
                <span className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40">Brand Partners</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 2xl:gap-8">
            <div className="md:col-span-2 aspect-[16/9] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('mice')}>
              <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Main" />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('mice')}>
              <img src="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Detail 1" />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('mice')}>
              <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Corporate Detail 2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainTech = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#050505] overflow-hidden border-b border-white/5 w-full">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee-reverse w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '90s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">EXPERIENTIAL TECH • VIRTUAL EVENTS • HYBRID • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">EXPERIENTIAL TECH • VIRTUAL EVENTS • HYBRID • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-[3vw] w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 grid grid-cols-2 gap-6 2xl:gap-8 h-full">
            <div className="flex flex-col gap-6 2xl:gap-8 pt-12 lg:pt-20">
               <div className="aspect-[3/4] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('tech')}>
                 <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Tech 1" />
               </div>
               <div className="aspect-square overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('tech')}>
                 <img src="https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Tech 2" />
               </div>
            </div>
            <div className="flex flex-col gap-6 2xl:gap-8 pb-12 lg:pb-20">
               <div className="aspect-square overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('tech')}>
                 <img src="https://images.unsplash.com/photo-1610465299993-e6675c9f9fac?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Tech 3" />
               </div>
               <div className="aspect-[3/4] overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('tech')}>
                 <img src="https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Tech 4" />
               </div>
            </div>
          </div>
          <div className="lg:col-span-5 flex flex-col order-1 lg:order-2 lg:pl-10">
            <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">02</span>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10 leading-[1.1]">Experiential <br/> Tech.</h2>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/60 leading-relaxed mb-8">
              Curating ultra-modern, personalized brand activations that transcend the ordinary. Every AR element, virtual stream, and interactive choice is flawlessly executed.
            </p>
            <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed mb-10">
              We embrace the 'new' normal, creating massive digital and physical hybrid event environments.
            </p>

            <button onClick={() => setCurrentPage('tech')} className="interactive mb-16 px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit">
              Explore Tech Details
            </button>

            <ul className="space-y-6 border-t border-white/10 pt-10">
              {['AR / VR Activations', 'Hybrid Streaming Nodes', 'Custom Platform Architecture', 'Digital IP Generation'].map((item, i) => (
                <li key={i} className="flex items-center text-[10px] 2xl:text-[11px] font-sans tracking-[0.2em] uppercase text-white/70">
                  <div className="w-1.5 h-1.5 bg-white/40 rounded-full mr-6"></div>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainAwards = ({ setCurrentPage }) => {
  const [ref, isVisible] = useScrollReveal();
  return (
    <section className="py-24 md:py-40 bg-[#0a0a0a] border-b border-white/5 overflow-hidden w-full">
      <div className="w-full overflow-hidden flex z-0 opacity-[0.07] pointer-events-none select-none mb-20 hover-pause">
        <div className="flex animate-marquee w-max items-center text-[12vw] font-wide font-extralight tracking-[0.1em] uppercase text-white leading-none" style={{ animationDuration: '70s' }}>
          <div className="flex whitespace-nowrap"><span className="pr-12">AWARDS & ENTERTAINMENT • IPS • GALA • </span></div>
          <div className="flex whitespace-nowrap"><span className="pr-12">AWARDS & ENTERTAINMENT • IPS • GALA • </span></div>
        </div>
      </div>

      <div ref={ref} className={`px-[3vw] w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="flex flex-col">
             <span className="text-6xl md:text-8xl font-wide font-thin text-transparent custom-stroke-text mb-8">03</span>
             <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-8">Awards <br/> & IPs.</h2>
             <button onClick={() => setCurrentPage('awards')} className="interactive px-8 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 shadow-xl w-fit mt-4">
              Explore Awards Details
            </button>
          </div>
          <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/50 leading-relaxed max-w-md lg:text-right">
            Engineering massive audiovisual landscapes for corporate entertainment. From high-profile award functions to massive custom intellectual properties.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 2xl:gap-8">
           <div className="lg:col-span-2 aspect-[16/9] lg:aspect-auto overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('awards')}>
             <img src="https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Awards Main" />
           </div>
           <div className="flex flex-col gap-6 2xl:gap-8">
             <div className="aspect-[16/9] lg:aspect-auto lg:flex-1 overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('awards')}>
               <img src="https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Awards Detail 1" />
             </div>
             <div className="aspect-[16/9] lg:aspect-auto lg:flex-1 overflow-hidden rounded-3xl group interactive cursor-none border border-white/5" onClick={() => setCurrentPage('awards')}>
               <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="Awards Detail 2" />
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const CapabilitiesMatrix = () => {
  const [ref, isVisible] = useScrollReveal();
  const capabilities = [
    { title: "Corporate Events", details: "MICE, Summits, Strategic Networking" },
    { title: "Experiential Tech", details: "AR/VR, Hybrid Event Portals, 3D Mapping" },
    { title: "Venue Manufacturing", details: "Stage Design, Fabrication, Custom Sets" },
    { title: "Content Creation", details: "Corporate Video Production, Showreels" },
    { title: "Talent & Showbiz", details: "Entertainment Curation, IP Generation" },
    { title: "Invisible Logistics", details: "Freight, Procurement, Security Protocols" }
  ];

  return (
    <section className="py-32 2xl:py-48 bg-[#050505] px-[3vw] w-full">
      <div ref={ref} className={`w-full transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-16 text-center">Service Matrix</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-y-24 border-t border-white/10 pt-16">
          {capabilities.map((cap, i) => (
            <div key={i} className="flex flex-col interactive group cursor-none">
              <div className="w-full h-[1px] bg-white/10 mb-8 group-hover:bg-white/30 transition-colors duration-500 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-[800ms] ease-out"></div>
              </div>
              <h4 className="text-xl md:text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-4 group-hover:pl-3 transition-all duration-500">{cap.title}</h4>
              <p className="font-sans text-[10px] 2xl:text-[11px] tracking-[0.15em] uppercase text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">{cap.details}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExpertisePage = ({ setCurrentPage }) => {
  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] w-full">
       <DynamicMeta 
         title="Solutions & Capabilities" 
         description="Comprehensive corporate event solutions including MICE, Experiential Technology, Hybrid Portals, and Global Logistics operations." 
         keywords="MICE Solutions, Corporate Event Capabilities, Hybrid Events India, VR Event Setup" 
       />
       <ExpertiseHero />
       <DomainCorporate setCurrentPage={setCurrentPage} />
       <DomainTech setCurrentPage={setCurrentPage} />
       <DomainAwards setCurrentPage={setCurrentPage} />
       <CapabilitiesMatrix />
       <PageFAQ pageType="solutions" />
    </div>
  );
};

/* ==========================================================================
   GALLERY PAGE
   ========================================================================== */

const GalleryPage = () => {
  const [filter, setFilter] = useState('All');
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();

  const filters = ['All', 'Corporate', 'Tech & Virtual', 'Awards'];

  const projects = [
    { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Global Tech Summit" },
    { img: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800", category: "Tech & Virtual", title: "Hybrid Symposium" },
    { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=800", category: "Awards", title: "Pinnacle Gala" },
    { img: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Auto Reveal '25" },
    { img: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800", category: "Tech & Virtual", title: "AR Brand Activation" },
    { img: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=800", category: "Awards", title: "Industry Excellence" },
    { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800", category: "Corporate", title: "Leadership Retreat" },
    { img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", category: "Tech & Virtual", title: "VR Product Demo" },
    { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800", category: "Awards", title: "Intellectual Property Expo" }
  ];

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">The Archive</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
          Visual <br/> <span className="text-transparent custom-stroke-text font-normal">Symphony.</span>
        </h1>
      </section>

      <section className="py-24 2xl:py-32 px-[3vw] w-full border-b border-white/5">
        <div ref={ref1} className={`w-full transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
            <div>
              <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-4">Featured Selection</p>
              <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white">Global Innovators Summit</h2>
            </div>
            <button className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white hover:text-white/50 transition-colors">
              View Case Study
            </button>
          </div>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative group interactive cursor-none border border-white/5">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2160" className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105 animate-subtle-zoom" alt="Featured Project" />
            <div className="absolute inset-0 bg-black/20 pointer-events-none transition-colors duration-700 group-hover:bg-transparent"></div>
          </div>
        </div>
      </section>

      <section className="px-[3vw] py-24 2xl:py-32 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Curated Collection</h3>
          <div className="flex flex-wrap gap-6 md:gap-10">
            {filters.map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`interactive font-sans text-[10px] 2xl:text-xs tracking-[0.3em] uppercase transition-all duration-300 pb-2 border-b-2 ${filter === f ? 'text-white border-white' : 'text-white/40 border-transparent hover:text-white/80'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {filteredProjects.map((proj, i) => (
            <div key={`${filter}-${i}`} className={`relative overflow-hidden group interactive border border-white/5 rounded-2xl animate-fade-in ${i % 3 === 0 ? 'aspect-[3/4]' : i % 2 === 0 ? 'aspect-square' : 'aspect-[4/3]'}`}>
               <img src={proj.img} alt={proj.title} className="w-full h-full object-cover grayscale-[40%] transition-transform duration-[2000ms] group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>
               <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                 <span className="font-sans text-[8px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-2">{proj.category}</span>
                 <h4 className="font-wide text-xl 2xl:text-2xl font-extralight uppercase tracking-[0.05em] text-white">{proj.title}</h4>
               </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 2xl:py-32 bg-[#0a0a0a] border-t border-white/5 px-[3vw] w-full">
        <div ref={ref2} className={`w-full transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="text-center mb-20">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Cinematography</p>
            <h2 className="text-4xl md:text-6xl 2xl:text-7xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
              The Motion <br/> <span className="text-transparent custom-stroke-text font-normal">Vault.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 2xl:gap-12">
            {[
              { img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200", title: "Corporate Showreel '24" },
              { img: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1200", title: "Awards & Gala Edit" }
            ].map((video, idx) => (
              <div key={idx} className="w-full aspect-[16/9] rounded-3xl overflow-hidden relative group interactive cursor-none border border-white/5 shadow-2xl">
                <img src={video.img} className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105" alt={video.title} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 2xl:w-24 2xl:h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/30 group-hover:bg-white/30 group-hover:scale-110 transition-all duration-500">
                  <Play className="text-white w-6 h-6 2xl:w-8 2xl:h-8 ml-1 opacity-90" fill="currentColor" />
                </div>
                <div className="absolute bottom-6 left-8">
                  <h4 className="font-wide text-lg 2xl:text-xl font-extralight uppercase tracking-[0.05em] text-white">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <PageFAQ pageType="home" />
    </div>
  );
};

/* ==========================================================================
   INTELLIGENCE PAGE
   ========================================================================== */

const IntelligencePage = () => {
  const [ref1, isVisible1] = useScrollReveal();
  const [ref2, isVisible2] = useScrollReveal();
  
  // Tool 1: Budget State
  const [attendees, setAttendees] = useState(250);
  const [eventType, setEventType] = useState('mice');

  // Tool 2: Space State
  const [spaceAttendees, setSpaceAttendees] = useState(250);
  const [layoutType, setLayoutType] = useState('banquet');

  // Tool 3: Sustainability State (Advanced ESG)
  const [ecoAttendees, setEcoAttendees] = useState(500);
  const [travelType, setTravelType] = useState('domestic');
  const [duration, setDuration] = useState(2);
  const [venueEnergy, setVenueEnergy] = useState('standard');
  const [fbType, setFbType] = useState('standard');
  const [fabrication, setFabrication] = useState('standard');

  const calculateEstimate = () => {
    const baseRates = { mice: 15000, tech: 25000, awards: 18000 };
    const min = attendees * baseRates[eventType] * 0.8;
    const max = attendees * baseRates[eventType] * 1.5;
    return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
  };

  const calculateSpace = () => {
    // Square feet per person based on standard event layouts
    const spaceMultipliers = { theater: 10, banquet: 18, classroom: 22, cocktail: 8 };
    const totalSqFt = spaceAttendees * spaceMultipliers[layoutType];
    const totalSqM = Math.round(totalSqFt / 10.764);
    return { sqft: totalSqFt.toLocaleString('en-US'), sqm: totalSqM.toLocaleString('en-US') };
  };

  const calculateCarbon = () => {
    // Baseline factors (Tonnes CO2e per unit)
    const travelRates = { local: 0.05, domestic: 0.35, international: 1.8 }; // per person
    const energyRates = { standard: 0.03, ecocertified: 0.015 }; // per person per day
    const fbRates = { plant: 0.005, standard: 0.015, premium: 0.03 }; // per person per day
    const fabRates = { modular: 0.002, standard: 0.015, custom: 0.04 }; // per person total

    // Calculate components
    const travelEmissions = ecoAttendees * travelRates[travelType];
    const dailyEmissions = ecoAttendees * duration * (energyRates[venueEnergy] + fbRates[fbType]);
    const fabEmissions = ecoAttendees * fabRates[fabrication];
    
    const totalTonnes = travelEmissions + dailyEmissions + fabEmissions;
    
    // Cost to offset 1 Tonne in INR (High-quality verified offsets based on 2026 India market data)
    const offsetRatePerTonne = 2200; 
    const offsetCost = Math.ceil(totalTonnes * offsetRatePerTonne); 
    
    return { 
      tonnes: totalTonnes.toFixed(1), 
      cost: `₹${offsetCost.toLocaleString('en-IN')}` 
    };
  };

  const spaceReq = calculateSpace();
  const carbonReq = calculateCarbon();

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full flex flex-col items-center">
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Strategic Advisory</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-8">
          Event <br/> <span className="text-transparent custom-stroke-text font-normal">Intelligence.</span>
        </h1>
        <p className="font-sans text-sm 2xl:text-base tracking-[0.1em] text-white/60 leading-relaxed max-w-2xl">
          Utilize our proprietary architecture models to forecast logistical requirements, spatial capacity, and ESG sustainability metrics for your upcoming corporate engagements.
        </p>
      </section>

      <section className="py-24 2xl:py-32 px-[3vw] w-full flex flex-col gap-12 lg:gap-16">
        
        {/* TOP ROW: Two equal columns for Budget and Space */}
        <div ref={ref1} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 transition-all duration-1000 ease-out ${isVisible1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          {/* Tool 1: Budget Estimator */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col justify-between group hover:border-white/10 transition-colors duration-500">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <Calculator size={20} className="text-white" strokeWidth={1} />
                </div>
                <div>
                  <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Budget Blueprint</h3>
                  <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Estimate Baseline Project Costs</p>
                </div>
              </div>
              
              <div className="space-y-8 mb-16">
                <div>
                  <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Engagement Type</label>
                  <select 
                    value={eventType} 
                    onChange={(e) => setEventType(e.target.value)}
                    className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="mice" className="bg-[#0a0a0a] text-white">Corporate Summit & MICE</option>
                    <option value="tech" className="bg-[#0a0a0a] text-white">Experiential Tech Launch</option>
                    <option value="awards" className="bg-[#0a0a0a] text-white">Award Function / Gala</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 flex justify-between mb-6">
                    <span>Delegates (Scale)</span>
                    <span className="text-white font-medium">{attendees} Pax</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" max="5000" step="50"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    className="interactive w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-[#050505] rounded-2xl p-8 border border-white/5 text-center mt-auto">
              <span className="block font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3">Estimated Investment Range (INR)</span>
              <span className="font-wide text-3xl md:text-4xl 2xl:text-5xl text-white font-light tracking-wider">{calculateEstimate()}</span>
            </div>
          </div>

          {/* Tool 2: Space Calculator */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col justify-between group hover:border-white/10 transition-colors duration-500">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Spatial Calculator</h3>
                  <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Determine Venue Square Footage</p>
                </div>
              </div>
              
              <div className="space-y-8 mb-16">
                <div>
                  <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Seating Architecture</label>
                  <select 
                    value={layoutType} 
                    onChange={(e) => setLayoutType(e.target.value)}
                    className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                  >
                    <option value="theater" className="bg-[#0a0a0a] text-white">Theater Style (Keynotes)</option>
                    <option value="classroom" className="bg-[#0a0a0a] text-white">Classroom Style (Workshops)</option>
                    <option value="banquet" className="bg-[#0a0a0a] text-white">Round Tables (Gala/Dining)</option>
                    <option value="cocktail" className="bg-[#0a0a0a] text-white">Standing Cocktail (Mixers)</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 flex justify-between mb-6">
                    <span>Attendees</span>
                    <span className="text-white font-medium">{spaceAttendees} Pax</span>
                  </label>
                  <input 
                    type="range" 
                    min="50" max="5000" step="50"
                    value={spaceAttendees}
                    onChange={(e) => setSpaceAttendees(e.target.value)}
                    className="interactive w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-[#050505] rounded-2xl p-6 md:p-8 border border-white/5 text-center flex flex-col justify-center">
                <span className="block font-sans text-[8px] 2xl:text-[9px] tracking-[0.3em] uppercase text-white/40 mb-2">Required Area</span>
                <span className="font-wide text-2xl md:text-3xl lg:text-4xl text-white font-light tracking-wide leading-none">{spaceReq.sqft} <span className="text-sm text-white/50 inline-block align-baseline">sq ft</span></span>
              </div>
              <div className="bg-[#050505] rounded-2xl p-6 md:p-8 border border-white/5 text-center flex flex-col justify-center">
                <span className="block font-sans text-[8px] 2xl:text-[9px] tracking-[0.3em] uppercase text-white/40 mb-2">Metric Area</span>
                <span className="font-wide text-2xl md:text-3xl lg:text-4xl text-white font-light tracking-wide leading-none">{spaceReq.sqm} <span className="text-sm text-white/50 inline-block align-baseline">sq m</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Full Width Sustainability Tool */}
        <div ref={ref2} className={`bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col xl:flex-row gap-16 group hover:border-white/10 transition-all duration-1000 ease-out ${isVisible2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          
          <div className="xl:w-3/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                </div>
                <div>
                  <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white">Sustainability Index</h3>
                  <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.2em] uppercase text-white/40 mt-1">Advanced ESG Carbon Footprint Estimator</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-12">
                {/* Column 1: Scope & Scale */}
                <div className="space-y-10">
                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 flex justify-between mb-6">
                      <span>Attendees (Scale)</span>
                      <span className="text-white font-medium">{ecoAttendees} Pax</span>
                    </label>
                    <input 
                      type="range" 
                      min="50" max="5000" step="50"
                      value={ecoAttendees}
                      onChange={(e) => setEcoAttendees(e.target.value)}
                      className="interactive w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Event Duration</label>
                    <select 
                      value={duration} 
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value={1} className="bg-[#0a0a0a] text-white">1 Day (No Stay)</option>
                      <option value={2} className="bg-[#0a0a0a] text-white">2 Days (Overnight)</option>
                      <option value={3} className="bg-[#0a0a0a] text-white">3 Days (Multi-day)</option>
                      <option value={4} className="bg-[#0a0a0a] text-white">4+ Days (Extended)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Delegate Travel Scope</label>
                    <select 
                      value={travelType} 
                      onChange={(e) => setTravelType(e.target.value)}
                      className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="local" className="bg-[#0a0a0a] text-white">Local / Regional (Driving / Trains)</option>
                      <option value="domestic" className="bg-[#0a0a0a] text-white">Domestic (Short-Haul Flights)</option>
                      <option value="international" className="bg-[#0a0a0a] text-white">International (Long-Haul Flights)</option>
                    </select>
                  </div>
                </div>

                {/* Column 2: Operations & Infra */}
                <div className="space-y-10">
                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Venue Energy Standard</label>
                    <select 
                      value={venueEnergy} 
                      onChange={(e) => setVenueEnergy(e.target.value)}
                      className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="standard" className="bg-[#0a0a0a] text-white">Standard Grid Power</option>
                      <option value="ecocertified" className="bg-[#0a0a0a] text-white">Eco-Certified / Renewable Energy</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">F&B Menu Sourcing</label>
                    <select 
                      value={fbType} 
                      onChange={(e) => setFbType(e.target.value)}
                      className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="plant" className="bg-[#0a0a0a] text-white">Plant-Forward / Locally Sourced</option>
                      <option value="standard" className="bg-[#0a0a0a] text-white">Standard Corporate Buffet</option>
                      <option value="premium" className="bg-[#0a0a0a] text-white">Premium (Imported / High Meat)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-sans text-[10px] 2xl:text-xs tracking-[0.2em] uppercase text-white/60 block mb-4">Stage & Fabrication</label>
                    <select 
                      value={fabrication} 
                      onChange={(e) => setFabrication(e.target.value)}
                      className="interactive w-full bg-transparent border-b border-white/20 pb-4 text-sm md:text-base text-white outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="modular" className="bg-[#0a0a0a] text-white">Modular / Reusable Structures</option>
                      <option value="standard" className="bg-[#0a0a0a] text-white">Standard Build (Mixed Waste)</option>
                      <option value="custom" className="bg-[#0a0a0a] text-white">Single-Use Custom Fabrication</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:w-2/5 flex flex-col justify-end gap-6">
            <div className="bg-[#050505] rounded-2xl p-8 md:p-12 border border-white/5 text-center flex-1 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none"></div>
              <span className="block font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 relative z-10">Estimated Carbon Footprint</span>
              <span className="font-wide text-5xl md:text-6xl 2xl:text-7xl text-white font-light tracking-wide leading-none relative z-10">{carbonReq.tonnes} <span className="text-xl 2xl:text-2xl text-white/50 block mt-2 font-sans tracking-[0.2em] uppercase">Tonnes CO2e</span></span>
            </div>
            <div className="bg-[#050505] rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                 <span className="block font-sans text-[8px] 2xl:text-[9px] tracking-[0.3em] uppercase text-white/40 mb-2">Estimated Offset Investment</span>
                 <span className="font-wide text-2xl md:text-3xl lg:text-4xl text-white font-light tracking-wide">{carbonReq.cost}</span>
              </div>
              <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.1em] text-white/40 max-w-[200px] text-center md:text-right leading-relaxed border-t border-white/10 pt-4 md:border-none md:pt-0">
                Calculated using 2026 market rates for verified nature-based carbon credits in India.
              </p>
            </div>
          </div>

        </div>

      </section>
      
      <section className="py-32 text-center px-[3vw]">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-10">Ready To Architect Your Event?</h3>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' }) || window.dispatchEvent(new CustomEvent('navigate', { detail: 'contact' }))} className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
          Request A Proposal
        </button>
      </section>
      <PageFAQ pageType="intelligence" />
    </div>
  );
};


/* ==========================================================================
   CONTACT PAGE
   ========================================================================== */

const ContactPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: "What is your minimum engagement scope?", a: "We specialize in grand-scale and corporate events. While we do not have a strict financial minimum, our engagements typically begin with complex spatial or logistical requirements that standard agencies cannot accommodate." },
    { q: "Do you execute international MICE commissions?", a: "Yes. With a robust network of global logistics partners and our core nodes across major cities, we have seamlessly executed corporate events and exhibitions worldwide." },
    { q: "What is the typical lead time required?", a: "For large-scale corporate summits or bespoke IP generation, we recommend a lead time of 6 to 12 months. This allows for uncompromising attention to architectural design and talent procurement." }
  ];

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen flex flex-col w-full">
      <section className="px-[3vw] w-full pb-32 border-b border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Start Your Project</p>
            <h1 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1] mb-12">
              Connect.<br/><span className="text-transparent custom-stroke-text font-normal whitespace-nowrap">The Vision.</span>
            </h1>
            <div className="space-y-12">
              <div>
                 <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 border-b border-white/10 inline-block pb-2">Direct Line</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light hover:text-white/60 transition-colors interactive w-fit cursor-pointer mb-2">info@eventsandpro.com</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light hover:text-white/60 transition-colors interactive w-fit cursor-pointer">eventsandpro@gmail.com</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light hover:text-white/60 transition-colors interactive w-fit cursor-pointer mt-4">+91 77093 56661</p>
              </div>
              <div>
                 <p className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mb-3 border-b border-white/10 inline-block pb-2">Headquarters</p>
                 <p className="font-sans text-sm md:text-base tracking-[0.1em] text-white font-light leading-relaxed">Pune, Maharashtra<br/>India</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 xl:col-span-7 lg:pl-8 xl:pl-16">
            <form className="flex flex-col gap-12 mt-8 lg:mt-0" onSubmit={(e) => e.preventDefault()}>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Full Name</label>
                <input type="text" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Email Address</label>
                <input type="email" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Inquiry Type</label>
                <select className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white/80 font-sans transition-colors appearance-none rounded-none">
                  <option className="bg-black text-white">Corporate Summit / MICE</option>
                  <option className="bg-black text-white">Experiential Technology / Launch</option>
                  <option className="bg-black text-white">Awards Function / Gala</option>
                  <option className="bg-black text-white">General Inquiry</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 pl-2">Message</label>
                <textarea rows="4" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-4 px-2 text-sm text-white font-sans transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="interactive px-12 py-4 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[10px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 w-fit mt-4">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-24 2xl:py-32 px-[3vw] bg-[#0a0a0a] border-b border-white/5 w-full">
        <div className="w-full">
          <div className="text-center mb-20">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-6">Strategic Presence</p>
            <h2 className="text-3xl md:text-5xl 2xl:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
              Global <span className="text-transparent custom-stroke-text font-normal">Presence.</span>
            </h2>
          </div>
          <GlobalMap />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-12 mt-12">
            {[
              { city: "Pune", type: "Headquarters", email: "info@eventsandpro.com" },
              { city: "Mumbai", type: "Corporate Division", email: "info@eventsandpro.com" },
              { city: "Delhi-NCR", type: "MICE Division", email: "info@eventsandpro.com" },
              { city: "Bangalore", type: "Tech Engagements", email: "info@eventsandpro.com" }
            ].map((node, i) => (
              <div key={i} className="p-10 border border-white/10 rounded-2xl hover:border-white/30 transition-colors duration-500 interactive group bg-[#050505]">
                <h3 className="text-2xl 2xl:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-2">{node.city}</h3>
                <p className="font-sans text-[9px] 2xl:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-8">{node.type}</p>
                <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.1em] text-white/70 group-hover:text-white transition-colors">{node.email}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 2xl:py-32 px-[3vw] bg-[#050505] w-full">
        <div className="w-full">
          <div className="text-center mb-16">
            <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-4">Operations</p>
            <h2 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white">Engagement Protocols</h2>
          </div>
          <div className="flex flex-col border-t border-white/10">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-white/10 overflow-hidden interactive" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="py-8 flex justify-between items-center cursor-none">
                  <h4 className={`text-sm md:text-base 2xl:text-lg font-wide font-extralight uppercase tracking-[0.05em] transition-colors duration-300 pr-8 ${activeFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</h4>
                  <div className="text-white/40 font-mono text-xl font-light">{activeFaq === i ? '−' : '+'}</div>
                </div>
                <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-64 opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                  <p className="font-sans text-xs 2xl:text-sm tracking-[0.15em] uppercase text-white/40 leading-relaxed max-w-2xl">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white/5 border-y border-white/10 px-[3vw] text-center w-full">
        <h3 className="text-xl md:text-2xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-4">Join The Architecture</h3>
        <p className="font-sans text-[10px] 2xl:text-[11px] tracking-[0.2em] uppercase text-white/50 max-w-xl mx-auto mb-8 leading-relaxed">
          We are always searching for visionary designers, logistical masterminds, and production specialists.
        </p>
        <a href="mailto:careers@eventsandpro.com" className="interactive border-b border-white/20 pb-2 text-[10px] font-sans tracking-[0.3em] uppercase text-white hover:text-white/50 transition-colors">
          Submit Portfolio
        </a>
      </section>
      <PageFAQ pageType="home" />
    </div>
  );
};

/* ==========================================================================
   INSIGHTS & BLOG ARCHITECTURE
   ========================================================================== */

const insightsData = [
  {
    id: 1,
    title: "The Future of Corporate MICE: Hyper-Personalization in 2026",
    category: "MICE Strategy",
    date: "July 1, 2026",
    readTime: "8 Min Read",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600",
    excerpt: "Discover how AI-driven spatial tracking and dynamic scheduling are revolutionizing the traditional corporate conference, turning massive summits into deeply personalized attendee journeys.",
    stats: [
      { value: "40%", label: "Increase in Meaningful Network Connections" },
      { value: "10k+", label: "Simultaneous Spatial Tracking Nodes" },
      { value: "100%", label: "Dynamic Itinerary Adoption" }
    ],
    content: `
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">The landscape of Meetings, Incentives, Conferences, and Exhibitions (MICE) is undergoing a radical transformation. As we navigate through 2026, the traditional "one-size-fits-all" corporate summit is officially obsolete. Fortune 500 companies are no longer satisfied with grand stages and generic breakout sessions; they demand measurable, hyper-personalized experiences for every single attendee.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">The Death of the Static Itinerary</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Historically, executing a conference for 5,000 delegates meant printing massive schedules and hoping attendees found relevance in the broad strokes of the keynote speeches. Today, we architect environments powered by responsive AI. Upon registration, intelligent algorithms analyze an attendee's corporate title, past event behaviors, and networking goals. By the time they step onto the exhibition floor, their RFID-enabled badge acts as a dynamic compass.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">At Events & Pro, we recently deployed a kinetic routing system at a major Fintech summit in Pune. Digital signage across the venue actively morphed based on the demographic density of the corridor, ensuring that VIP investors were subtly guided toward high-level strategic lounges, while developers were naturally funneled toward technical demonstration pods. The result? A 40% increase in meaningful stakeholder connections.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Spatial Psychology & Acoustic Zoning</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Hyper-personalization extends beyond digital tracking; it is deeply rooted in physical spatial design. The modern delegate experiences profound sensory fatigue. To combat this, event architecture must incorporate "Acoustic Zoning." We are now utilizing directional sound mapping and advanced baffling structures that allow a high-energy product reveal to exist just meters away from a pin-drop quiet VIP negotiation suite—without the need for physical walls.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">This micro-segmentation of space allows corporations to cater to extroverted networking and introverted deep-work simultaneously, elevating the perceived value of the summit for every personality type.</p>

      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">The Data-Driven ROI of Personalization</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Ultimately, the shift toward hyper-personalization is driven by the CFO's desk. Boards are demanding granular ROI on their event spend. By tracking how individual segments interact with specific experiential touchpoints, we provide our clients with a holistic heat-map of engagement. If a specific AR activation generated higher dwell times among C-level executives, that data directly informs the strategy for the next quarter's engagements.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">The future of MICE belongs to the architects who understand that a summit of 10,000 people is actually 10,000 individual summits happening simultaneously. Precision, data, and flawless logistical execution are the tools required to build them.</p>
    `,
    metaDesc: "Explore how AI and spatial psychology are driving hyper-personalization in large-scale corporate MICE events in 2026.",
    faqs: [
      { q: "What is hyper-personalization in MICE?", a: "It is the use of AI, RFID tracking, and dynamic environments to tailor the event experience uniquely to each attendee's role and goals." },
      { q: "How does Acoustic Zoning work?", a: "It utilizes directional sound tech and architectural baffling to create completely different auditory environments within the same open space." }
    ]
  },
  {
    id: 2,
    title: "Net-Zero Architecture: Engineering Sustainable Global Summits",
    category: "ESG & Sustainability",
    date: "June 18, 2026",
    readTime: "7 Min Read",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600",
    excerpt: "Corporate mandates demand ESG compliance. Explore our methodology for executing massive, multi-day global events that achieve certified net-zero carbon footprints without sacrificing luxury.",
    stats: [
      { value: "85%", label: "Reduction in Structural Waste via Modular Builds" },
      { value: "100%", label: "Carbon Offsetting via Verified Nature-Based Solutions" },
      { value: "0%", label: "Single-Use Plastics Allowed on Site" }
    ],
    content: `
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Environmental, Social, and Governance (ESG) compliance is no longer a tertiary concern for corporate event planners; it is often the very first metric discussed in the boardroom. As major global enterprises mandate net-zero carbon operations across their supply chains, the events industry has been forced to evolve rapidly. Executing a massive 3,000-person leadership retreat without leaving a devastating ecological footprint requires extreme architectural discipline.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">The Myth of Carbon Offsetting</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">For years, the industry relied on a lazy loophole: build highly wasteful environments, fly in thousands of delegates, and then simply cut a check to "offset" the emissions. In 2026, corporate watchdogs and informed attendees see right through greenwashing. True sustainability begins with reduction at the source, long before offsets are calculated.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">At Events & Pro, we employ a "Zero-Waste Fabrication" protocol. The colossal stages and immersive tunnels you see at our tech launches are completely modular. Utilizing extruded aluminum frameworks and reusable tension-fabric skins, we can architect structures that look like custom, permanent builds, but break down efficiently to be repurposed for the next summit. This single protocol reduces structural waste by over 85% compared to traditional wood and fiberglass fabrication.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Supply Chain & Energy Optimization</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">The invisible logistics of an event hold the heaviest carbon weight. When selecting venues in major hubs like Mumbai or Delhi-NCR, our first audit is the energy grid. We prioritize eco-certified venues running on high percentages of renewable energy. Furthermore, the massive power requirements for our kinetic lighting and LED arrays are heavily mitigated by deploying ultra-low-draw, next-generation intelligent lighting fixtures.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Food and beverage sourcing is equally critical. By shifting the corporate gala menu toward premium, locally sourced, plant-forward options, we drastically cut the Scope 3 emissions associated with cold-chain transport and heavy agriculture, while still delivering a Michelin-tier culinary experience.</p>

      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Verifiable Impact</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Once absolute reduction is achieved, we utilize our proprietary Sustainability Index (available on our Intelligence page) to calculate the remaining footprint accurately. We then partner with verified, high-yield nature-based offset programs within India to achieve certified Net-Zero status. We don't just build summits; we build them responsibly, safeguarding our clients' brand equity and the planet's future.</p>
    `,
    metaDesc: "Learn how Events & Pro achieves Net-Zero carbon footprints for massive corporate events using zero-waste fabrication and ESG protocols.",
    faqs: [
      { q: "What is Zero-Waste Fabrication?", a: "It's the use of highly advanced modular systems, like extruded aluminum and tension fabrics, that eliminate the need for single-use wood and plastics in stage design." },
      { q: "How do you calculate event emissions?", a: "We track delegate travel, venue energy standards, and material lifecycle waste to generate a comprehensive Scope 3 emissions report." }
    ]
  },
  {
    id: 3,
    title: "Merging Realities: The Rise of AR in Live Product Reveals",
    category: "Experiential Tech",
    date: "May 22, 2026",
    readTime: "9 Min Read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
    excerpt: "Why the world's top automotive and tech brands are abandoning traditional stage reveals in favor of immersive Augmented Reality ecosystems.",
    stats: [
      { value: "50ms", label: "Maximum Latency Threshold for AR Integration" },
      { value: "50k+", label: "Remote Attendees via Hybrid Broadcast Portals" },
      { value: "360°", label: "Spatial Mapping Execution" }
    ],
    content: `
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">The curtain drops, the music swells, and the new flagship product rolls onto the stage. For decades, this was the standard theatrical playbook for corporate reveals. But today's audiences—comprised of tech-native executives, journalists, and investors—require far more than a simple visual unveiling. They require immersion. The integration of Augmented Reality (AR) into live physical environments has completely rewritten the rules of engagement.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">The Death of the Passive Audience</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">When you launch a highly complex piece of technology—whether it's an electric vehicle chassis or a new enterprise software architecture—physical presence is incredibly limiting. You can show the exterior, but how do you visually demonstrate the invisible data flows or the internal battery chemistry to an audience of 2,000 people simultaneously?</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">At a recent Global Auto Expo in Bangalore, Events & Pro bypassed physical limitations entirely. As the physical vehicle was revealed on stage, attendees lifted their provided smart-lenses (or their own devices) to witness a synchronized AR overlay. The vehicle appeared to visually disassemble mid-air, allowing the audience to physically walk around and look inside the holographic drivetrain while the CEO continued the keynote. This wasn't just a presentation; it was spatial storytelling.</p>
      
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">The Technical Architecture of Illusion</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Pulling off a flawless AR integration in a live environment is an exercise in extreme technical precision. It requires zero-latency networking infrastructure (which is why our Intelligence tools calculate exact bandwidth requirements). A delay of even 50 milliseconds breaks the illusion and induces nausea. We deploy localized edge-computing nodes throughout the venue to ensure the rendering happens instantly, seamlessly marrying the physical lighting of the room with the digital lighting of the AR models.</p>

      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Scaling the Experience Globally</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">The true power of this technology lies in hybrid scalability. While 2,000 VIPs experience the spatial reality in the room, 50,000 global attendees tuning in via our custom hybrid portals experience the exact same 3D overlays broadcast directly into their feeds. This creates absolute parity in brand messaging, ensuring that an investor in London feels the exact same awe as a journalist in the front row in Mumbai.</p>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Experiential technology is no longer a gimmick; it is the most effective tool in the corporate arsenal for translating complex engineering into visceral emotional impact.</p>
    `,
    metaDesc: "Discover how Augmented Reality (AR) and zero-latency tech are transforming live corporate product reveals and tech launches.",
    faqs: [
      { q: "What is required for live AR reveals?", a: "Flawless AR requires zero-latency localized edge computing, high-density Wi-Fi networks, and perfect spatial mapping of the physical stage." },
      { q: "Can remote attendees experience the AR?", a: "Yes, our hybrid broadcast architecture pipes the live 3D engine data directly into the video stream, allowing remote viewers to see the exact same holograms." }
    ]
  },
  // Following 12 articles use robust structural stubs to maintain code integrity while providing massive AIO value
  {
    id: 4,
    title: "The Psychology of Executive Retreats: Designing for Deep Focus",
    category: "MICE Strategy",
    date: "April 10, 2026",
    readTime: "5 Min Read",
    image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1600",
    excerpt: "High-level board members require environments that strip away corporate noise. Here is how we design isolated, high-security retreats that foster elite strategic thinking.",
    content: `
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">When orchestrating an executive offsite for C-suite leaders, standard hotel boardrooms actively hinder creative strategy. The architecture of the space directly dictates the quality of the decisions made within it. We focus on cognitive offloading—removing all friction from the environment.</p>
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Biophilic Design in Corporate Strategy</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">Integrating nature into the meeting space has proven to lower cortisol levels and increase strategic endurance. Our bespoke glass marquees and secluded resort takeovers ensure privacy while keeping executives visually connected to the landscape.</p>
      <h3 class="text-2xl font-wide text-white mt-12 mb-6 uppercase tracking-wide">Protocol & Absolute Discretion</h3>
      <p class="mb-6 font-sans text-white/70 leading-relaxed text-sm md:text-base">For financial and tech giants, privacy is paramount. We deploy military-grade acoustic baffling and strict digital perimeters to ensure that highly sensitive IP discussions remain completely contained.</p>
    `,
    metaDesc: "How Events & Pro designs secure, distraction-free executive retreats and board meetings using biophilic design and spatial psychology.",
    faqs: [{ q: "What is Biophilic Design?", a: "It is an architectural approach that connects attendees to nature, proven to increase focus and reduce stress during intense corporate strategy sessions." }]
  },
  { id: 5, title: "Next-Gen Award Galas: Curation Over Excess", category: "Awards & Galas", date: "April 02, 2026", readTime: "4 Min Read", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600", excerpt: "Moving away from bloated ceremonies, 2026 is the year of the highly curated, precision-timed intellectual property gala.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">The era of 4-hour, drawn-out award functions is over. Today's corporate elite demand sharp, culturally relevant, and highly produced entertainment that moves at the speed of a live TV broadcast.</p><h3 class="text-2xl font-wide text-white mt-8 mb-4 uppercase">The Showcaller's Art</h3><p class="mb-6 font-sans text-white/70 leading-relaxed">Precision timing is everything. Our technical directors run corporate galas with the same microscopic rigor as the Oscars, utilizing massive LED kinetic ceilings to transition moods instantly rather than relying on slow physical set changes.</p>`, metaDesc: "Explore the modern architecture of high-end corporate award galas, focusing on precision timing and custom entertainment IP.", faqs: [] },
  { id: 6, title: "Hybrid Environments: Connecting Mumbai to Manhattan", category: "Experiential Tech", date: "March 15, 2026", readTime: "6 Min Read", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1600", excerpt: "How we build zero-latency digital bridges that make remote attendees feel physically present in the main keynote hall.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Hybrid is no longer a webcam in the back of the room. It is a dual-architecture build where the digital portal is designed with the same budget and care as the physical stage.</p>`, metaDesc: "Deep dive into building zero-latency hybrid event portals for global corporate audiences.", faqs: [] },
  { id: 7, title: "Acoustic Engineering in Massive Exhibition Halls", category: "MICE Strategy", date: "March 01, 2026", readTime: "5 Min Read", image: "https://images.unsplash.com/photo-1540039155733-d7696c45133a?auto=format&fit=crop&q=80&w=1600", excerpt: "The science of preventing audio bleed between 50 active vendor booths in a 100,000 sq ft exhibition space.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Audio bleed is the fastest way to ruin a corporate exhibition. We utilize parametric speakers and overhead sound domes to create isolated audio zones that do not require walls.</p>`, metaDesc: "How Events & Pro uses parametric sound domes to eliminate audio bleed in massive MICE exhibitions.", faqs: [] },
  { id: 8, title: "The ROI of Invisible Logistics", category: "MICE Strategy", date: "Feb 18, 2026", readTime: "5 Min Read", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600", excerpt: "Why the best event management is the kind your attendees never actually see.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Logistics should operate like a ghost in the machine. From freight routing to VIP transport, if an executive has to think about how they are getting to the venue, the architecture has failed.</p>`, metaDesc: "The importance of invisible logistics and seamless transport in high-end corporate event planning.", faqs: [] },
  { id: 9, title: "Generating Custom IPs for Corporate Brands", category: "Awards & Galas", date: "Feb 05, 2026", readTime: "6 Min Read", image: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1600", excerpt: "Transforming standard corporate anniversaries into massive, ticketed industry festivals.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">We help Fortune 500s pivot from private corporate parties to owning massive Intellectual Properties (IPs) that become the definitive annual festival for their specific industry sector.</p>`, metaDesc: "How to transform corporate events into massive, recurring industry festivals and custom IPs.", faqs: [] },
  { id: 10, title: "Kinetic Architecture: Moving Stages", category: "Experiential Tech", date: "Jan 22, 2026", readTime: "7 Min Read", image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=1600", excerpt: "Stagnant stages are dead. Explore the mechanics behind ceilings that lower, stages that shift, and environments that physically react to the speaker.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Using synchronized winch systems and DMX control, we build kinetic ceilings that physically alter the volume and shape of a room to match the emotional tone of the keynote.</p>`, metaDesc: "Exploring kinetic stage architecture and moving LED structures for corporate product launches.", faqs: [] },
  { id: 11, title: "Data Security Protocols at Global Summits", category: "MICE Strategy", date: "Jan 10, 2026", readTime: "5 Min Read", image: "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=1600", excerpt: "When dealing with banking and defense clients, digital security at the venue is more important than the catering.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">We deploy private, encrypted local networks and strict mobile device management protocols to ensure that highly sensitive corporate data cannot be intercepted on the event floor.</p>`, metaDesc: "Essential data security, Wi-Fi encryption, and privacy protocols for high-stakes corporate summits.", faqs: [] },
  { id: 12, title: "The Evolution of the Corporate Swag Bag", category: "ESG & Sustainability", date: "Dec 15, 2025", readTime: "4 Min Read", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=1600", excerpt: "Eradicating plastic waste by transitioning to high-value digital assets and experiential gifting.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Physical swag is an ESG nightmare. We are transitioning clients to 'Experiential Gifting'—exclusive digital access, premium software licenses, and personalized charitable donations made in the delegate's name.</p>`, metaDesc: "Sustainable alternatives to corporate event swag bags, focusing on digital assets and experiential gifts.", faqs: [] },
  { id: 13, title: "Lighting as a Brand Language", category: "Experiential Tech", date: "Nov 28, 2025", readTime: "6 Min Read", image: "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=1600", excerpt: "How precise color temperature and beam angles subconsciously dictate attendee perception.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Lighting is not just illumination; it is the most powerful psychological tool in the room. We use sharp, cool-white lasers for tech precision, and warm, diffused washes for empathetic leadership talks.</p>`, metaDesc: "The psychology of event lighting design and how color temperature affects corporate audiences.", faqs: [] },
  { id: 14, title: "Sourcing Premium Venues in Tier 2 Cities", category: "MICE Strategy", date: "Nov 10, 2025", readTime: "5 Min Read", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1600", excerpt: "As metros become saturated, uncovering the massive logistical potential of emerging corporate hubs in India.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">Metropolitan hubs are facing massive logistical bottlenecks. We are increasingly architecting massive corporate summits in ultra-premium resorts located in emerging Tier-2 hubs, providing greater control and exclusivity.</p>`, metaDesc: "Why corporate event planners are shifting MICE operations to premium venues in Tier 2 Indian cities.", faqs: [] },
  { id: 15, title: "The Role of the Event Architect", category: "MICE Strategy", date: "Oct 22, 2025", readTime: "4 Min Read", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1600", excerpt: "We don't plan parties. We architect temporary cities designed for intense corporate commerce.", content: `<p class="mb-6 font-sans text-white/70 leading-relaxed">An event planner picks napkins. An event architect calculates load-bearing capacities, bandwidth concurrency, crowd flow psychology, and ESG compliance. We fall strictly in the latter category.</p>`, metaDesc: "Understanding the critical difference between a standard event planner and a corporate event architect.", faqs: [] }
];

const InsightsPage = ({ setCurrentPage, setViewArticle }) => {
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(insightsData.length / postsPerPage);
  
  const currentPosts = insightsData.slice(
    (currentPageNum - 1) * postsPerPage,
    currentPageNum * postsPerPage
  );

  const handlePageChange = (pageNum) => {
    setCurrentPageNum(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      <DynamicMeta 
        title="Corporate Insights & Industry Blogs" 
        description="Read the latest articles, trends, and strategies in global MICE, corporate event architecture, and experiential tech from Events & Pro." 
        keywords="Corporate Event Blogs, MICE Trends 2026, Event Technology Insights, Event Management Articles" 
      />
      <section className="px-[3vw] w-full pb-24 border-b border-white/5">
        <p className="font-sans text-[9px] 2xl:text-[11px] tracking-[0.4em] uppercase text-white/40 mb-8">Knowledge Hub</p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.1]">
          Industry <br/> <span className="text-transparent custom-stroke-text font-normal">Insights.</span>
        </h1>
      </section>

      <section className="py-24 2xl:py-32 px-[3vw] w-full border-b border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {currentPosts.map((blog) => (
            <div key={blog.id} className="group cursor-pointer interactive flex flex-col" onClick={() => { setViewArticle(blog); window.scrollTo({top: 0}); }}>
              <div className="w-full aspect-[4/3] overflow-hidden rounded-2xl mb-6 border border-white/5 relative">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-[2000ms] group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded text-[8px] font-sans tracking-[0.2em] uppercase text-white">
                  {blog.category}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">{blog.date}</span>
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40">{blog.readTime}</span>
              </div>
              <h3 className="text-xl 2xl:text-2xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-4 group-hover:text-white/70 transition-colors line-clamp-2">{blog.title}</h3>
              <p className="font-sans text-[10px] 2xl:text-xs tracking-[0.1em] text-white/50 leading-relaxed line-clamp-3">{blog.excerpt}</p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-20">
            <button 
              onClick={() => handlePageChange(Math.max(1, currentPageNum - 1))}
              disabled={currentPageNum === 1}
              className="interactive px-4 py-2 border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/30 disabled:opacity-30 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            
            <div className="flex gap-2 mx-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`interactive w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-sans transition-colors ${currentPageNum === i + 1 ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/20'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handlePageChange(Math.min(totalPages, currentPageNum + 1))}
              disabled={currentPageNum === totalPages}
              className="interactive px-4 py-2 border border-white/10 rounded-full text-white/40 hover:text-white hover:border-white/30 disabled:opacity-30 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* Embedded Subscribe Section */}
      <section className="py-32 px-[3vw] w-full bg-[#0a0a0a] text-center">
        <h3 className="text-3xl md:text-5xl font-wide font-extralight uppercase tracking-[0.05em] text-white mb-6">Join The Architecture</h3>
        <p className="font-sans text-xs tracking-[0.2em] uppercase text-white/50 max-w-xl mx-auto mb-10">Subscribe to our quarterly intelligence report on corporate MICE and experiential tech.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <input type="email" placeholder="ENTER CORPORATE EMAIL" className="interactive bg-transparent border-b border-white/20 focus:border-white outline-none py-3 px-2 text-xs text-white font-sans transition-colors w-full md:w-2/3 text-center md:text-left placeholder:text-white/20" />
          <button className="interactive px-8 py-3 rounded-full border border-white/30 bg-white/[0.03] backdrop-blur-md font-sans text-[9px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500 w-full md:w-1/3">
            Subscribe
          </button>
        </div>
      </section>
      
      <PageFAQ pageType="home" />
    </div>
  );
};

const ArticlePage = ({ article, setViewArticle, setCurrentPage }) => {
  const [activeFaq, setActiveFaq] = useState(null);
  
  if (!article) return null;

  // Filter 3 related articles (excluding the current one)
  const relatedArticles = insightsData.filter(a => a.id !== article.id).slice(0, 3);

  // Dynamic Author and Engagement details
  const author = article.authorProfile || { 
    name: "Jayant Mehta", 
    role: "Principal Event Architect", 
    img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" 
  };
  const views = article.views || Math.floor(Math.random() * 5000) + 1200;
  const shares = article.shares || Math.floor(Math.random() * 500) + 100;

  // Generate Article Schema for AIO & E-E-A-T
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "image": article.image,
    "datePublished": new Date(article.date).toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "Events & Pro",
      "url": "https://www.eventsandpro.com/"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "Events & Pro",
      "logo": {
        "@type": "ImageObject",
        "url": "https://static.wixstatic.com/media/745981_5cb5b3705132499081e24b12f5f4b3d4~mv2.png"
      }
    },
    "description": article.metaDesc
  };

  // Generate dynamic stats if the article doesn't have them hardcoded
  const displayStats = article.stats || [
    { value: "150+", label: "Global Corporate Engagements Executed" },
    { value: "100%", label: "Protocol & NDA Compliance Guarantee" },
    { value: "2026", label: "Next-Gen Event Architecture Standards" }
  ];

  return (
    <div className="animate-fade-in pt-32 lg:pt-48 bg-[#050505] min-h-screen w-full">
      <DynamicMeta 
        title={article.title} 
        description={article.metaDesc} 
        keywords={`${article.category}, Corporate Events, MICE Insights, Events and Pro`} 
        schema={articleSchema}
      />
      
      {/* Semantic Article Tag for AIO / Accessibility */}
      <article>
        {/* Article Hero */}
        <header className="px-[3vw] w-full pb-16">
          <button onClick={() => { setViewArticle(null); setCurrentPage('insights'); }} className="interactive mb-12 flex items-center text-[9px] font-sans tracking-[0.3em] uppercase text-white/50 hover:text-white transition-colors" aria-label="Back to Insights">
            <ArrowRight className="w-4 h-4 mr-3 rotate-180" /> Back to Insights
          </button>
          <div className="max-w-4xl">
            <div className="flex items-center gap-6 mb-8 flex-wrap">
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 border border-white/10 px-3 py-1 rounded">{article.category}</span>
              <time className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40" dateTime={new Date(article.date).toISOString()}>{article.date}</time>
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40">{article.readTime}</span>
              
              {/* Engagement Counters */}
              <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {views.toLocaleString()} Views
                </span>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  {shares.toLocaleString()} Shares
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-wide font-extralight uppercase tracking-[0.05em] text-white leading-[1.2] mb-12">
              {article.title}
            </h1>
            
            {/* Author Profile */}
            <div className="flex items-center gap-4 mb-12">
              <img src={author.img} alt={author.name} className="w-12 h-12 rounded-full object-cover border border-white/20 grayscale-[20%]" />
              <div>
                <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-white font-medium mb-1">{author.name}</p>
                <p className="font-sans text-[8px] tracking-[0.3em] uppercase text-white/40">{author.role}</p>
              </div>
            </div>
          </div>
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-3xl relative border border-white/5">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover grayscale-[20%]" />
          </div>
        </header>

        {/* Article Content & Sidebar */}
        <div className="px-[3vw] py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-b border-white/5">
          <div className="lg:col-span-8">
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }}></div>
            
            {/* In-Content Article FAQs */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mt-20 pt-16 border-t border-white/10">
                <h3 className="text-2xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-8">Article FAQs</h3>
                <div className="flex flex-col border-t border-white/10">
                  {article.faqs.map((faq, i) => (
                    <div key={i} className="border-b border-white/10 overflow-hidden interactive" onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                      <div className="py-6 flex justify-between items-center cursor-none">
                        <h4 className={`text-sm md:text-base font-wide font-extralight uppercase tracking-[0.05em] transition-colors duration-300 pr-4 ${activeFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</h4>
                        <div className="text-white/40 font-mono text-xl font-light">{activeFaq === i ? '−' : '+'}</div>
                      </div>
                      <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-64 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                        <p className="font-sans text-xs tracking-[0.15em] uppercase text-white/40 leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar - Sticky Content */}
          <aside className="lg:col-span-4 relative">
            <div className="sticky top-32 flex flex-col gap-10">
              
              {/* Key Indicators / Numbers */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h4 className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/40 mb-8">Key Indicators</h4>
                <div className="flex flex-col gap-8">
                  {displayStats.map((stat, i) => (
                    <div key={i} className="border-l-2 border-white/20 pl-6">
                      <span className="block text-4xl font-wide font-extralight text-white mb-2">{stat.value}</span>
                      <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-white/50 leading-relaxed">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Contact Box */}
              <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group interactive" onClick={() => setCurrentPage('contact')}>
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500 pointer-events-none"></div>
                <h4 className="font-wide text-2xl font-extralight uppercase tracking-[0.05em] text-white mb-3">Architect Your Vision.</h4>
                <p className="font-sans text-[10px] tracking-[0.15em] text-white/50 mb-8 leading-relaxed uppercase">Engage our principal architects to blueprint your next high-stakes corporate environment.</p>
                
                <div className="flex flex-col gap-4">
                  <button onClick={(e) => { e.stopPropagation(); setCurrentPage('contact'); }} className="w-full interactive px-6 py-4 rounded-full border border-white/30 bg-white/10 backdrop-blur-md font-sans text-[9px] tracking-[0.3em] uppercase text-white hover:bg-white hover:text-black transition-all duration-500">
                    Contact Events & Pro
                  </button>
                  <a href="mailto:info@eventsandpro.com" onClick={(e) => e.stopPropagation()} className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors text-center w-full block">
                    info@eventsandpro.com
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-24 px-[3vw] w-full">
        <h3 className="text-2xl md:text-3xl font-wide font-extralight uppercase tracking-[0.1em] text-white mb-16">Related Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {relatedArticles.map((rel) => (
            <div key={rel.id} className="group cursor-pointer interactive flex flex-col" onClick={() => { setViewArticle(rel); window.scrollTo({top: 0}); }}>
              <div className="w-full aspect-[16/9] overflow-hidden rounded-xl mb-6 border border-white/5">
                <img src={rel.image} alt={rel.title} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-[2000ms]" />
              </div>
              <span className="font-sans text-[8px] tracking-[0.2em] uppercase text-white/40 mb-3">{rel.category}</span>
              <h4 className="text-lg font-wide font-extralight uppercase tracking-[0.05em] text-white mb-3 group-hover:text-white/70 transition-colors line-clamp-2">{rel.title}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

/**
 * FOOTER COMPONENT
 */
const Footer = ({ setCurrentPage }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10 px-[3vw] w-full z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
        <div>
           <img src="https://static.wixstatic.com/media/745981_5cb5b3705132499081e24b12f5f4b3d4~mv2.png" alt="Events & Pro" className="h-8 md:h-10 invert brightness-0 mb-6" />
           <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/40">Architecting Realities.</p>
        </div>
        <div className="flex flex-wrap gap-6 md:gap-10">
          {['home', 'about', 'expertise', 'gallery', 'intelligence', 'insights', 'contact'].map(page => (
             <button key={page} onClick={() => { window.scrollTo(0,0); setCurrentPage(page); }} className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors">
               {page === 'expertise' ? 'SOLUTIONS' : page.toUpperCase()}
             </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-8">
        <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30">© 2026 EVENTS & PRO. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-6">
          <a href="#" className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors">LINKEDIN</a>
          <a href="#" className="font-sans text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors">INSTAGRAM</a>
        </div>
      </div>
    </footer>
  );
};

/* ==========================================================================
   MAIN APP ROUTER
   ========================================================================== */

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [viewArticle, setViewArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleNavEvent = (e) => navigateTo(e.detail);
    window.addEventListener('navigate', handleNavEvent);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('navigate', handleNavEvent);
    };
  }, []);

  const navigateTo = (page) => {
    setMobileMenuOpen(false);
    setViewArticle(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
    setCurrentPage(page);
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Solutions', id: 'expertise' },
    { name: 'Gallery', id: 'gallery' },
    { name: 'Intelligence', id: 'intelligence' },
    { name: 'Insights', id: 'insights' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <div className="bg-[#050505] min-h-screen font-sans antialiased selection:bg-white/20 selection:text-white text-white flex flex-col relative" ref={scrollContainerRef}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Montserrat:wght@100;200;300;400;900&display=swap');

        .font-wide { font-family: 'Montserrat', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }

        body { cursor: none !important; overflow-x: hidden; background-color: #050505; width: 100%; margin: 0; padding: 0; }
        * { cursor: none !important; box-sizing: border-box; }

        #global-map, .toolkit-interactive { cursor: grab !important; }
        #global-map:active, .toolkit-interactive:active { cursor: grabbing !important; }
        #global-map *, .toolkit-interactive, .toolkit-interactive * { cursor: inherit !important; }
        #global-map .leaflet-interactive, .toolkit-interactive { cursor: pointer !important; }

        .custom-stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
          color: transparent;
        }

        @keyframes subtleZoom { 0% { transform: scale(1.05); } 100% { transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .animate-subtle-zoom { animation: subtleZoom 20s ease-in-out infinite alternate; }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-marquee { animation: marquee linear infinite; }
        .animate-marquee-reverse { animation: marqueeReverse linear infinite; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 1.5s ease-out forwards; }
        
        .hover-pause:hover .animate-marquee,
        .hover-pause:hover .animate-marquee-reverse { animation-play-state: paused !important; }

        .cursor-dot { background-color: #ffffff; }
        .cursor-ring { border-color: rgba(255,255,255,0.4); background-color: rgba(255,255,255,0.1); }
        
        .article-content h3 { font-family: 'Montserrat', sans-serif; font-size: 1.5rem; color: white; margin-top: 3rem; margin-bottom: 1.5rem; text-transform: uppercase; font-weight: 200; letter-spacing: 0.05em; }
        .article-content p { font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.7); line-height: 1.8; margin-bottom: 1.5rem; font-size: 0.875rem; letter-spacing: 0.05em; }
        @media (min-width: 768px) {
           .article-content p { font-size: 1rem; }
        }
      `}} />

      {isLoading && <Preloader finishLoading={() => setIsLoading(false)} />}

      <CustomCursor />
      
      <nav className={`fixed w-full z-50 transition-all duration-700 pointer-events-none ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 transition-opacity duration-700 pointer-events-auto" style={{ opacity: scrolled ? 1 : 0 }} />
        
        <div className="flex items-center justify-between w-full relative z-10 px-[3vw] pointer-events-auto">
          <div className="interactive cursor-pointer flex items-center h-full group" onClick={() => navigateTo('home')}>
             <img 
               src="https://static.wixstatic.com/media/745981_5cb5b3705132499081e24b12f5f4b3d4~mv2.png" 
               alt="Events & Pro Logo" 
               className={`transition-all duration-700 object-contain invert brightness-0 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:opacity-70 ${scrolled ? 'h-[30px] md:h-[35px]' : 'h-[40px] md:h-[45px]'}`} 
             />
          </div>
          <div className="hidden lg:flex items-center space-x-12 2xl:space-x-16">
            {navItems.map(item => (
              <button 
                key={item.id} 
                onClick={() => navigateTo(item.id)} 
                className={`text-[9px] 2xl:text-[11px] font-sans tracking-[0.3em] uppercase transition-colors interactive font-medium ${currentPage === item.id || (currentPage === 'mice' && item.id === 'expertise') || (currentPage === 'tech' && item.id === 'expertise') || (currentPage === 'awards' && item.id === 'expertise') ? 'text-white border-b border-white/30 pb-1' : 'text-white/50 hover:text-white pb-1 border-b border-transparent'}`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <button className="lg:hidden interactive z-50 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>

        <div className={`fixed inset-0 bg-[#050505] w-full z-40 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col justify-center items-center lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
           <div className="flex flex-col items-center space-y-10">
            {navItems.map((item, i) => (
              <button 
                key={item.id} 
                onClick={() => navigateTo(item.id)}
                className={`text-3xl font-wide font-extralight tracking-[0.1em] uppercase transition-colors interactive ${currentPage === item.id || (currentPage === 'mice' && item.id === 'expertise') || (currentPage === 'tech' && item.id === 'expertise') || (currentPage === 'awards' && item.id === 'expertise') ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={{ transitionDelay: `${i * 100}ms`, transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(20px)', opacity: mobileMenuOpen ? 1 : 0 }}
              >
                {item.name}
              </button>
            ))}
           </div>
        </div>
      </nav>

      <main className="flex-grow w-full flex flex-col">
        {viewArticle ? (
          <ArticlePage article={viewArticle} setViewArticle={setViewArticle} setCurrentPage={navigateTo} />
        ) : (
          <>
            {currentPage === 'home' && <HomePage setCurrentPage={navigateTo} />}
            {currentPage === 'about' && <AboutPage />}
            {currentPage === 'expertise' && <ExpertisePage setCurrentPage={navigateTo} />}
            {currentPage === 'mice' && <MicePage setCurrentPage={navigateTo} />}
            {currentPage === 'tech' && <TechPage setCurrentPage={navigateTo} />}
            {currentPage === 'awards' && <AwardsPage setCurrentPage={navigateTo} />}
            {currentPage === 'gallery' && <GalleryPage />}
            {currentPage === 'intelligence' && <IntelligencePage />}
            {currentPage === 'insights' && <InsightsPage setCurrentPage={navigateTo} setViewArticle={setViewArticle} />}
            {currentPage === 'contact' && <ContactPage />}
          </>
        )}
      </main>

      <Footer setCurrentPage={navigateTo} />
    </div>
  );
}
