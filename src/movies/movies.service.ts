import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoviesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(newMovie: Prisma.MovieCreateInput) {
    return this.databaseService.movie.create({
      data: newMovie,
    });
  }

  async findAll() {
    return this.databaseService.movie.findMany();
  }

  async update(title: string, updatedMovie: Prisma.MovieUpdateInput) {
    return this.databaseService.movie.update({
      where: {
        title,
      },
      data: updatedMovie,
    });
  }

  async remove(title: string) {
    return this.databaseService.movie.delete({ where: { title } });
  }
}
