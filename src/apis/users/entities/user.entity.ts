import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Following } from 'src/apis/followings/entities/followings.entity';
import { SnsAccount } from 'src/apis/snsAccount/entities/snsAccount.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  email: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  nickName: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field(() => String, { nullable: true })
  intro: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  picture: string;

  @JoinColumn()
  @OneToMany(() => SnsAccount, (snsAccounts) => snsAccounts.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [SnsAccount], { nullable: true })
  snsAccounts: SnsAccount[];

  @JoinTable()
  @ManyToMany(() => Following, (followings) => followings.users)
  @Field(() => [Following])
  followings: Following[];

  @OneToMany(() => Board, (boards) => boards.writer, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Board], { nullable: true })
  boards: Board[];

  @ManyToMany(() => Board, (view) => view.viewers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Board], { nullable: true })
  view: Board[];

  @ManyToMany(() => Board, (like) => like.likers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Board], { nullable: true })
  like: Board[];
}
