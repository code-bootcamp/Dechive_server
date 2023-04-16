import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { getOgImageUrl } from 'src/commons/util/getOgImageUrl';
import { CreateProductInput } from './dto/product-create.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
  ) {}

  async createProducts({ createProductInputs }): Promise<Product> {
    return Promise.all(
      createProductInputs.map(
        async (createProductInput: CreateProductInput) =>
          await this.productsRepository.save({
            ...createProductInput,
            picture: await getOgImageUrl({ ...createProductInput }),
          }),
      ),
    ).then();
  }
}
