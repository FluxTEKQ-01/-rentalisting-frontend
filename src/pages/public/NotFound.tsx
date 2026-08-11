import { Link } from 'react-router-dom';
import SeoHead from '../../components/seo/SeoHead';

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Page Not Found"
        description="The page you are looking for does not exist or has been moved."
      />
      <div className="container-custom flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="mono text-[11px] uppercase tracking-[.14em] text-primary">Error 404</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-primary md:text-5xl">
          This page doesn't exist.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-700">
          The link may be broken, or the listing you were looking for has been removed or archived.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back to home
          </Link>
          <Link to="/properties" className="btn-outline">
            Browse rentals
          </Link>
        </div>
      </div>
    </>
  );
}
