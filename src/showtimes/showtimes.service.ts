import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ShowtimesService {
  constructor(private readonly databaseService: DatabaseService) {}
  async create(showTime: Prisma.ShowtimeCreateInput) {
    return this.databaseService.showtime.create({
      data: showTime,
    });
  }

  async findOne(showTime: number) {
    return this.databaseService.showtime.findUnique({
      where: {
        id: showTime
      }
    })
  }

  update(id: number, updateInput: Prisma.ShowtimeUpdateInput) {
    return this.databaseService.showtime.update({
      where: {
        id,
      },
      data: updateInput,
    });
  }

  async remove(id: number) {
    return this.databaseService.showtime.delete({ where: { id } });
  }
}
