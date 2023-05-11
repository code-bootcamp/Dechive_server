import { ObjectType } from '@nestjs/graphql';
import { CreateProductInput } from './product-create.input';

@ObjectType()
export class OpenGraph extends CreateProductInput {}
