import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, Smartphone, MapPin } from 'lucide-react';

const Footer = () => {
  const handleFaqScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#faq';
    }
  };

  return (
    <footer className="relative mt-20">
      <div className="absolute inset-x-0 top-0 h-px opacity-70 divider-soft" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/25 to-black/35" />
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid min-w-0 grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info — DO NOT MODIFY */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AppSolutions</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Your premier destination for ready-made mobile app solutions.
              Transform your business with our cutting-edge applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="surface halo rounded-2xl p-3 text-gray-200/90 hover:text-white transition hover:-translate-y-px">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="surface halo rounded-2xl p-3 text-gray-200/90 hover:text-white transition hover:-translate-y-px">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="surface halo rounded-2xl p-3 text-gray-200/90 hover:text-white transition hover:-translate-y-px">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="surface halo rounded-2xl p-3 text-gray-200/90 hover:text-white transition hover:-translate-y-px">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'About', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'Terms of Service', to: '/terms' },
                { label: 'Privacy Policy', to: '/privacy' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm leading-relaxed"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/#faq"
                  onClick={handleFaqScroll}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm leading-relaxed cursor-pointer"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-w-0">
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@initiotechmedia.com"
                  className="flex min-w-0 items-start gap-2.5 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="min-w-0 break-all text-sm">contact@initiotechmedia.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919316147661"
                  className="flex min-w-0 items-center gap-2.5 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Phone className="h-4 w-4 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="min-w-0 text-sm">(+91) 9316147661</span>
                </a>
              </li>
              <li>
                <div className="flex min-w-0 items-start gap-2.5 text-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                  <address className="min-w-0 text-sm not-italic leading-relaxed">
                    <span className="block">908, B Square 2, Ambli Rd,</span>
                    <span className="block">near Hotel Double tree Hilton,</span>
                    <span className="block">Vikram Nagar, Ahmedabad,</span>
                    <span className="block">Gujarat 380054</span>
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 text-center">
          <div className="divider-soft opacity-70" />
          <p className="text-gray-400 mt-8">
            {'\u00a9'} 2024 AppSolutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
