'use client';

import React, { useState } from 'react';
import { FileText, Sliders, Shield } from 'lucide-react';

interface ProductDetailTabsProps {
  description?: string;
  attributes: Array<{
    name: string;
    value: string;
  }>;
}

export function ProductDetailTabs({ description, attributes }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');

  return (
    <div className="space-y-6 pt-10 border-t border-neutral-800">
      {/* Tab Nav Buttons */}
      <div className="flex border-b border-neutral-800 gap-4 overflow-x-auto text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('desc')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'desc'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>توضیحات و معرفی کالا</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'specs'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>جدول مشخصات فنی</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('shipping')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'shipping'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>ضمانت و شرایط ارسال</span>
        </button>
      </div>

      {/* Tab Panes */}
      <div className="text-xs sm:text-sm text-neutral-300 leading-relaxed min-h-[160px]">
        {activeTab === 'desc' && (
          <div className="prose prose-invert max-w-none space-y-4">
            <p>{description || 'توضیحات تکمیلی برای این محصول به زودی اضافه می‌شود.'}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="max-w-xl">
            {attributes.length > 0 ? (
              <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-3 bg-neutral-900/40 text-xs">
                    <span className="font-semibold text-neutral-400">{attr.name}</span>
                    <span className="col-span-2 text-white font-medium">{attr.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-xs">مشخصات فنی ثبت نشده است.</p>
            )}
          </div>
        )}

        {activeTab === 'shipping' && (
          <div className="space-y-4 text-neutral-400 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
              <h5 className="font-bold text-white text-sm">شرایط ارسال سفارش</h5>
              <p>
                تمامی سفارشات تهران ظرف مدت ۲۴ ساعت کاری با پیک ویژه و سفارشات شهرستان با پست پیشتاز یا تیپاکس ظرف مدت ۲ الی ۳ روز کاری ارسال و تحویل می‌گردند.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 space-y-2">
              <h5 className="font-bold text-white text-sm">۷ روز ضمانت بازگشت کالا</h5>
              <p>
                در صورت عدم تطابق سایز یا وجود هرگونه نقص فنی، کالا به مدت ۷ روز از زمان تحویل به صورت کاملاً رایگان قابل تعویض یا عودت وجه می‌باشد.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
