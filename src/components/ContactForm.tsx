import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { contactsAPI } from '../services/api';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', scope: 'Custom Plugin Development', message: '', captcha: '' });
  const [captchaValue, setCaptchaValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaValue(`${n1} + ${n2}`);
    return n1 + n2;
  };

  const [captchaAnswer, setCaptchaAnswer] = useState(() => generateCaptcha());

  const handleRefreshCaptcha = () => {
    setCaptchaAnswer(generateCaptcha());
    setFormData(prev => ({ ...prev, captcha: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(formData.captcha) !== captchaAnswer) {
      alert('Incorrect captcha. Please try again.');
      return;
    }
    setLoading(true);
    try {
      await contactsAPI.create({ name: formData.name, email: formData.email, message: formData.message });
      setSubmitted(true);
    } catch {
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-on-primary-fixed text-3xl">check</span>
        </div>
        <h3 className="font-headline text-2xl font-bold mb-2">Transmission Received</h3>
        <p className="text-on-surface-variant">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Full Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Architect"
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary-fixed focus:ring-0 transition-all px-0 py-3 text-lg font-medium"
          />
        </div>
        <div className="space-y-2">
          <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@studio.com"
            className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary-fixed focus:ring-0 transition-all px-0 py-3 text-lg font-medium"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Project Scope</label>
        <select
          name="scope"
          value={formData.scope}
          onChange={handleChange}
          className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary-fixed focus:ring-0 transition-all px-0 py-3 text-lg font-medium appearance-none"
        >
          <option>Custom Plugin Development</option>
          <option>Enterprise Infrastructure</option>
          <option>Design System Consulting</option>
          <option>Other Inquiry</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Message Details</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe your technical requirements..."
          className="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary-fixed focus:ring-0 transition-all px-0 py-3 text-lg font-medium resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Captcha: {captchaValue} = ?</label>
        <div className="flex items-center gap-4">
          <input
            name="captcha"
            type="number"
            value={formData.captcha}
            onChange={handleChange}
            required
            placeholder="Answer"
            className="flex-1 bg-surface-container-low border-0 border-b-2 border-transparent focus:border-primary-fixed focus:ring-0 transition-all px-0 py-3 text-lg font-medium"
          />
          <button type="button" onClick={handleRefreshCaptcha} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-headline font-black py-5 rounded-lg text-lg flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-primary-fixed/20 disabled:opacity-60"
      >
        {loading ? 'TRANSMITTING...' : 'TRANSMIT INQUIRY'}
        <span className="material-symbols-outlined">send</span>
      </button>
    </form>
  );
};

export default ContactForm;
