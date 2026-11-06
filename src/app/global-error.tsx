'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">خطای بحرانی در سامانه رخ داده است</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
        >
          تلاش مجدد
        </button>
      </body>
    </html>
  );
}
