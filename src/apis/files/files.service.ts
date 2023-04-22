import { Storage } from '@google-cloud/storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IFilesServiceUpload } from './interfaces/files-service.interfacs';

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    const awiatedFiles = await Promise.all(files);

    const bucket = process.env.GCP_BUCKET;

    const storage = new Storage({
      projectId: process.env.GCP_PROJECTID,
      keyFilename: process.env.GCP_KEY_FILENAME,
    }).bucket(bucket);

    return Promise.all(
      awiatedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            el.createReadStream()
              .pipe(storage.file(`origin/${el.filename}`).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${el.filename}`))
              .on('error', () => reject('false'));
          }),
      ),
    ).catch(() => {
      throw new HttpException('이미지 업로드 오류', HttpStatus.CONFLICT);
    });
  }
}
