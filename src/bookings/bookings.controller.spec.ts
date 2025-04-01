import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  const mockBookingsService = {
    create: jest.fn(booking =>  { return Promise<{bookingId: string}> })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [BookingsService],
    }).overrideProvider(BookingsService).useValue(mockBookingsService).compile();

    controller = module.get<BookingsController>(BookingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a booking', () => {
    const booking = { "showtimeId": 1, "seatNumber": 15 , userId:"84438967-f68f-4fa0-b620-0f08217e76af"};
    expect(controller.create(booking))
      .toEqual( Promise<{bookingId: string}>);
    expect(mockBookingsService.create).toHaveBeenCalledWith(booking);
  });
});
