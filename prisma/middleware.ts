import { Prisma, PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

// Prisma middleware to validate data based on model type
export function prismaMiddleware(client: PrismaClient) {
  client.$use(async (params: Prisma.MiddlewareParams, next) => {
    const data = (params.args as { data?: unknown })?.data;
    const where = (params.args as { where?: unknown })?.where;

    // Validate data for all actions (read and write operations)
    if (params.model && (params.action === 'create' || params.action === 'update')) {
      validateData(params.model, data);
    } else if (params.model)
      validateWhere(params.model, where);

    return next(params);
  });
}

// Validate data based on the model
function validateData(model: string, data: unknown) {
  if (!data) {
    throw new Error(`Validation failed: Missing data for model ${model}`);
  }

  switch (model) {
    case 'Movie':
      validateMovie(data as Prisma.MovieCreateInput);
      break;
    case 'Showtime':
      validateShowtime(data as Prisma.ShowtimeUncheckedCreateInput);
      break;
    case 'Booking':
      validateBooking(data as Prisma.BookingUncheckedCreateInput);
      break;
    default:
      break;
  }
}

function validateWhere(model: string, where: unknown) {
  if (!where) {
    throw new Error(`Validation failed: Missing data for model ${model}`);
  }

  switch (model) {
    case 'Movie':
      validateMovieWhere(where as Prisma.MovieCreateInput);
      break;
    case 'Showtime':
      validateShowtimeWhere(where as Prisma.ShowtimeUncheckedCreateInput);
      break;
    default:
      break;
  }
}

function validateMovie(data: Prisma.MovieCreateInput) {
  if (!data.title || typeof data.title !== 'string') {
    throw new BadRequestException('title must be a non-empty string');
  }
  if (!data.genre || typeof data.genre !== 'string') {
    throw new BadRequestException('genre must be a non-empty string');
  }
  if (data.duration < 1 || typeof data.duration !== 'number') {
    throw new BadRequestException('duration must be an integer greater than 0');
  }
  if (data.rating < 0 || data.rating > 10 || typeof data.rating !== 'number') {
    throw new BadRequestException('rating must be a number between 0 and 10');
  }
  if (data.releaseYear < 1 || typeof data.releaseYear !== 'number') {
    throw new BadRequestException('release year must be an integer greater than 0');
  }
}

function validateShowtime(data: Prisma.ShowtimeUncheckedCreateInput) {
  if (!data.movieId || typeof data.movieId !== 'number' || data.movieId < 0) {
    throw new BadRequestException('movieId must be an integer greater than 0');
  }
  if (data.price < 0 || typeof data.price !== 'number') {
    throw new BadRequestException('price must be a number greater than 0');
  }
  if (!data.theater || typeof data.theater !== 'string') {
    throw new BadRequestException('theater must be a non-empty string');
  }
  if (isNaN(new Date(data.startTime).getTime())) {
    throw new BadRequestException('startTime must be a valid time stamp');
  }
  if (isNaN(new Date(data.endTime).getTime())) {
    throw new BadRequestException('endTime must be a valid time stamp');
  }
}

function validateBooking(data: Prisma.BookingUncheckedCreateInput) {
  if (!data.showtimeId || typeof data.showtimeId !== 'number' || data.showtimeId < 0) {
    throw new BadRequestException('showtimeId must be an integer greater than 0');
  }
  if (!data.seatNumber || typeof data.seatNumber !== 'number' || data.seatNumber < 0) {
    throw new BadRequestException('seatNumber must be an integer greater than 0');
  }
  if (!data.userId || typeof data.userId !== 'string') {
    throw new BadRequestException('userId must be a non-empty string');
  }
}

function validateMovieWhere(data: Prisma.MovieUncheckedCreateInput) {
  const title = data?.title;
  if (title !== undefined && title !== null) {
    if (!title || typeof title !== 'string') {
      throw new BadRequestException('title must be a non-empty string');
    }
  }
  const id = data?.id;
  if (id !== undefined && id !== null) {
    if (id < 0 || typeof id !== 'number') {
      throw new BadRequestException('movieId must be a number greater than 0');
    }
  }
}

function validateShowtimeWhere(data: Prisma.ShowtimeUncheckedCreateInput) {
  const id = data?.id;
  if (id !== undefined && id !== null) {
    if (id < 0 || typeof id !== 'number') {
      throw new BadRequestException('showtimeId must be a number greater than 0');
    }
  }
}
