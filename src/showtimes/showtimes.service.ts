import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ShowtimesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(showTime: Prisma.ShowtimeUncheckedCreateInput) {
    //Validate movie existence
    const wantedMovie = await this.validateMovie(showTime.movieId);

    //Validate duration
    this.validateShowtimeDuration(showTime.startTime, showTime.endTime, wantedMovie.duration);

    //Check for overlapping showtimes
    await this.checkOverlappingShowtimes(showTime);

    return this.databaseService.showtime.create({ data: showTime });
  }

  async findOne(showtimeId: number) {
    const showTime = await this.validateShowtime(showtimeId);
    if(!showTime) {
      throw new NotFoundException(`showTime with id "${showtimeId}" not found`);
    }
    return showTime
  }

  async update(id: number, updateInput: Prisma.ShowtimeUncheckedCreateInput) {
    //Validate showtime existence
    await this.validateShowtime(id);

    //Validate movie existence
    const wantedMovie = await this.validateMovie(updateInput.movieId);

    //Validate duration
    this.validateShowtimeDuration(updateInput.startTime, updateInput.endTime, wantedMovie.duration);

    //Check for overlapping showtimes
    await this.checkOverlappingShowtimes(updateInput, id);

    return this.databaseService.showtime.update({
      where: { id },
      data: updateInput,
    });
  }

  async remove(id: number) {
    const showTime = await this.databaseService.showtime.findUnique({
      where: {
        id
      }
    })

    if(!showTime) {
      throw new NotFoundException(`showTime with id "${id}" not found`);
    }
    await this.databaseService.showtime.delete({ where: { id } });
    return;
  }

  //Check if a movie exists
  private async validateMovie(movieId: number) {
    const movie = await this.databaseService.movie.findUnique({ where: { id: movieId } });
    if (!movie) throw new NotFoundException(`Movie with id "${movieId}" not found`);
    return movie;
  }

  //Check if a showtime exists
  private async validateShowtime(showtimeId: number) {
    const showtime = await this.databaseService.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) throw new NotFoundException(`Showtime with id "${showtimeId}" not found`);
    return showtime;
  }

  //Validate duration
  private validateShowtimeDuration(startTime: Date | string, endTime: Date | string, expectedDuration: number) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const durationMinutes = (end - start) / (1000 * 60);

    if (durationMinutes !== expectedDuration) {
      throw new BadRequestException(`Showtime duration must be exactly ${expectedDuration} minutes`);
    }
  }

  //Check for overlapping showtimes
  private async checkOverlappingShowtimes(showTime: Prisma.ShowtimeUncheckedCreateInput, excludeId?: number) {
    const overlappingShowtime = await this.databaseService.showtime.findFirst({
      where: {
        theater: showTime.theater,
        OR: [
          {
            endTime: {
              gte: showTime.startTime,
              lte: showTime.endTime,
            },
          },
          {
            startTime: {
              gte: showTime.startTime,
              lte: showTime.endTime,
            },
          },
        ],
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    console.log(`overlap ${overlappingShowtime}`)
    if (overlappingShowtime?.id !== undefined) {
      throw new BadRequestException(`The requested screening time overlaps with showtime ${overlappingShowtime.id}`);
    }
  }
}
