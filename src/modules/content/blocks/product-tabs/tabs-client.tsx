'use client';

import { useState } from 'react';
import type { ProductTabsProps } from './schema';
import type { ResolvedBlockData } from '../common/data-needs';
import { ProductCard } from '../common/product-card';

interface ProductTabsClientProps {
  props: ProductTabsProps;
  tabsData: Array<{
    tabId: string;
    label: string;
    products: NonNullable<ResolvedBlockData['products']>;
  }>;
}

export function ProductTabsClient({ props, tabsData }: ProductTabsClientProps) {
  const [activeTabId, setActiveTabId] = useState(
    tabsData[0]?.tabId || 'tab-1',
  );

  const activeTab = tabsData.find((t) => t.tabId === activeTabId) || tabsData[0];
  const products = activeTab?.products ?? [];

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        {tabsData.map((tab) => {
          const isActive = tab.tabId === activeTabId;
          return (
            <button
              key={tab.tabId}
              onClick={() => setActiveTabId(tab.tabId)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {products.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          کالایی در این تب موجود نیست
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              variant={props.cardVariant}
              aspectRatio={props.aspectRatio}
              showPrice={props.showPrice}
              showRating={props.showRating}
              showBadges={props.showBadges}
            />
          ))}
        </div>
      )}
    </div>
  );
}
