import { getBlockDefinition } from '../blocks/registry';
import type { BlockInstance } from '../domain/types/page-builder.types';
import type { ResolvedBlockData } from '../blocks/common/data-needs';

interface BlockRendererProps {
  block: BlockInstance;
  data?: ResolvedBlockData;
}

export function BlockRenderer({ block, data }: BlockRendererProps) {
  const definition = getBlockDefinition(block.type);

  if (!definition) {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4 text-xs text-amber-800">
        بلاک ناشناخته: {block.type}
      </div>
    );
  }

  // Parse and validate props through the Zod schema with safe fallback to defaults
  const parsed = definition.schema.safeParse(block.props);
  const validProps = parsed.success ? parsed.data : definition.defaults;

  const RenderComponent = definition.Render;
  return <RenderComponent props={validProps} data={data} />;
}
