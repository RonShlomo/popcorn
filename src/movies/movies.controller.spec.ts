import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import any = jasmine.any;

describe('MoviesController', () => {
  let controller: MoviesController;
  const mockMovieService = {
    findAll: jest.fn(()=> Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}[]>),
    create: jest.fn(movie =>  {return { id: 1, ...movie }}),
    update: jest.fn((title, updatedMovie) => Promise<void>),
    remove: jest.fn((title) => Promise<void>)
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).overrideProvider(MoviesService).useValue(mockMovieService).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all movies', () => {
    expect(controller.findAll()).toEqual(Promise<{id: number, title: string, genre: string, duration: number, rating: number, releaseYear: number}[]>);
    expect(mockMovieService.findAll).toHaveBeenCalled();
  })

  it('should create a movie', () => {
    const movie = { title: "taken", genre: "Action", duration: 120, rating: 9.2, releaseYear: 2008 };
    expect(controller.create(movie))
      .toEqual({ id: expect.any(Number), ...movie });
    expect(mockMovieService.create).toHaveBeenCalledWith(movie);
  });

  it('should update a movie', () => {
    const movie = { title: "taken", genre: "Action", duration: 120, rating: 9.2, releaseYear: 2008 };
    expect(controller.update("taken", movie)).toEqual(Promise<void>);
    expect(mockMovieService.update).toHaveBeenCalledWith("taken", movie);
  });

  it('should delete a movie', () => {
    expect(controller.remove("taken")).toEqual(Promise<void>);
    expect(mockMovieService.remove).toHaveBeenCalledWith("taken");
  })
});
