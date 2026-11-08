import type { UseCase } from '@/shared/kernel/use-case';
import { Result, ok } from '@/shared/kernel/result';
import type { ProductRepositoryPort, ProductQueryCriteria } from '../ports/product.repository.port';
import type { Product } from '../../domain/aggregates/product.aggregate';

export type ListProductsInput = ProductQueryCriteria;

export interface ListProductsOutput {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListProductsUseCase implements UseCase<ListProductsInput, Result<ListProductsOutput, never>> {
  constructor(private readonly productRepo: ProductRepositoryPort) {}

  public async execute(input: ListProductsInput): Promise<Result<ListProductsOutput, never>> {
    const page = Math.max(1, input.page ?? 1);
    const limit = Math.min(100, Math.max(1, input.limit ?? 20));

    const { products, total } = await this.productRepo.findMany({
      ...input,
      page,
      limit,
    });

    const totalPages = Math.ceil(total / limit) || 1;

    return ok({
      products,
      total,
      page,
      limit,
      totalPages,
    });
  }
}
