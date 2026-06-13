import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();

  const isEn = i18n.language === 'en';

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice) => {
    localStorage.setItem('cookie_consent', choice);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ x: "-50%", y: 100, opacity: 0, scale: 0.95 }}
          animate={{ x: "-50%", y: 0, opacity: 1, scale: 1 }}
          exit={{ x: "-50%", y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            maxWidth: 900,
            width: 'calc(100% - 32px)',
            background: 'rgba(20, 20, 22, 0.75)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: '24px 32px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          className="cookie-banner-container"
        >
          <style>{`
            @media (max-width: 768px) {
              .cookie-banner-container {
                flex-direction: column !important;
                align-items: stretch !important;
                padding: 24px !important;
                gap: 20px !important;
              }
              .cookie-buttons {
                flex-direction: column !important;
                width: 100%;
              }
              .cookie-buttons button {
                width: 100%;
              }
            }
          `}</style>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: '0 0 8px 0', 
              fontSize: 17, 
              fontWeight: 600, 
              color: '#f5f5f7',
              fontFamily: 'var(--sf-display, sans-serif)',
              letterSpacing: '-0.01em'
            }}>
              {isEn ? "Privacy & Cookies" : "Конфіденційність та файли Cookie"}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: 14, 
              color: 'rgba(245,245,247,0.6)', 
              lineHeight: 1.5,
              fontFamily: 'var(--sf-text, sans-serif)',
              letterSpacing: '-0.01em'
            }}>
              {isEn 
                ? "This site uses cookies to improve your experience, analyze site usage, and support our marketing efforts. By clicking 'Agree', you consent to our use of cookies."
                : "Цей сайт використовує файли cookie для покращення вашого досвіду, аналізу використання сайту та підтримки нашого маркетингу. Натискаючи «Прийняти», ви погоджуєтесь з їх використанням."}
            </p>
          </div>
          
          <div className="cookie-buttons" style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <button 
              onClick={() => handleConsent('reject')}
              style={{ 
                padding: '12px 20px', 
                background: 'rgba(255,255,255,0.06)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                color: '#f5f5f7', 
                borderRadius: 14, 
                cursor: 'pointer', 
                fontSize: 14, 
                fontWeight: 500,
                fontFamily: 'var(--sf-text, sans-serif)',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseOver={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.06)'}
            >
              {isEn ? "Reject All" : "Відхилити"}
            </button>
            <button 
              onClick={() => handleConsent('agree')}
              style={{ 
                padding: '12px 24px', 
                background: '#f5f5f7', 
                border: 'none', 
                color: '#000', 
                borderRadius: 14, 
                cursor: 'pointer', 
                fontSize: 14, 
                fontWeight: 600,
                fontFamily: 'var(--sf-text, sans-serif)',
                transition: 'transform 0.1s, opacity 0.2s',
                boxShadow: '0 2px 10px rgba(255,255,255,0.1)',
                whiteSpace: 'nowrap'
              }}
              onMouseDown={e => e.target.style.transform = 'scale(0.96)'}
              onMouseUp={e => e.target.style.transform = 'scale(1)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'}
            >
              {isEn ? "Agree" : "Прийняти"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
