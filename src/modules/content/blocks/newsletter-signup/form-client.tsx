'use client';

import { useState } from 'react';
import { subscribeNewsletterAction } from '@/app/actions/newsletter.actions';

interface NewsletterFormClientProps {
  placeholder: string;
  buttonText: string;
}

export function NewsletterFormClient({
  placeholder,
  buttonText,
}: NewsletterFormClientProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setStatus('loading');
    try {
      const res = await subscribeNewsletterAction(value.trim());
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'عضویت شما در خبرنامه با موفقیت ثبت شد.');
        setValue('');
      } else {
        setStatus('error');
        setMessage(res.message || 'خطا در ثبت اطلاعات. لطفاً مجدداً تلاش کنید.');
      }
    } catch {
      setStatus('error');
      setMessage('خطا در برقراری ارتباط با سرور.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={status === 'loading' || status === 'success'}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          {status === 'loading' ? 'در حال ثبت...' : buttonText}
        </button>
      </div>

      {message && (
        <p
          className={`mt-2.5 text-xs ${
            status === 'success' ? 'text-emerald-600 font-medium' : 'text-rose-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
