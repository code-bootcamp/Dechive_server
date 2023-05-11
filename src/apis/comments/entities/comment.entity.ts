import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../../boards/entities/board.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Reply } from 'src/apis/replies/entities/reply.entity';

@Entity()
@ObjectType()
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'text' })
  @Field(() => String)
  content: string;

  @ManyToOne(() => Board, (board) => board.comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Board)
  board: Board;

  @OneToMany(() => Reply, (replies) => replies.comment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Reply], { nullable: true })
  replies: Reply[];

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date, { nullable: true })
  createdAt: Date;
}
