// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { PriceTag } from '@/shared/ui/commerce/price-tag';
import { StockBadge } from '@/shared/ui/commerce/stock-badge';
import { RatingStars } from '@/shared/ui/commerce/rating-stars';
import { Wordmark } from '@/shared/ui/brand/wordmark';

describe('Commerce & Brand UI Components', () => {
  it('renders PriceTag with Toman currency and discount percentage', () => {
    render(<PriceTag price={200000} compareAtPrice={250000} />);
    expect(screen.getByText(/۲۰۰،۰۰۰ تومان/)).toBeDefined();
    expect(screen.getByText(/٪۲۰/)).toBeDefined();
  });

  it('renders StockBadge properly for in-stock and out-of-stock items', () => {
    const { rerender } = render(<StockBadge stock={10} />);
    expect(screen.getByText('موجود در انبار')).toBeDefined();

    rerender(<StockBadge stock={0} />);
    expect(screen.getByText('ناموجود')).toBeDefined();

    rerender(<StockBadge stock={3} />);
    expect(screen.getByText(/تنها ۳ عدد در انبار/)).toBeDefined();
  });

  it('renders RatingStars with accessible aria-label', () => {
    render(<RatingStars rating={4.5} reviewCount={20} />);
    expect(screen.getByText('۴.۵')).toBeDefined();
    expect(screen.getByText(/۲۰/)).toBeDefined();
  });

  it('renders Wordmark brand with aria-label', () => {
    render(<Wordmark />);
    const svg = screen.getByLabelText('زیلاو - zeelove');
    expect(svg).toBeDefined();
  });

  it('passes axe accessibility checks on PriceTag', async () => {
    const { container } = render(<PriceTag price={50000} />);
    const results = await axe.run(container);
    expect(results.violations.length).toBe(0);
  });
});
