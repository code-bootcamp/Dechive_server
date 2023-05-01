import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { Comments } from 'src/apis/comments/entities/comment.entity';

@Entity()
@ObjectType()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'text' })
  @Field(() => String)
  content: string;

  @ManyToOne(() => Comments, {
    onDelete: 'CASCADE',
  })
  @Field(() => Comments)
  comment: Comments;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}
