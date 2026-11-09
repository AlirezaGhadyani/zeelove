import type { CustomHtmlProps } from './schema';

function sanitizeHtml(dirty: string): string {
  return dirty
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
}

export function CustomHtmlRender({ props }: { props: CustomHtmlProps }) {
  const cleanHtml = sanitizeHtml(props.html);

  return (
    <div className="w-full">
      {props.title && (
        <h3 className="mb-3 text-lg font-bold text-slate-900">{props.title}</h3>
      )}
      <div
        className="custom-html-content"
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
