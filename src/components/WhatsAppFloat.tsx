import React from 'react';
import { useLocation } from 'react-router-dom';

const WhatsAppFloat = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/register';

  if (isAuthPage) return null;

  const handleWhatsAppClick = async () => {
    // Read current page's dynamic OG meta tags
    const ogTitle =
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      document.title ||
      'Explore Flutter Ready-Made App Solutions & Templates';

    const ogDescription =
      document.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      'Get high-quality, customizable on-demand app source codes for Android and iOS — ideal for startups and developers.';

    const rawImage =
      document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

    const pageUrl = window.location.href;

    const message = `${ogTitle} 🚀\n\n${ogDescription}\n\n🔗 Visit:\n${pageUrl}`;

    // Resolve relative og:image URLs to absolute before fetching
    const imageUrl = rawImage
      ? rawImage.startsWith('http')
        ? rawImage
        : `${window.location.origin}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
      : '';

    // On mobile: try Web Share API with image file
    if (imageUrl && navigator.share) {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error('image fetch failed');
        const blob = await response.blob();
        const ext = blob.type.split('/')[1] || 'jpg';
        const file = new File([blob], `share.${ext}`, { type: blob.type });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], text: message });
          return;
        }
      } catch {
        // fall through to wa.me link
      }
    }

    // Fallback (desktop / unsupported browsers): open WhatsApp with encoded text
    window.open(`https://wa.me/919316147661?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-6 w-6" fill="currentColor">
        <path d="M16.04 4C9.42 4 4.04 9.33 4.04 15.88c0 2.1.56 4.15 1.62 5.94L4 28l6.34-1.65a12.1 12.1 0 0 0 5.7 1.43c6.62 0 12-5.33 12-11.9C28.04 9.33 22.66 4 16.04 4Zm0 21.75c-1.82 0-3.6-.49-5.15-1.42l-.37-.22-3.76.98 1-3.62-.24-.38a9.7 9.7 0 0 1-1.48-5.21c0-5.43 4.48-9.85 10-9.85s10 4.42 10 9.85-4.48 9.87-10 9.87Zm5.48-7.38c-.3-.15-1.78-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.15-.17.2-.35.22-.65.08-.3-.15-1.27-.46-2.42-1.48-.9-.79-1.5-1.77-1.67-2.07-.18-.29-.02-.45.13-.6.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.59-.92-2.18-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.08-.8.37-.27.3-1.04 1-1.04 2.45s1.07 2.85 1.22 3.05c.15.2 2.1 3.17 5.1 4.45.71.3 1.27.48 1.7.62.72.23 1.37.2 1.89.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35Z" />
      </svg>
    </button>
  );
};

export default WhatsAppFloat;
