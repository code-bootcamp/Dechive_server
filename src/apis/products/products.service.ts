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

  async createProducts({ createProductInputs }): Promise<Product[]> {
    return Promise.all(
      createProductInputs.map(
        async (createProductInput: CreateProductInput) => {
          let picture = '';
          try {
            picture = await getOgImageUrl({ ...createProductInput });
          } catch (error) {}
          return this.productsRepository.save({
            ...createProductInput,
            picture,
          });
        },
      ),
    ).then();
  }

  async updateProducts({ updateProductInputs }): Promise<Product[]> {
    return Promise.all(
      updateProductInputs.map(
        async (updateProductInput: UpdateProductInput) => {
          let { picture } = updateProductInput;
          if (!picture) {
            try {
              picture = await getOgImageUrl({ ...updateProductInput });
            } catch (error) {}
          }
          return this.productsRepository.save({
            ...updateProductInput,
            picture,
          });
        },
      ),
    ).then();
  }

  async delete({ boardid }) {
    return this.productsRepository.delete({
      board: { id: boardid },
    });
  }
}
