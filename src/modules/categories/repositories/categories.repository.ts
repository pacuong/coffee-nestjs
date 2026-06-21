import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(name: string, slug: string) {
    return this.prisma.category.create({
      data: {
        name,
        slug,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findBySlug(slug: string) {
    return this.prisma.category.findUnique({
      where: {
        slug,
      },
    });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, data: { name?: string; slug?: string }) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
