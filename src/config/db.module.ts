import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const db_url = 'mongodb://localhost:27017/monielock'

// const db_url = process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/nest' : 'mongodb+srv://username:password@cluster0.example.mongodb.net/nest?retryWrites=true&w=majority'
@Module({
  imports: [
    MongooseModule.forRoot(db_url)
  ],
})
export class DBModule {}