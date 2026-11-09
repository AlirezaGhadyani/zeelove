import type { RichTextProps } from './schema';

const WIDTH_CLASSES: Record<string, string> = {
  prose: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-4xl',
  full: 'w-full',
};

export function RichTextRender({ props }: { props: RichTextProps }) {
  const isCenter = props.align === 'center';
  const widthClass = WIDTH_CLASSES[props.maxWidth] || WIDTH_CLASSES.prose;

  return (
    <div
      className={`mx-auto w-full ${widthClass} flex flex-col ${
        isCenter ? 'items-center text-center' : 'items-start text-right'
      }`}
    >
      {props.title && (
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
          {props.title}
        </h2>
      )}

      {props.lead && (
        <p className="mt-4 text-base md:text-lg font-medium text-slate-700 leading-relaxed">
          {props.lead}
        </p>
      )}

      {props.content && (
        <div className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed space-y-3 whitespace-pre-line">
          {props.content}
        </div>
      )}
    </div>
  );
}
