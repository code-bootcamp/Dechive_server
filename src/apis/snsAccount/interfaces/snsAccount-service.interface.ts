import { User } from 'src/apis/users/entities/user.entity';
import { SnsAccount } from '../entities/snsAccount.entity';

export interface ISnsAccountServiceDelete {
  id: SnsAccount['sns'];
}

export interface ISnsAccountServiceCreate {
  snsAcounts: { sns: SnsAccount['sns'] }[];
}

export interface ISnsAccountServiceFindeSnsNames {
  id: User['id'];
}
