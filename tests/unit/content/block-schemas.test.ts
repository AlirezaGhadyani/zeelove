import { describe, it, expect } from 'vitest';
import { BLOCK_DEFINITIONS, BLOCK_REGISTRY, getBlockDefinition } from '@/modules/content/blocks/registry';

describe('Block Registry & Schema Validation', () => {
  it('registers exactly 19 starter blocks', () => {
    expect(BLOCK_DEFINITIONS).toHaveLength(19);
    expect(Object.keys(BLOCK_REGISTRY)).toHaveLength(19);
  });

  const expectedBlockTypes = [
    'hero-banner',
    'banner-grid',
    'category-tiles',
    'product-carousel',
    'product-grid',
    'product-tabs',
    'featured-product',
    'collection-by-rule',
    'rich-text',
    'image-text',
    'features-list',
    'testimonials',
    'faq-accordion',
    'promo-countdown',
    'brand-strip',
    'newsletter-signup',
    'video-player',
    'spacer-divider',
    'custom-html',
  ];

  it('contains every expected starter block type', () => {
    for (const type of expectedBlockTypes) {
      const def = getBlockDefinition(type);
      expect(def).toBeDefined();
      expect(def?.type).toBe(type);
      expect(def?.schemaVersion).toBeGreaterThanOrEqual(1);
      expect(typeof def?.name).toBe('string');
      expect(typeof def?.description).toBe('string');
      expect(def?.Render).toBeDefined();
    }
  });

  describe.each(expectedBlockTypes)('Block schema for %s', (type) => {
    it('validates default props against schema successfully', () => {
      const def = getBlockDefinition(type)!;
      const parsed = def.schema.safeParse({});
      expect(parsed.success).toBe(true);

      const parsedDefaults = def.schema.safeParse(def.defaults);
      expect(parsedDefaults.success).toBe(true);
    });

    it('has defined editor fields for admin forms', () => {
      const def = getBlockDefinition(type)!;
      expect(Array.isArray(def.editorFields)).toBe(true);
      expect(def.editorFields.length).toBeGreaterThan(0);
    });
  });
});
