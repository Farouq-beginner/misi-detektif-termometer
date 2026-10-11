"use client";

import { useEffect } from "react";

export default function ClearLegacyCache() {
  useEffect(() => {
    const clearLegacyData = async () => {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
      }

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map((cacheName) => window.caches.delete(cacheName)));
      }

      window.localStorage.removeItem("termo-cache-consent-v2");
      document.cookie = "termo-cache-consent=; Max-Age=0; Path=/; SameSite=Lax";
    };

    void clearLegacyData();
  }, []);

  return null;
}
