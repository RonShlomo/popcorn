import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { Prisma } from '@prisma/client';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) {}

  @Post()
  create(@Body() showTime: Prisma.ShowtimeCreateInput) {
    return this.showtimesService.create(showTime);
  }

  @Get(':showtimeId')
  findOne(@Param('showtimeId') showtimeId: string) {
    const temp = +showtimeId;
    if(isNaN(temp)) {
      throw new BadRequestException('Invalid showtimeId');
    }
    return this.showtimesService.findOne(+showtimeId);
  }

  @Post('update/:showtimeId')
  update(@Param('showtimeId') showtimeId: string, @Body() showtimeUpdateInput: Prisma.ShowtimeUpdateInput) {
    const temp = +showtimeId;
    if(isNaN(temp)) {
      throw new BadRequestException('Invalid showtimeId');
    }
    return this.showtimesService.update(+showtimeId, showtimeUpdateInput);
  }

  @Delete(':showtimeId')
  remove(@Param('showtimeId') showtimeId: string) {
    const temp = +showtimeId;
    if(isNaN(temp)) {
      throw new BadRequestException('Invalid showtimeId');
    }
    return this.showtimesService.remove(+showtimeId);
  }
}
