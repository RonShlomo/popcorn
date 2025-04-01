import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookingsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(newBooking: Prisma.BookingUncheckedCreateInput) {
    const showtime = await this.databaseService.showtime.findUnique({
      where: { id: newBooking.showtimeId },
      include: { bookings: true },
    });

    //Check if a showtime exists
    if (!showtime) throw new NotFoundException(`Showtime with id "${newBooking.showtimeId}" not found`);

    //Check if the seatNumber already exists in the showtime's bookings
    if (showtime?.bookings?.some(booking => booking.seatNumber === newBooking.seatNumber)) {
      throw new ConflictException(`Seat number ${newBooking.seatNumber} is already booked for this showtime.`);
    }

    //Check if the showtime is still available
    const now = new Date();
    const startTime = new Date(showtime.startTime); // Assuming showtime.startTime is a Date object or string

    if (startTime < now) {
      throw new BadRequestException('The start time of this showtime has already passed');
    }

    return this.databaseService.booking.create({ data: newBooking });

  }
}
