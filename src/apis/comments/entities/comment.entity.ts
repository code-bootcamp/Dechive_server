import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column(() => String)
  @Field(() => String)
  content: string;

  @ManyToOne(() => Board, (Board) => Board.products)
  @Field(() => Board)
  board: Board;

  @Column(() => String)
  @Field(() => String)
  user: string;

  //   @ManyToOne(() => User, (User) => User.comments)
  //   @Field(() => User)
  //   user: User;
}
