import { Controller, Get, Post, Body, Param, Delete, HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Prisma } from '@prisma/client';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @HttpCode(200)
  @Post()
  create(@Body() movie: Prisma.MovieCreateInput) {
    return this.moviesService.create(movie);
  }

  @HttpCode(200)
  @Get('all')
  findAll() {
    return this.moviesService.findAll();
  }

  @HttpCode(200)
  @Post('update/:movieTitle')
  update(
    @Param('movieTitle') movieTitle: string,
    @Body() updatedMovie: Prisma.MovieUpdateInput,
  ) {
    return this.moviesService.update(movieTitle, updatedMovie);
  }

  @HttpCode(200)
  @Delete(':movieTitle')
  remove(@Param('movieTitle') movieTitle: string) {
    return this.moviesService.remove(movieTitle);
  }
}
