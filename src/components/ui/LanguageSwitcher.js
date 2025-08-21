'use client';

import { useEffect, useState } from 'react';

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export default function LanguageSwitcher({ className = '' }) {
  const [current, setCurrent] = useState('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Read google cookie to sync state on load
    const cookie = getCookie('googtrans');
    if (cookie) {
      const parts = cookie.split('/');
      const lang = parts[2] || 'en';
      setCurrent(lang);
    }
  }, []);

  const changeLanguage = (lang) => {
    setCurrent(lang);
    // Set Google translate cookies
    setCookie('googtrans', `/en/${lang}`, 365);
    setCookie('googtrans', `/en/${lang}`, 365, window.location.hostname);
    setCookie('googtrans', `/en/${lang}`, 365, `.${window.location.hostname}`);

    // Update the hidden select if available
    const select = document.querySelector('select.goog-te-combo');
    if (select) {
      select.value = lang;
      const event = document.createEvent('HTMLEvents');
      event.initEvent('change', true, true);
      select.dispatchEvent(event);
    } else {
      // If translate element not ready yet, reload once after a short delay
      setTimeout(() => {
        const sel = document.querySelector('select.goog-te-combo');
        if (sel) {
          sel.value = lang;
          const ev = document.createEvent('HTMLEvents');
          ev.initEvent('change', true, true);
          sel.dispatchEvent(ev);
        }
      }, 500);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <select
        aria-label="Language"
        value={current}
        onChange={(e) => changeLanguage(e.target.value)}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white text-gray-700 hover:border-gray-400 focus:outline-none"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
}

