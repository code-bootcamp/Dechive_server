import { Query, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver()
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService, //
  ) {}

  @Query(() => [Product])
  async fetchAllProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}
