import { Field, ObjectType } from '@nestjs/graphql';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Followee } from 'src/apis/followees/entities/followees.entity';
import { Following } from 'src/apis/followings/entities/followings.entity';
import { SnsAccount } from 'src/apis/snsAccount/entities/snsAccount.entity';
import { PROVIDER_ENUM } from 'src/commons/interfaces/provider';
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

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @Field(() => String, { nullable: true })
  intro: string;

  @Column({ type: 'text', nullable: true })
  @Field(() => String, { nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: '15' })
  @Field(() => String)
  jobGroup: string;

  @Column({ type: 'enum', enum: PROVIDER_ENUM, default: 'dechive' })
  @Field(() => String)
  provider: string;

  @JoinColumn()
  @OneToMany(() => SnsAccount, (snsAccounts) => snsAccounts.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [SnsAccount], { nullable: true })
  snsAccounts: SnsAccount[];

  @JoinTable()
  @ManyToMany(() => Following, (followings) => followings.users, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Following])
  followings: Following[];

  @JoinTable()
  @ManyToMany(() => Followee, (followees) => followees.users, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Followee])
  followees: Followee[];

  @OneToMany(() => Board, (boards) => boards.writer, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Board], { nullable: true })
  boards: Board[];

  @ManyToMany(() => Board, (like) => like.likers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @Field(() => [Board], { nullable: true })
  like: Board[];
}
