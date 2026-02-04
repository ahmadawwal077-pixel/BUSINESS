import React, { useEffect, useState } from 'react';

const ANALYTICS_KEY = 'ph_analytics_consent';

const injectPlausible = () => {
  if (window.plausible) return;
  const script = document.createElement('script');
  script.setAttribute('defer', '');
  script.setAttribute('data-domain', window.location.hostname);
  script.src = 'https://plausible.io/js/plausible.js';
  document.head.appendChild(script);
};

const AnalyticsConsent = () => {
  const [consent, setConsent] = useState(() => {
    try {
      return localStorage.getItem(ANALYTICS_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (consent) injectPlausible();
  }, [consent]);

  if (consent) return null;

  const accept = () => {
    try { localStorage.setItem(ANALYTICS_KEY, 'true'); } catch (e) {}
    setConsent(true);
  };
  const decline = () => {
    try { localStorage.setItem(ANALYTICS_KEY, 'false'); } catch (e) {}
    setConsent(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 2000, display: 'flex', justifyContent: 'center' }} aria-live="polite">
      <div style={{ maxWidth: 900, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '1rem', borderRadius: 10, display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <strong>Analytics</strong>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>We use anonymized analytics to improve the experience. Enable analytics?</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={decline} style={{ background: 'transparent', color: 'white', padding: '0.6rem 0.9rem', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)' }}>Decline</button>
          <button onClick={accept} style={{ background: 'white', color: '#0066cc', padding: '0.6rem 0.9rem', borderRadius: 8, fontWeight: 700 }}>Enable</button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsConsent;
