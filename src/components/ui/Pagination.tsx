interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-800/60 hover:bg-neutral disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral transition-colors">
            1
          </button>
          {start > 2 && <span className="px-2 text-neutral-800/40">...</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            p === page
              ? 'bg-primary text-white'
              : 'hover:bg-neutral text-neutral-800/60'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-neutral-800/40">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral transition-colors">
            {totalPages}
          </button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 rounded-lg text-sm font-medium text-neutral-800/60 hover:bg-neutral disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
