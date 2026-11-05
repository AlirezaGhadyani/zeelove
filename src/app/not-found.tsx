export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-black text-amber-500 mb-2">۴۰۴</h1>
      <h2 className="text-lg font-bold text-white mb-4">صفحه مورد نظر یافت نشد</h2>
      <a
        href="/"
        className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors"
      >
        بازگشت به صفحه اصلی
      </a>
    </div>
  );
}
