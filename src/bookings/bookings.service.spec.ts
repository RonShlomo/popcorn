import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

const databaseServiceMock = {
  booking:{
    create: jest.fn().mockImplementation(item => Promise<{bookingId: string, showtimeId: number, seatNumber: number, userId: string}>)
  },
  showtime: {
    findUnique: jest.fn().mockImplementation(item => Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
  }
}

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService,
        {
          provide: DatabaseService,
          useValue: databaseServiceMock, // Use mock instead of the actual DatabaseService
        },],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a booking', async () => {
    const booking = { showtimeId: 1, seatNumber: 15, userId: "84438967-f68f-4fa0-b620-0f08217e76af" };

    // Mocking the return value of showtime.findUnique
    databaseServiceMock.showtime.findUnique.mockResolvedValue({
      id: booking.showtimeId,
      movieId: 1,
      price: 20.0,
      theater: "Sample Theater",
      startTime: new Date("2026-02-14T11:47:46.125Z"),
      endTime: new Date("2026-02-14T13:47:46.125Z"),
      bookings: [],
    });

    // Mocking the return value of booking.create
    databaseServiceMock.booking.create.mockResolvedValue({
      bookingId: "12345", // Mocked bookingId value
      showtimeId: booking.showtimeId,
      seatNumber: booking.seatNumber,
      userId: booking.userId,
    });

    const result = await service.create(booking);

    expect(result).toEqual({ bookingId: "12345" });  // The actual result is { bookingId: "12345" }

    expect(databaseServiceMock.booking.create).toHaveBeenCalledWith({ data: booking });
  });

});
