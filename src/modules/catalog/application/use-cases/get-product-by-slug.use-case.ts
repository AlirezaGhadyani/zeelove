import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok, err } from '@/shared/kernel/result';
import { NotFoundError } from '@/shared/kernel/domain-error';
import type { ProductRepositoryPort } from '../ports/product.repository.port';
import type { Product } from '../../domain/aggregates/product.aggregate';
import { normalizePersianText } from '../../domain/value-objects/slug.vo';

export interface GetProductBySlugInput {
  slug: string;
}

export class GetProductBySlugUseCase
  implements UseCase<GetProductBySlugInput, Result<Product, NotFoundError>>
{
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  public async execute(input: GetProductBySlugInput): Promise<Result<Product, NotFoundError>> {
    const rawSlug = input.slug.trim();
    const product = await this.productRepo.findBySlug(rawSlug);
    if (product) {
      return ok(product);
    }

    const normalizedSlug = normalizePersianText(rawSlug).replace(/[^\u0600-\u06FFa-z0-9-]/g, '');
    if (normalizedSlug !== rawSlug) {
      const normalizedProduct = await this.productRepo.findBySlug(normalizedSlug);
      if (normalizedProduct) {
        return ok(normalizedProduct);
      }
    }

    return err(new NotFoundError('Product', input.slug));
  }
}
