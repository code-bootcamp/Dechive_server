import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Picture } from './entities/picture';
import { Storage } from '@google-cloud/storage';
import {
  IPicturesServiceDelete,
  IPicturesServiceStorageDelet,
} from './interfaces/pictures-service.interface';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly picturesRepository: Repository<Picture>, //
  ) {}

  createPictures({ files }): Promise<Picture[]> {
    return;
  }

  //   imageUpdate 1번 로직
  //   async delete({ productId }: IImageServiceDelete) : Promise<DeleteResult> {

  //     return this.imagesRepository.remove(product);
  //   }

  // imageUpdate 2번 로직
  delete({ id }: IPicturesServiceDelete): Promise<DeleteResult> {
    return this.picturesRepository.delete(id);
  }

  // storage 삭제
  storageDelete({ storageDelet }: IPicturesServiceStorageDelet) {
    const bucketName = process.env.GCP_BUCKET;

    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    });

    const deleteFile = async () => {
      await storage.bucket(bucketName).file(storageDelet).delete();
    };
    deleteFile().catch(console.error);
  }
}
