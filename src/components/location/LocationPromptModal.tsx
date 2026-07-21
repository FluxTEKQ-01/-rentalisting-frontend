import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function LocationPromptModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('location_prompt_dismissed');
    const savedLocation = localStorage.getItem('user_selected_location');
    if (savedLocation) {
      setDetectedLocation(savedLocation);
    }
    if (!isDismissed) {
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('location_prompt_dismissed', 'true');
  };

  const handleAllowLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.suburb ||
            data.address?.state_district ||
            'Nearby Area';

          setDetectedLocation(city);
          localStorage.setItem('user_selected_location', city);
        } catch {
          setDetectedLocation('Current Location');
          localStorage.setItem('user_selected_location', 'Current Location');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg('Location permission denied.');
        } else {
          setErrorMsg('Unable to retrieve location.');
        }
      },
      { timeout: 10000 }
    );
  };

  const handleSearchRentals = (loc: string) => {
    handleClose();
    navigate(`/properties?keyword=${encodeURIComponent(loc)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-20 left-4 md:left-8 z-50 w-[90vw] max-w-sm bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden"
        >
          {/* Header Bar */}
          <div className="bg-primary px-4 py-3.5 flex items-center justify-between text-white relative">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="font-display font-bold text-sm tracking-wide">Allow Location Access</h3>
            </div>

            {/* Close Button in Top Right of Popup */}
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close location popup"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Popup Content */}
          <div className="p-4 space-y-4">
            <p className="text-xs text-neutral-700 leading-relaxed">
              Allow location access to discover verified rental properties near you.
            </p>

            {/* Main Action Button or Active Location Status */}
            {!detectedLocation ? (
              <button
                onClick={handleAllowLocation}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary-light transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Detecting location...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
                    </svg>
                    <span>Allow Location Access</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary overflow-hidden">
                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-bold truncate">Location: {detectedLocation}</span>
                </div>
                <button
                  onClick={() => handleSearchRentals(detectedLocation)}
                  className="text-[11px] font-bold text-accent hover:underline shrink-0 ml-2"
                >
                  Explore →
                </button>
              </div>
            )}

            {errorMsg && (
              <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                {errorMsg}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
