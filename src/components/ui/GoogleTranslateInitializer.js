'use client';

import { useEffect } from 'react';

export default function GoogleTranslateInitializer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    function initializeTranslate() {
      if (window.google && window.google.translate && window.google.translate.TranslateElement) {
        if (!document.getElementById('google_translate_element')) {
          const container = document.createElement('div');
          container.id = 'google_translate_element';
          container.style.display = 'none';
          document.body.appendChild(container);
        }
        // Create only once
        if (!window.__gt_initialized) {
          window.__gt_initialized = true;
          // eslint-disable-next-line no-new
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,es',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            },
            'google_translate_element'
          );
        }
      }
    }

    // If script already present, just init
    if (document.getElementById('google-translate-script')) {
      initializeTranslate();
      return;
    }

    // Load Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=__googleTranslateElementLoaded';
    script.async = true;
    window.__googleTranslateElementLoaded = initializeTranslate;
    document.body.appendChild(script);

    return () => {
      // Keep script and element to avoid reloading on route change
    };
  }, []);

  return null;
}

