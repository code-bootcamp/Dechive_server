import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Following {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => String)
  followingid: string;

  @ManyToMany(() => User, (users) => users.followings, {
    onDelete: 'CASCADE',
  })
  @Field(() => [User])
  users: User[];
}
