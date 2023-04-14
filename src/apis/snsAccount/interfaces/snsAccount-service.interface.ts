import { User } from 'src/apis/users/entities/user.entity';
import { SnsAccount } from '../entities/snsAccount.entity';

export interface ISnsAccountServiceDelete {
  sns: SnsAccount['sns'];
  user: User;
}

export interface ISnsAccountServiceCreate {
  sns: SnsAccount['sns'];
}
