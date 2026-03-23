import React, { useState, useRef, useEffect } from 'react';
import ZimmerSearch from './features/zimmer/components/zimmerSearch/zimmerSearch';
import ZimmerList from './features/zimmer/components/zimmerList/zimmerList';
import ZimmerMap from './features/zimmer/components/zimmerMap/zimmerMap';
import { useSearchZimmersQuery, ZimmerSearchDto } from './features/zimmer/redux/zimmerApi';
import { Zimmer } from './features/zimmer/redux/zimmerSlice';
import './App.css';

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="footer-inner">

      <div className="footer-top">

        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-main">Zimmer</span>
            <span className="footer-logo-accent">Match</span>
          </div>
          <p className="footer-tagline">
            המקום הטוב ביותר למצוא צימר מושלם לחופשה שלך — מהגולן ועד אילת.
          </p>

          <div className="footer-logomark">
            <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 38 L18 10 L34 38 Z" stroke="rgba(200,169,110,0.7)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <path d="M20 38 L34 16 L48 38 Z" stroke="rgba(200,169,110,0.55)" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
              <path d="M36 38 L48 22 L60 38 Z" stroke="rgba(200,169,110,0.4)" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
              <circle cx="48" cy="8" r="4" stroke="rgba(200,169,110,0.6)" strokeWidth="1.2" fill="none"/>
              <line x1="2" y1="38" x2="62" y2="38" stroke="rgba(200,169,110,0.3)" strokeWidth="0.8"/>
            </svg>
          </div>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">ניווט</p>
          <ul>
            <li><span onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>דף הבית</span></li>
            <li><span>כל הצימרים</span></li>
            <li><span>חיפוש על המפה</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">צור קשר</p>
          <ul>
            <li><span>info@zimmermatch.co.il</span></li>
            <li><span>03-XXX-XXXX</span></li>
            <li><span>ימים א׳–ה׳, 09:00–18:00</span></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© {new Date().getFullYear()} ZimmerMatch · כל הזכויות שמורות</span>
        <div className="footer-emblem">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1 L13 8 H10 L13 13 H3 L6 8 H3 Z"
              stroke="rgba(200,169,110,0.7)" strokeWidth="1" fill="none" strokeLinejoin="round"/>
            <line x1="8" y1="13" x2="8" y2="15" stroke="rgba(200,169,110,0.7)" strokeWidth="1"/>
          </svg>
          <span className="footer-emblem-text">טבע · רוגע · חופשה</span>
        </div>
      </div>

    </div>
  </footer>
);

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useState<ZimmerSearchDto>({});
  const { data: zimmers, isLoading } = useSearchZimmersQuery(searchParams);

  const scrollRef = useRef<HTMLDivElement>(null);
  const mapRef    = useRef<HTMLDivElement>(null);

  const handleSearchChange = (params: ZimmerSearchDto) => {
    setSearchParams(prev =>
      JSON.stringify(prev) === JSON.stringify(params) ? prev : params
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollLeft + (direction === 'left' ? -420 : 420),
        behavior: 'smooth',
      });
    }
  };

  const scrollToMap = () => mapRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [zimmers]);

  return (
    <>
      <div className="home-page">

        <section className="hero-section">
          <video autoPlay muted loop playsInline className="background-video">
            <source src="back.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay-content">
            <div className="hero-badge">חופשה מושלמת בישראל</div>
            <h1 className="hero-title">
              <span>חפשו</span> את הצימר שלכם
            </h1>
            <p className="hero-subtitle">מאות צימרים ברחבי הארץ — מהגולן ועד אילת</p>
            <ZimmerSearch onSearchChange={handleSearchChange} onToggleMap={scrollToMap} />
          </div>
        </section>

        <div className="content-area">
          {isLoading ? (
            <div className="loading">טוענים את הצימרים הטובים ביותר…</div>
          ) : (
            <>
              <div className="recommendations-section reveal">
                <div className="section-header">
                  <div>
                    <p className="section-label">נבחרים</p>
                    <h2>מומלצים עבורכם</h2>
                  </div>
                  <div className="slider-nav">
                    <button className="nav-btn" onClick={() => scroll('right')}>❯</button>
                    <button className="nav-btn" onClick={() => scroll('left')}>❮</button>
                  </div>
                </div>
                <div className="horizontal-scroll-viewport" ref={scrollRef}>
                  <ZimmerList zimmers={(zimmers as Zimmer[]) ?? []} viewType="grid" />
                </div>
              </div>

              <div className="section-divider"><span>◆ ◆ ◆</span></div>

              <div className="reveal">
                <p className="section-label">כל הצימרים</p>
                <h2 className="main-list-title">עיינו בכל צימרים</h2>
                <div className="wide-list-container">
                  <ZimmerList zimmers={(zimmers as Zimmer[]) ?? []} viewType="list" />
                </div>
              </div>

              <div ref={mapRef} className="map-section reveal">
                <p className="section-label">מיקומים</p>
                <h2 className="section-title">חפשו על המפה</h2>
                <div className="map-card-container">
                  <ZimmerMap zimmers={(zimmers as Zimmer[]) ?? []} inline={true} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;