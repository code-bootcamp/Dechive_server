import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Picture } from './entities/picture';

@Injectable()
export class PicturesService {
  constructor(
    @InjectRepository(Picture)
    private readonly picturesRepository: Repository<Picture>, //
  ) {}

  createPictures({ files }): Promise<Picture[]> {
    return;
  }
}
