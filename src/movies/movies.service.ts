import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MoviesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(newMovie: Prisma.MovieCreateInput) {
    try {
      return await this.databaseService.movie.create({
        data: newMovie,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`A movie with title "${newMovie.title}" already exists.`);
      }
      throw error; // Re-throw other unexpected errors
    }
  }

  async findAll() {
    return this.databaseService.movie.findMany();
  }

  async update(title: string, updatedMovie: Prisma.MovieUpdateInput) {
    const wantedMovie = await this.databaseService.movie.findUnique({
      where: { title },
    });
    if (!wantedMovie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }
    try {
      await this.databaseService.movie.update({
        where: {
          title,
        },
        data: updatedMovie,
      });
      return Promise<void>;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `A movie with title "${updatedMovie.title}" already exists.`,
        );
      }
      throw error; // Re-throw other unexpected errors
    }
  }

  async remove(title: string) {
    const wantedMovie = await this.databaseService.movie.findUnique({ where: { title } });
    if (!wantedMovie) {
      throw new NotFoundException(`Movie with title "${title}" not found`);
    }
    await this.databaseService.movie.delete({ where: { title } });
    return;
  }
}
