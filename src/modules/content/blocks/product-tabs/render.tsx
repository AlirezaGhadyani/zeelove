import type { ProductTabsProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';
import { ProductTabsClient } from './tabs-client';

interface ProductTabsRenderProps {
  props: ProductTabsProps;
  data?: ResolvedBlockData;
}

export function ProductTabsRender({ props, data }: ProductTabsRenderProps) {
  const allProducts = data?.products ?? [];

  // Group or distribute products across tabs
  const tabsData = props.tabs.map((tab, idx) => {
    // If specific products are returned, slice or filter
    const productsForTab =
      tab.rule === 'discounted'
        ? allProducts.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
        : idx === 0
        ? allProducts
        : allProducts.slice(idx * 2, (idx + 1) * 2 + 4);

    return {
      tabId: tab.id,
      label: tab.label,
      products: productsForTab.length > 0 ? productsForTab : allProducts,
    };
  });

  return (
    <div className="w-full">
      {(props.title || props.subtitle) && (
        <div className="mb-6 flex flex-col items-start">
          {props.title && (
            <h2 className="text-xl md:text-2xl font-bold text-slate-900">
              {props.title}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-1 text-sm text-slate-500">{props.subtitle}</p>
          )}
        </div>
      )}

      <ProductTabsClient props={props} tabsData={tabsData} />
    </div>
  );
}
