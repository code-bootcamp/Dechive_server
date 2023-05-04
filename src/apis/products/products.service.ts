import { DeleteResult, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { getOpenGraph } from 'src/commons/util/getOpenGraph';
import {
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceUpdate,
} from './interfaces/products-service.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  findByProduct({ name }): Promise<string[]> {
    return this.productsRepository
      .find({
        where: { name: Like(`%${name}%`) },
        relations: ['board'],
      })
      .then((e) => (e.length ? e.map((el) => el.board?.id) : []));
  }

  async createProducts({
    createProductInputs,
  }: IProductsServiceCreate): Promise<Product[]> {
    return Promise.all(
      createProductInputs //
        .map(async (createProductInput) => {
          return this.productsRepository.save({
            ...createProductInput,
            picture:
              createProductInput.imageUrl ??
              (await getOpenGraph({ ...createProductInput })).imageUrl ??
              '',
          });
        }),
    );
  }

  async updateProducts({
    updateProductInputs,
  }: IProductsServiceUpdate): Promise<Product[]> {
    return Promise.all(
      updateProductInputs //
        .map(async (updateProductInput) => {
          return this.productsRepository.save({
            ...updateProductInput,
            picture:
              updateProductInput.picture ??
              updateProductInput.imageUrl ??
              (await getOpenGraph({ ...updateProductInput })).imageUrl ??
              '',
          });
        }),
    );
  }

  async delete({
    boardid, //
  }: IProductsServiceDelete): Promise<DeleteResult> {
    return this.productsRepository.delete({
      board: { id: boardid },
    });
  }
}
