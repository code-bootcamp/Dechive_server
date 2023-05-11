import { Board } from 'src/apis/boards/entities/board.entity';
import { CreateProductInput } from '../dto/product-create.input';
import { UpdateProductInput } from '../dto/product-update.input';
import { User } from 'src/apis/users/entities/user.entity';
import { Product } from '../entities/product.entity';

export interface IProductsServiceFindByProduct {
  name: Product['name'];
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

export interface IProductsServiceFetchByUserid {
  userid: User['id'];
}
