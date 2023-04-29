import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import {
  IPicturesServiceDelete,
  IPicturesServiceStorageDelet,
} from './interfaces/pictures-service.interface';
import { Picture } from './entities/picture.entity';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly picturesRepository: Repository<Picture>, //
  ) {}

  createPictures({ uploadFile }): Promise<Picture[]> {
    return Promise.all(
      uploadFile.map((url: string, i: number) => {
        return this.picturesRepository.save({
          url,
          isMain: !i,
        });
      }),
    );
  }

  // imageUpdate 1번 로직
  async delete({ boardid }: IPicturesServiceDelete): Promise<DeleteResult> {
    return this.picturesRepository.delete({ board: { id: boardid } });
  }

  // storage 삭제
  storageDelete({ storageDelet }: IPicturesServiceStorageDelet): void {
    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    });

    const deleteFile = async () => {
      await storage
        .bucket(process.env.GCP_BUCKET)
        .file(`origin/${storageDelet}`)
        .delete();
    };
    deleteFile().catch(console.error);
  }
}
