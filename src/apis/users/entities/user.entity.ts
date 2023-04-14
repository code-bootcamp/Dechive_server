import { Field, ObjectType } from '@nestjs/graphql';
import { SnsAccount } from 'src/apis/snsAccount/entities/snsAccount.entity';
import {
  Column,
  Entity,
  JoinColumn,
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
  @OneToMany(() => SnsAccount, (snsAccounts) => snsAccounts.user)
  @Field(() => [SnsAccount], { nullable: true })
  snsAccounts: SnsAccount[];
}
