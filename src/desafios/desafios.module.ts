import { DesafioSchema } from './interfaces/desafio.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'Desafio', schema: DesafioSchema}
    ])
  ],
  controllers: [DesafiosController],
  providers: [DesafiosService]
})
export class DesafiosModule { }
