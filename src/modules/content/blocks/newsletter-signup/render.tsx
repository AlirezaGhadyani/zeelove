import { Mail } from 'lucide-react';
import type { NewsletterSignupProps } from './schema';
import { NewsletterFormClient } from './form-client';

export function NewsletterSignupRender({ props }: { props: NewsletterSignupProps }) {
  return (
    <div className="w-full rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white mb-4">
        <Mail className="h-6 w-6" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
        {props.title}
      </h2>

      <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto">
        {props.subtitle}
      </p>

      <div className="mt-6">
        <NewsletterFormClient
          placeholder={props.placeholder}
          buttonText={props.buttonText}
        />
      </div>

      {props.disclaimer && (
        <p className="mt-4 text-[11px] text-slate-400 max-w-md mx-auto">
          {props.disclaimer}
        </p>
      )}
    </div>
  );
}
