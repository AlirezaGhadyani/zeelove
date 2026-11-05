import { env } from '@/shared/infrastructure/config/env';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-2xl font-bold">
          💎
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{env.APP_NAME} (زیلاو)</h1>
        <p className="text-sm text-neutral-400">
          هسته زیرساخت و معماری دامنه-محور (فاز ۱ - پایه و ابزارها) با موفقیت مستقر شد.
        </p>
        <div className="pt-2">
          <a
            href="/api/health"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 transition-colors"
          >
            بررسی وضعیت سرور (/api/health)
          </a>
        </div>
      </div>
    </main>
  );
}
