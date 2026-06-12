import React, { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(10, 10, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 500px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', letterSpacing: '0.05em', color: '#fff', fontWeight: 600 }}>WE VALUE YOUR PRIVACY</h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            This site uses cookies and related technologies, as described in our privacy policy, for purposes that may include site operation, analytics, enhanced user experience, or advertising. You may choose to consent to our use of these technologies, or manage your own preferences.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleConsent('manage')}
            style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Manage choices
          </button>
          <button 
            onClick={() => handleConsent('reject')}
            style={{ padding: '10px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Reject All
          </button>
          <button 
            onClick={() => handleConsent('agree')}
            style={{ padding: '10px 20px', background: '#22D3EE', border: 'none', color: '#000', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
          >
            Agree & Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
