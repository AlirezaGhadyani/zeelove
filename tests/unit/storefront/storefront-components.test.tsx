// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PriceTag } from '@/shared/ui/commerce/price-tag';
import { ListingPagination } from '@/components/storefront/listing-pagination';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/products',
  useSearchParams: () => new URLSearchParams(),
}));

describe('Storefront Component Unit Tests', () => {
  it('renders PriceTag with Toman currency and discount percentage', () => {
    const { container } = render(
      <PriceTag price={250000} compareAtPrice={300000} />,
    );

    expect(screen.getByText(/تومان/i)).toBeDefined();
    // 300000 -> 250000 is ~17% discount
    const discountEl = container.querySelector('.bg-red-500\\/10');
    expect(discountEl).toBeDefined();
    expect(discountEl?.textContent).toContain('۱۷');
  });

  it('renders ListingPagination with correct Persian digits page numbers', () => {
    render(<ListingPagination currentPage={1} totalPages={3} />);

    expect(screen.getByText('۱')).toBeDefined();
    expect(screen.getByText('۲')).toBeDefined();
    expect(screen.getByText('۳')).toBeDefined();
  });
});
