import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  // @OneToMany(() => Product, (product) => product.board)
  // @Field(() => [Product])
  // products: Product[];

  // @OneToMany(() => Comment, (comments) => comments.board, { nullable: true })
  // @Field(() => Comment, { nullable: true })
  // comments: Comment;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  writer: string;

  // @JoinTable()
  // @ManyToMany(() => Hashtag, (hashtags) => hashtags.boards, { nullable: true })
  // @Field(() => [Hashtag], { nullable: true })
  // hashtags: Hashtag[];

  // @OneToMany(() => Picture, (pictures) => pictures.board)
  // @Field(() => Picture)
  // pictures: Picture;

  // @JoinTable()
  // @ManyToMany(() => User, (viewers) => viewers.boards)
  // @Field(() => [User], { nullable: true })
  // viewers: User[];

  // @JoinTable()
  // @ManyToMany(() => User, (likers) => likers.boards)
  // @Field(() => [User], { nullable: true })
  // likers: User[];

  // @ManyToOne(() => User, (writer) => writer.boards)
  // @Field(() => User)
  // writer: User;

  @Column({ type: 'text' })
  @Field(() => [String])
  pictures: string[];

  @Column({ type: 'text', nullable: true })
  @Field(() => [String], { nullable: true })
  viewers: string[];

  @Column({ type: 'text', nullable: true })
  @Field(() => [String], { nullable: true })
  likers: string[];

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @ManyToOne(() => User, (user) => user.boards, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;
}
