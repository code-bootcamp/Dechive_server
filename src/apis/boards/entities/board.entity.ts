import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hashtag } from '../../hashtags/entities/hashtag.entity';
import { Product } from '../../products/entities/product.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { Picture } from 'src/apis/pictures/entities/picture';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @Field(() => String, { nullable: true })
  recommend: string;

  @Column({ type: 'text' })
  @Field(() => String)
  description: string;

  @JoinColumn()
  @OneToMany(() => Product, (product) => product.board, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Product])
  products: Product[];

  @OneToMany(() => Comment, (comments) => comments.board, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Comment], { nullable: true })
  comments: Comment[];

  @JoinTable()
  @ManyToMany(() => Hashtag, (hashtags) => hashtags.boards, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Hashtag], { nullable: true })
  hashtags: Hashtag[];

  // @OneToMany(() => Picture, (pictures) => pictures.board)
  // @Field(() => [Picture])
  // pictures: Picture[];

  @JoinTable()
  @ManyToMany(() => User, (viewers) => viewers.view, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [User], { nullable: true })
  viewers: User[];

  @JoinTable()
  @ManyToMany(() => User, (likers) => likers.like, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [User], { nullable: true })
  likers: User[];

  @ManyToOne(() => User, (writer) => writer.boards, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  writer: User;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Column({ type: Number, default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  views: number;

  @Column({ default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  likes: number;
}
