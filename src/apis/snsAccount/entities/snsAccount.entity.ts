import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SnsAccount {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column()
  @Field(() => String)
  sns: string;

  @ManyToOne(() => User, (user) => user.snsAccounts, {
    onDelete: 'CASCADE',
  })
  @Field(() => User)
  user: User;
}
