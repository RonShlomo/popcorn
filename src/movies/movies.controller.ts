import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  create(@Body() movie: Prisma.MovieCreateInput) {
    return this.moviesService.create(movie);
  }

  @Get('all')
  findAll() {
    return this.moviesService.findAll();
  }

  @Post('update/:movieTitle')
  update(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: Prisma.MovieUpdateInput,
  ) {
    return this.moviesService.update(movieTitle, updatedMovie);
  }

  @Delete(':movieTitle')
  remove(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.remove(movieTitle);
  }
}
