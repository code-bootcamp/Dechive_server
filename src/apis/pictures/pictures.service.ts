import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import {
  IPicturesServiceDelete,
  IPicturesServiceStorageDelet,
} from './interfaces/pictures-service.interface';
import { Picture } from './entities/picture.entity';
import { Board } from '../boards/entities/board.entity';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly picturesRepository: Repository<Picture>, //
  ) {}

  createPictures({ uploadFile }): Promise<Picture[]> {
    let i = 0;
    return Promise.all(
      uploadFile.map((url: string) => {
        return this.picturesRepository.save({
          url,
          isMain: !i++,
        });
      }),
    );
  }

  // imageUpdate 1번 로직
  async delete({ boardid }: IPicturesServiceDelete): Promise<DeleteResult> {
    return this.picturesRepository.delete({ board: { id: boardid } });
  }

  // imageUpdate 2번 로직
  // delete({ id }: IPicturesServiceDelete): Promise<DeleteResult> {
  //   return this.picturesRepository.delete(id);
  // }

  // storage 삭제
  storageDelete({ storageDelet }: IPicturesServiceStorageDelet) {
    const bucketName = process.env.GCP_BUCKET;

    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    });

    const deleteFile = async () => {
      await storage.bucket(bucketName).file(`origin/${storageDelet}`).delete();
    };
    deleteFile().catch(console.error);
  }
}
