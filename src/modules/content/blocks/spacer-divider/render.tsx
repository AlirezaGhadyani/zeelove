import type { SpacerDividerProps } from './schema';

const HEIGHT_CLASSES: Record<string, string> = {
  xs: 'h-3',
  sm: 'h-6',
  md: 'h-10',
  lg: 'h-16',
  xl: 'h-24',
  '2xl': 'h-32',
};

const DIVIDER_STYLES: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

export function SpacerDividerRender({ props }: { props: SpacerDividerProps }) {
  const heightClass = HEIGHT_CLASSES[props.height] || HEIGHT_CLASSES.md;
  const styleClass = DIVIDER_STYLES[props.dividerStyle] || DIVIDER_STYLES.solid;

  if (props.showDivider) {
    return (
      <div className={`flex w-full items-center justify-center ${heightClass}`}>
        <hr className={`w-full border-t border-slate-200/80 ${styleClass}`} />
      </div>
    );
  }

  return <div className={`w-full ${heightClass}`} aria-hidden="true" />;
}
