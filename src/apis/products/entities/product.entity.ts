import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  name: string;

  @Column({ type: 'text' })
  @Field(() => String)
  url: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  picture: string;

  @ManyToOne(() => Board, (board) => board.products, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board)
  board: Board;
}
