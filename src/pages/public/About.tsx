export default function About() {
  return (
    <div className="container-custom py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="section-title text-center font-display">About Rentalisting</h1>
        <p className="section-subtitle text-center">Your trusted platform for finding the perfect rental property.</p>

        <div className="space-y-8 mt-12">
          <div className="card p-8">
            <h2 className="text-xl font-bold text-primary font-display mb-4">Our Mission</h2>
            <p className="text-neutral-700 leading-relaxed">
              At Rentalisting, we believe finding your next home should be simple, transparent, and stress-free.
              We connect property owners with quality tenants through a secure, verified platform.
            </p>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-primary font-display mb-4">Why Choose Us</h2>
            <ul className="space-y-3 text-neutral-700">
              {[
                'Verified listings with real property information',
                'Secure communication between owners and tenants',
                'Advanced search and filtering options',
                'Detailed property information with high-quality images',
                'Fair and transparent rental process',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-success mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
