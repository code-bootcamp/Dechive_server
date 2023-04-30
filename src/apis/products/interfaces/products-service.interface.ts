import { Board } from 'src/apis/boards/entities/board.entity';
import { CreateProductInput } from '../dto/product-create.input';
import { UpdateProductInput } from '../dto/product-update.input';
import { Hashtag } from 'src/apis/hashtags/entities/hashtag.entity';

export interface IProductsServiceFindByHash {
  hashtag: Hashtag['hashtag'];
}

export interface IProductsServiceCreate {
  createProductInputs: CreateProductInput[];
}

export interface IProductsServiceUpdate {
  updateProductInputs: UpdateProductInput[];
}

export interface IProductsServiceDelete {
  boardid: Board['id'];
}
