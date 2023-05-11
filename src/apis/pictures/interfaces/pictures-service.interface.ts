import { Board } from 'src/apis/boards/entities/board.entity';

export interface IPicturesServiceStorageDelet {
  storageDelet: string;
}

export interface IPicturesServiceDelete {
  boardid: Board['id'];
}
