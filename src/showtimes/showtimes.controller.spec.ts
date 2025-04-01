import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesController } from './showtimes.controller';
import { ShowtimesService } from './showtimes.service';
import any = jasmine.any;

describe('ShowtimesController', () => {
  let controller: ShowtimesController;
  const mockShowtimesService = {
    create: jest.fn(showtime =>  {return { id: 1, ...showtime }}),
    findOne: jest.fn(id =>  Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
    update: jest.fn((title, updatedShowtime) => Promise<void>),
    remove: jest.fn((id) => Promise<void>)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowtimesController],
      providers: [ShowtimesService],
    }).overrideProvider(ShowtimesService).useValue(mockShowtimesService).compile();

    controller = module.get<ShowtimesController>(ShowtimesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a showtime', () => {
    const showtime = { movieId: 1, price:20.2, theater: "Sample Theater", startTime: "2025-02-14T11:47:46.125405Z", endTime: "2025-02-14T14:47:46.125405Z" };
    expect(controller.create(showtime))
      .toEqual({ id: expect.any(Number), ...showtime });
    expect(mockShowtimesService.create).toHaveBeenCalledWith(showtime);
  });

  it('should find a showtime by id', () => {
    expect(controller.findOne("1")).toEqual(Promise<{id: 1, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>);
    expect(mockShowtimesService.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a showtime', () => {
    const showTime = { "movieId": 1, "price":50.2, "theater": "Sample Theater", "startTime": "2025-02-14T11:47:46.125405Z", "endTime": "2025-02-14T14:47:46.125405Z" };
    expect(controller.update('1', showTime)).toEqual(Promise<void>);
    expect(mockShowtimesService.update).toHaveBeenCalledWith(1, showTime)
  });

  it('should delete a movie', () => {
    expect(controller.remove("1")).toEqual(Promise<void>);
    expect(mockShowtimesService.remove).toHaveBeenCalledWith(1);
  })
});
