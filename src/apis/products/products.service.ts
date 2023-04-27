import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/product-create.input';
import { UpdateProductInput } from './dto/product-update.input';
import { getOpenGraph } from 'src/commons/util/getOpenGraph';
import { OpenGraph } from './dto/openGraph.dto';

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
          let og: OpenGraph;
          try {
            og = await getOpenGraph({ url: createProductInput.url });
          } catch (error) {}
          console.log(og);
          return this.productsRepository.save({
            ...createProductInput,
            picture: og.imageUrl,
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
          let og: OpenGraph;
          if (!picture) {
            try {
              og = await getOpenGraph({ ...updateProductInput });
              picture = og.imageUrl;
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
