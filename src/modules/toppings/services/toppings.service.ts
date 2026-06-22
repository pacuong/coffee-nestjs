import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { ToppingsRepository } from '../repositories/toppings.repository';

import { CreateToppingDto } from '../dto/create-topping.dto';
import { UpdateToppingDto } from '../dto/update-topping.dto';

import { CloudinaryService } from 'src/integrations/cloudinary/cloudinary.service';

@Injectable()
export class ToppingsService {
  constructor(
    private readonly toppingRepo: ToppingsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateToppingDto, file?: Express.Multer.File) {
    const existing = await this.toppingRepo.findByName(dto.name);

    if (existing) {
      throw new BadRequestException('Topping already exists');
    }

    let image: string | undefined;
    let imagePublicId: string | undefined;

    if (file) {
      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    return this.toppingRepo.create({
      name: dto.name,
      price: new Prisma.Decimal(dto.price),
      image,
      imagePublicId,
    });
  }

  findAll() {
    return this.toppingRepo.findMany();
  }

  async findOne(id: string) {
    const topping = await this.toppingRepo.findById(id);

    if (!topping) {
      throw new NotFoundException('Topping not found');
    }

    return topping;
  }

  async update(id: string, dto: UpdateToppingDto, file?: Express.Multer.File) {
    const topping = await this.findOne(id);

    let image = topping.image;
    let imagePublicId = topping.imagePublicId;

    if (dto.name) {
      const existing = await this.toppingRepo.findByName(dto.name);

      if (existing && existing.id !== id) {
        throw new BadRequestException('Topping already exists');
      }
    }

    if (file) {
      if (imagePublicId) {
        await this.cloudinaryService.deleteImage(imagePublicId);
      }

      const upload = await this.cloudinaryService.uploadImage(file);

      image = upload.url;
      imagePublicId = upload.publicId;
    }

    return this.toppingRepo.update(id, {
      ...(dto.name && {
        name: dto.name,
      }),

      ...(dto.price !== undefined && {
        price: new Prisma.Decimal(dto.price),
      }),

      image,
      imagePublicId,
    });
  }

  async remove(id: string) {
    const topping = await this.findOne(id);

    if (topping.imagePublicId) {
      await this.cloudinaryService.deleteImage(topping.imagePublicId);
    }

    return this.toppingRepo.delete(id);
  }
}
