// src/database/database.service.ts

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaMiddleware } from '../../prisma/middleware'; // Import the Prisma middleware wrapper

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
    prismaMiddleware(this);
  }

  // Connect to Prisma Client when the module initializes
  async onModuleInit() {
    await this.$connect();
  }

  // Disconnect from Prisma Client when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
