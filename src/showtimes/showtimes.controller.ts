import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpCode } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Prisma } from '@prisma/client';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @HttpCode(200)
  @Post()
  create(@Body() showTime: Prisma.ShowtimeUncheckedCreateInput) {
    if (typeof showTime.movieId !== "number") {
      throw new BadRequestException(
        `Showtime duration must be exactly ${showTime.movieId} minutes`,
      );
    }
    return this.showtimesService.create(showTime);
  }

  @HttpCode(200)
  @Get(':showtimeId')
  findOne(@Param('showtimeId') showtimeId: string) {
    const temp = +showtimeId;
    if(isNaN(temp) || temp < 1) {
      throw new BadRequestException('showtimeId must be an integer greater than 0');
    }
    return this.showtimesService.findOne(+showtimeId);
  }

  @HttpCode(200)
  @Post('update/:showtimeId')
  update(@Param('showtimeId') showtimeId: string, @Body() showtimeUpdateInput: Prisma.ShowtimeUncheckedCreateInput) {
    const temp = +showtimeId;
    if(isNaN(temp)) {
      throw new BadRequestException('showtimeId must be an integer greater than 0');
    }
    return this.showtimesService.update(+showtimeId, showtimeUpdateInput);
  }

  @HttpCode(200)
  @Delete(':showtimeId')
  remove(@Param('showtimeId') showtimeId: string) {
    const temp = +showtimeId;
    if(isNaN(temp)) {
      throw new BadRequestException('showtimeId must be an integer greater than 0');
    }
    return this.showtimesService.remove(+showtimeId);
  }
}
