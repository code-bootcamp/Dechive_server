import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from '../../boards/entities/board.entity';

@Entity()
@ObjectType()
export class Picture {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  url: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => Board, (board) => board.pictures, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board)
  board: Board;
}
