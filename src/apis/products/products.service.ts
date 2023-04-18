import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { getOgImageUrl } from 'src/commons/util/getOgImageUrl';
import { CreateProductInput } from './dto/product-create.input';
import { UpdateProductInput } from './dto/product-update.input';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
  ) {}

  async createProducts({ createProductInputs }): Promise<Product> {
    return Promise.all(
      createProductInputs.map(
        async (createProductInput: CreateProductInput) => {
          return this.productsRepository.save({
            ...createProductInput,
          });
        },
      ),
    ).then();
  }

  async updateProducts({ updateProductInputs }): Promise<Product[]> {
    return Promise.all(
      updateProductInputs.map(
        async (UpdateProductInput: UpdateProductInput) => {
          let { picture } = UpdateProductInput;
          picture = picture
            ? picture
            : await getOgImageUrl({ ...UpdateProductInput });
          return this.productsRepository.save({
            ...UpdateProductInput,
            picture,
          });
        },
      ),
    ).then();
  }

  async deleteProducts({ id }) {
    return this.productsRepository.delete({
      board: id,
    });
  }
}
