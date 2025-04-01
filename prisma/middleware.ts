// src/database/prisma-middleware.ts

import { Prisma, PrismaClient } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

// Prisma middleware to validate data based on model type
export function prismaMiddleware(client: PrismaClient) {
  client.$use(async (params: Prisma.MiddlewareParams, next) => {
    const data = (params.args as { data?: unknown })?.data;

    if (
      (params.action === 'create' || params.action === 'update') &&
      params.model
    ) {
      console.log(`the requested action is ${params.action} a ${params.model}`);
      validateData(params.model, data);
    }

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
    default:
      break;
  }
}

// Type-safe validation for the Movie model
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
    throw new BadRequestException('movieId must be a number greater than 0');
  }
  if (data.price < 0 || typeof data.price !== 'number') {
    throw new BadRequestException('price must be a number greater than 0');
  }
  if (!data.theater || typeof data.theater !== 'string') {
    throw new BadRequestException('duration must be a non-empty string');
  }
  if (isNaN(new Date(data.startTime).getTime())) {
    throw new BadRequestException('startTime must be a valid time stamp');
  }
  if (isNaN(new Date(data.endTime).getTime())) {
    throw new BadRequestException('endTime must be a valid time stamp');
  }
}
