import type { BlockDefinition } from './common/product-block-props';
import { HeroBannerBlock } from './hero-banner';
import { BannerGridBlock } from './banner-grid';
import { CategoryTilesBlock } from './category-tiles';
import { ProductCarouselBlock } from './product-carousel';
import { ProductGridBlock } from './product-grid';
import { ProductTabsBlock } from './product-tabs';
import { FeaturedProductBlock } from './featured-product';
import { CollectionByRuleBlock } from './collection-by-rule';
import { RichTextBlock } from './rich-text';
import { ImageTextBlock } from './image-text';
import { FeaturesListBlock } from './features-list';
import { TestimonialsBlock } from './testimonials';
import { FaqAccordionBlock } from './faq-accordion';
import { PromoCountdownBlock } from './promo-countdown';
import { BrandStripBlock } from './brand-strip';
import { NewsletterSignupBlock } from './newsletter-signup';
import { VideoPlayerBlock } from './video-player';
import { SpacerDividerBlock } from './spacer-divider';
import { CustomHtmlBlock } from './custom-html';

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  HeroBannerBlock,
  BannerGridBlock,
  CategoryTilesBlock,
  ProductCarouselBlock,
  ProductGridBlock,
  ProductTabsBlock,
  FeaturedProductBlock,
  CollectionByRuleBlock,
  RichTextBlock,
  ImageTextBlock,
  FeaturesListBlock,
  TestimonialsBlock,
  FaqAccordionBlock,
  PromoCountdownBlock,
  BrandStripBlock,
  NewsletterSignupBlock,
  VideoPlayerBlock,
  SpacerDividerBlock,
  CustomHtmlBlock,
];

export const BLOCK_REGISTRY: Record<string, BlockDefinition> = Object.fromEntries(
  BLOCK_DEFINITIONS.map((def) => [def.type, def]),
);

export function getBlockDefinition(type: string): BlockDefinition | undefined {
  return BLOCK_REGISTRY[type];
}

export function getAllBlockDefinitions(): BlockDefinition[] {
  return BLOCK_DEFINITIONS;
}
