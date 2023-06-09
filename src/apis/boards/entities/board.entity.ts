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
import { User } from 'src/apis/users/entities/user.entity';
import { Comments } from 'src/apis/comments/entities/comment.entity';
import { Picture } from 'src/apis/pictures/entities/picture.entity';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  title: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  recommend: string;

  @Column({ type: 'text' })
  @Field(() => String)
  description: string;

  @OneToMany(() => Product, (product) => product.board, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Product])
  products: Product[];

  @OneToMany(() => Comments, (comments) => comments.board, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Comments], { nullable: true })
  comments: Comments[];

  @JoinTable()
  @ManyToMany(() => Hashtag, (hashtags) => hashtags.boards, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Hashtag], { nullable: true })
  hashtags: Hashtag[];

  @JoinColumn()
  @OneToMany(() => Picture, (pictures) => pictures.board, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Picture])
  pictures: Picture[];

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
  @Field(() => Date)
  createdAt: Date;

  @Column({ type: Number, default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  views: number;

  @Column({ type: Number, default: 0 })
  @Field(() => Int, { defaultValue: 0 })
  likes: number;

  @Field(() => Boolean, { defaultValue: false })
  like: boolean;
}
