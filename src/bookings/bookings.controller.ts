import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { Prisma } from '@prisma/client';


@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() newBooking: Prisma.BookingUncheckedCreateInput) {
    return this.bookingsService.create(newBooking);
  }
}
