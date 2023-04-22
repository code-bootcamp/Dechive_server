import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Followee {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Field(() => String)
  followeeid: string;

  @ManyToMany(() => User, (users) => users.followees, {
    onDelete: 'CASCADE',
  })
  @Field(() => [User])
  users: User[];
}
