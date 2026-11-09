import type { RowLayout } from '../domain/types/page-builder.types';
import type { PageResolvedData } from '../blocks/common/data-needs';
import { BlockRenderer } from './block-renderer';

interface RowRendererProps {
  row: RowLayout;
  data: PageResolvedData;
}

const WIDTH_CLASSES: Record<string, string> = {
  narrow: 'max-w-4xl mx-auto px-4 sm:px-6',
  default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8',
  'full-bleed': 'w-full px-0',
};

const PADDING_Y_CLASSES: Record<string, string> = {
  none: 'py-0',
  xs: 'py-2',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
  '2xl': 'py-24',
};

const GAP_CLASSES: Record<string, string> = {
  none: 'gap-0',
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
};

const ALIGN_CLASSES: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const SPAN_CLASSES: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7',
  8: 'md:col-span-8',
  9: 'md:col-span-9',
  10: 'md:col-span-10',
  11: 'md:col-span-11',
  12: 'md:col-span-12',
};

export function RowRenderer({ row, data }: RowRendererProps) {
  const widthClass = WIDTH_CLASSES[row.width] || WIDTH_CLASSES.default;
  const paddingYClass = PADDING_Y_CLASSES[row.paddingY] || PADDING_Y_CLASSES.md;
  const gapClass = GAP_CLASSES[row.gap] || GAP_CLASSES.md;
  const alignClass = ALIGN_CLASSES[row.alignment] || ALIGN_CLASSES.start;

  // Background handling
  const bg = row.background;
  const bgStyle: React.CSSProperties = {};

  if (bg) {
    if (bg.type === 'color' && bg.value) {
      bgStyle.backgroundColor = bg.value;
    } else if (bg.type === 'gradient' && bg.value) {
      bgStyle.backgroundImage = bg.value;
    } else if (bg.type === 'image' && bg.value) {
      bgStyle.backgroundImage = `url(${bg.value})`;
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
    }
  }

  // Breakpoint visibility
  let visClass = '';
  if (row.visibility) {
    if (row.visibility.mobile === false) visClass += ' hidden sm:block';
    if (row.visibility.desktop === false) visClass += ' lg:hidden';
  }

  return (
    <section
      id={row.anchorId || undefined}
      style={bgStyle}
      className={`relative w-full ${paddingYClass} ${visClass}`}
    >
      <div className={`w-full ${widthClass}`}>
        <div className={`grid grid-cols-12 ${gapClass} ${alignClass}`}>
          {row.columns.map((col) => {
            const span = Math.min(12, Math.max(1, col.span || 12));
            const colClass = `col-span-12 ${SPAN_CLASSES[span] || 'md:col-span-12'}`;

            return (
              <div
                key={col.id}
                className={`${colClass} flex flex-col gap-6`}
              >
                {col.blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    data={data[block.id]}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
