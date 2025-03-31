import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MoviesModule } from './movies/movies.module';
import { ShowtimesModule } from './showtimes/showtimes.module';

@Module({
  imports: [DatabaseModule, MoviesModule, ShowtimesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
