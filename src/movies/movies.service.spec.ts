import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { DatabaseService } from '../database/database.service';

const databaseServiceMock = {
  movie: {
    create: jest.fn().mockImplementation(item =>  Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}>),
    findMany: jest.fn().mockImplementation(() => Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}[]>),
    findUnique: jest.fn().mockImplementation(item => Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}>),
    update: jest.fn().mockImplementation(item => Promise<{id: number, title: string, genre: string, duration: number, rating: number}>),
    delete: jest.fn().mockImplementation(item => Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}>)
  },
}

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: DatabaseService,
          useValue: databaseServiceMock, // Use mock instead of the actual DatabaseService
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
    expect(await service.create({ title: "Sample Movie Title", genre: "Action", duration: 120, rating: 8.7, releaseYear: 2025 }))
      .toEqual( Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}>);
    expect(databaseServiceMock.movie.create).toHaveBeenCalledWith({data : { title: "Sample Movie Title", genre: "Action", duration: 120, rating: 8.7, releaseYear: 2025}})
  })

  it('should get all movies', async () => {
    expect(await service.findAll()).toEqual( Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}[]>);
    expect(databaseServiceMock.movie.findMany).toHaveBeenCalled()
  })

  it('should update a movie by its title', async () => {
    const title = 'Test Movie';
    const movie = { "title": "Sample Movie Title", "genre": "Action", "duration": 120, "rating": 8.7, "releaseYear": 2025 }	;
    databaseServiceMock.movie.findUnique.mockResolvedValue({ where: { title } });
    databaseServiceMock.movie.update.mockResolvedValue({ where: { title }, data: movie, });

    // Call the method that doesn't return anything
    await service.update(title, movie);

    // Check if delete method was called with the correct arguments
    expect(databaseServiceMock.movie.update).toHaveBeenCalledWith({ where: { title }, data: movie, });
  })

  it('should delete a movie successfully', async () => {
    const title = 'Test Movie';

    const movie = { title, description: 'Test Description' };
    databaseServiceMock.movie.findUnique.mockResolvedValue(movie);
    databaseServiceMock.movie.delete.mockResolvedValue(movie);

    // Call the method that doesn't return anything
    await service.remove(title);

    // Check if delete method was called with the correct arguments
    expect(databaseServiceMock.movie.delete).toHaveBeenCalledWith({ where: { title } });
  });

});
