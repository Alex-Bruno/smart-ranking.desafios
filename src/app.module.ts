import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DesafiosModule } from './desafios/desafios.module';
import { PartidasModule } from './partidas/partidas.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://root:A5m9RDBYVVDfKtV@cluster0.y1eby.mongodb.net/srdesafios?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    ),
    DesafiosModule, 
    PartidasModule, 
    ProxyrmqModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
