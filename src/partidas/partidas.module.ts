import { ProxyrmqModule } from './../proxyrmq/proxyrmq.module';
import { PartidaSchema } from './interfaces/partida.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Partida', schema: PartidaSchema}
    ]),
    ProxyrmqModule
  ],
  controllers: [PartidasController],
  providers: [PartidasService]
})
export class PartidasModule {}
