import { useState } from 'react';
import toast from 'react-hot-toast';

const ContactSVG = () => (
  <svg viewBox="0 0 480 540" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
    <defs>
      <radialGradient id="glow" cx="0.5" cy="0.4" r="0.65">
        <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#0F4C81" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="bldg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0F4C81" />
        <stop offset="100%" stopColor="#005EB8" />
      </linearGradient>
      <linearGradient id="bldg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#005EB8" />
        <stop offset="100%" stopColor="#0F4C81" />
      </linearGradient>
      <linearGradient id="pin" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F58220" />
        <stop offset="100%" stopColor="#FFA045" />
      </linearGradient>
      <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0F4C81" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#0F4C81" stopOpacity="0.04" />
      </linearGradient>
    </defs>

    <rect width="480" height="540" fill="url(#glow)" />

    <rect x="135" y="145" width="16" height="275" rx="3" fill="url(#bldg1)" opacity="0.08" />
    <rect x="163" y="120" width="100" height="300" rx="6" fill="url(#bldg1)" opacity="0.06" />
    <path d="M213 130 a4 4 0 0 1 4 -4 l32 0 a4 4 0 0 1 4 4 l0 10 l-40 0 z" fill="url(#roof)" />

    <rect x="178" y="148" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.35" />
    <rect x="198" y="148" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="218" y="148" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="238" y="148" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.45" />

    <rect x="178" y="178" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="198" y="178" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.6" />
    <rect x="218" y="178" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.35" />
    <rect x="238" y="178" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.25" />

    <rect x="178" y="208" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="198" y="208" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="218" y="208" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="238" y="208" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.3" />

    <rect x="178" y="238" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.3" />
    <rect x="198" y="238" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.45" />
    <rect x="218" y="238" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="238" y="238" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.55" />

    <line x1="135" y1="148" x2="135" y2="408" stroke="#0F4C81" strokeWidth="1" opacity="0.08" />

    <rect x="285" y="195" width="75" height="225" rx="6" fill="url(#bldg2)" opacity="0.06" />
    <rect x="298" y="215" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.3" />
    <rect x="318" y="215" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.55" />
    <rect x="335" y="215" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.25" />
    <rect x="298" y="245" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.45" />
    <rect x="318" y="245" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="335" y="245" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="298" y="275" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.2" />
    <rect x="318" y="275" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="335" y="275" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.3" />
    <rect x="298" y="305" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.5" />
    <rect x="318" y="305" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.3" />
    <rect x="335" y="305" width="12" height="16" rx="1.5" fill="#005EB8" opacity="0.45" />

    <path d="M263 145 Q285 130 298 195" fill="none" stroke="#005EB8" strokeWidth="1.5" opacity="0.2" strokeDasharray="4 4" />
    <path d="M248 180 Q270 170 285 215" fill="none" stroke="#005EB8" strokeWidth="1" opacity="0.15" strokeDasharray="3 5" />

    <circle cx="249" cy="145" r="4" fill="#005EB8" opacity="0.6" />
    <circle cx="286" cy="130" r="3" fill="#0F4C81" opacity="0.4" />
    <circle cx="265" cy="170" r="2.5" fill="#F58220" opacity="0.5" />
    <circle cx="248" cy="195" r="3" fill="#0F4C81" opacity="0.3" />

    <g transform="translate(240, 435)">
      <path d="M0-38c-21 0-38 17-38 38 0 28.5 38 68 38 68s38-39.5 38-68c0-21-17-38-38-38z" fill="url(#pin)" />
      <circle cx="0" cy="0" r="11" fill="white" />
      <rect x="-4" y="-4" width="8" height="8" rx="2" fill="#F58220" />
    </g>

    <path d="M240 110 Q265 75 240 45" fill="none" stroke="#F58220" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
    <path d="M240 110 Q280 65 240 25" fill="none" stroke="#F58220" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
    <path d="M240 110 Q215 75 240 45" fill="none" stroke="#F58220" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
    <path d="M240 110 Q200 65 240 25" fill="none" stroke="#F58220" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />

    <circle cx="240" cy="45" r="3" fill="#F58220" opacity="0.4" />
    <circle cx="240" cy="25" r="2" fill="#F58220" opacity="0.25" />

    <text x="240" y="520" textAnchor="middle" fill="#0F4C81" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="600" letterSpacing="4" opacity="0.35">GET IN TOUCH</text>
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container-custom py-16 md:py-24">
      <div className="text-center mb-14">
        <p className="mono text-[11px] uppercase tracking-[.14em] text-primary">Get in touch</p>
        <h1 className="section-title mt-3">Contact Us</h1>
        <p className="section-subtitle mx-auto">Have a question about a property or the platform? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
        <div className="hidden md:block">
          <ContactSVG />
        </div>

        <div className="space-y-8">
          <div className="card p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Your name</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-field"
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-field"
                  placeholder="priya@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-1.5">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Tell us about your enquiry…"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-card)] border border-[#E2E8F0] bg-white p-5 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#eef2ff] text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Email</p>
              <p className="mt-1 text-[11px] text-neutral-700">info@bookmyspace.in</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[#E2E8F0] bg-white p-5 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#eef2ff] text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Phone</p>
              <p className="mt-1 text-[11px] text-neutral-700">+91 1800-123-4567</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-[#E2E8F0] bg-white p-5 text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#eef2ff] text-primary">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <p className="text-xs font-semibold text-neutral-900">Location</p>
              <p className="mt-1 text-[11px] text-neutral-700">Mumbai, India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
