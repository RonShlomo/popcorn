import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { DatabaseService } from '../database/database.service';

const databaseServiceMock = {
  showtime: {
    create: jest.fn().mockImplementation(item => Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
    findUnique: jest.fn().mockImplementation(item => Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
    update: jest.fn().mockImplementation(item => Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
    delete: jest.fn().mockImplementation(item => Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>),
    findFirst: jest.fn().mockImplementation(item => Promise<{id: number,   price: number,   theater: string,   startTime: Date,   endTime: Date,   movieId: number}>),
  },
  movie: {
    findUnique: jest.fn().mockImplementation(item => Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}>),
  },
}

describe('ShowtimesService', () => {
  let service: ShowtimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowtimesService, {
        provide: DatabaseService,
        useValue: databaseServiceMock,
      },],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a showtime', async () => {
    const showtime = {
      movieId: 1, price: 20.2, theater: "Sample Theater", startTime: new Date("2025-02-14T18:47:46.125405Z"), endTime: new Date("2025-02-14T20:47:46.125405Z")
    };

    databaseServiceMock.movie.findUnique.mockResolvedValue({
      id: 1, title: 'Test Movie', genre: 'Action', duration: 120, rating: 5, releaseYear: 2025
    });
    const result = await service.create(showtime);

    expect(result).toEqual( Promise<{id: number,   price: number,   theater: string,   startTime: Date,   endTime: Date,   movieId: number}>);
    expect(databaseServiceMock.showtime.create).toHaveBeenCalledWith({data: showtime})
  });


  it('should get a showtime by its id', async () => {
    const showtimeId = 1;
    expect(await service.findOne(showtimeId)).toEqual(  Promise<{id: number, movieId: number, price: number, theater: string, startTime: Date, endTime: Date}>);
    expect(databaseServiceMock.showtime.findUnique).toHaveBeenCalledWith({ where: { id: showtimeId } })
  })

});
