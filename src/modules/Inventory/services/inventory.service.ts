import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InventoryRepository } from '../repositories/inventory.repository';

import { IngredientsRepository } from '../../ingredients/repositories/ingredients.repository';

import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepo: InventoryRepository,
    private readonly ingredientRepo: IngredientsRepository,
  ) {}

  async create(dto: CreateInventoryDto) {
    const ingredient = await this.ingredientRepo.findById(dto.ingredientId);

    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    const existing = await this.inventoryRepo.findByIngredientId(
      dto.ingredientId,
    );

    if (existing) {
      throw new ConflictException('Inventory already exists');
    }

    return this.inventoryRepo.create({
      quantity: dto.quantity,
      ingredient: {
        connect: {
          id: dto.ingredientId,
        },
      },
    });
  }

  findAll() {
    return this.inventoryRepo.findMany();
  }

  async findOne(id: string) {
    const inventory = await this.inventoryRepo.findById(id);

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id);

    return this.inventoryRepo.update(id, {
      quantity: dto.quantity,
    });
  }
}
