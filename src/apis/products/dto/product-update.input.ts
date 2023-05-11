import { Field, InputType } from '@nestjs/graphql';
import { CreateProductInput } from './product-create.input';

@InputType()
export class UpdateProductInput extends CreateProductInput {
  @Field(() => String, { nullable: true })
  picture: string;
}
