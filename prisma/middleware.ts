// src/database/prisma-middleware.ts

import { Prisma, PrismaClient } from '@prisma/client';

// Prisma middleware to validate data based on model type
export function prismaMiddleware(client: PrismaClient) {
  client.$use(async (params: Prisma.MiddlewareParams, next) => {
    const data = (params.args as { data?: unknown })?.data;

    if (
      (params.action === 'create' || params.action === 'update') &&
      params.model
    ) {
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
      validateMovie(data as Prisma.MovieCreateInput); // Use the Prisma-generated type for Movie
      break;
    default:
      break;
  }
}

// Type-safe validation for the Movie model
function validateMovie(data: Prisma.MovieCreateInput) {
  if (!data.title) {
    throw new Error('Invalid title');
  }
  if (!data.genre) {
    throw new Error('Invalid genre');
  }
  if (data.duration <= 0) {
    throw new Error('Invalid duration');
  }
  if (data.rating < 0 || data.rating > 10) {
    throw new Error('Invalid rating');
  }
  if (data.releaseYear < 1) {
    throw new Error('Invalid release year');
  }
}
