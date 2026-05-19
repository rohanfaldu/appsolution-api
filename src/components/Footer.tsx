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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info — DO NOT MODIFY */}
          <div className="col-span-1 md:col-span-2">
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
            <div className="flex space-x-3">
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
          <div>
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
          <div>
            <h3 className="text-white font-semibold mb-4 tracking-wide uppercase text-sm">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@initiotechmedia.com"
                  className="flex items-start gap-2.5 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Mail className="h-4 w-4 mt-0.5 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-sm break-all">contact@initiotechmedia.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919316147661"
                  className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-colors duration-200 group"
                >
                  <Phone className="h-4 w-4 shrink-0 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <span className="text-sm">(+91) 9316147661</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-gray-400">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-blue-400" />
                  <address className="text-sm not-italic leading-relaxed">
                    908, B Square 2, Ambli Rd,<br />
                    near Hotel Double tree Hilton,<br />
                    Vikram Nagar, Ahmedabad,<br />
                    Gujarat 380054
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
            © 2024 AppSolutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
